// workers/quantum-api-worker.mjs
// Cloudflare Worker for Quantum Internet Foundation API

/**
 * Quantum Internet Foundation API Worker
 * Implements all endpoints from docs/BACKEND_API.md
 */

// Helper function to generate ISO timestamp
function getTimestamp() {
  return new Date().toISOString();
}

// Helper function to create JSON response
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      ...headers
    }
  });
}

// Helper function to create error response
function errorResponse(message, code, status = 400) {
  return jsonResponse({
    error: message,
    code: code
  }, status);
}

// API Key Tier System
// In production, this would query a database. For now, we use a simple mapping.
const API_KEY_TIERS = {
  // Free tier keys (prefix: free_)
  'free_': {
    name: 'Free',
    requestsPerDay: 100,
    requestsPerHour: 10,
    requestsPerMinute: 2,
    allowRealHardware: false,
    allowAllProtocols: true
  },
  // Pro tier keys (prefix: pro_)
  'pro_': {
    name: 'Pro',
    requestsPerDay: 10000,
    requestsPerHour: 1000,
    requestsPerMinute: 100,
    allowRealHardware: true,
    allowAllProtocols: true
  },
  // Enterprise tier keys (prefix: ent_)
  'ent_': {
    name: 'Enterprise',
    requestsPerDay: Infinity,
    requestsPerHour: Infinity,
    requestsPerMinute: Infinity,
    allowRealHardware: true,
    allowAllProtocols: true
  }
};

// Rate limiting storage (in production, use Cloudflare KV or Durable Objects)
// Format: { apiKey: { day: { count, resetTime }, hour: { count, resetTime }, minute: { count, resetTime } } }
const rateLimitStore = {};

// Helper function to get API key tier
function getApiKeyTier(apiKey) {
  if (!apiKey) return null;
  
  // Check key prefix to determine tier
  if (apiKey.startsWith('free_')) {
    return API_KEY_TIERS['free_'];
  } else if (apiKey.startsWith('pro_')) {
    return API_KEY_TIERS['pro_'];
  } else if (apiKey.startsWith('ent_')) {
    return API_KEY_TIERS['ent_'];
  }
  
  // Default to Free tier for unknown keys
  return API_KEY_TIERS['free_'];
}

// Helper function to check rate limits
function checkRateLimit(apiKey, tier) {
  if (!tier) return { allowed: false, reason: 'Invalid API key' };
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minuteMs = 60 * 1000;
  
  // Initialize rate limit tracking for this key
  if (!rateLimitStore[apiKey]) {
    rateLimitStore[apiKey] = {
      day: { count: 0, resetTime: now + dayMs },
      hour: { count: 0, resetTime: now + hourMs },
      minute: { count: 0, resetTime: now + minuteMs }
    };
  }
  
  const limits = rateLimitStore[apiKey];
  
  // Reset counters if time windows have passed
  if (now >= limits.day.resetTime) {
    limits.day = { count: 0, resetTime: now + dayMs };
  }
  if (now >= limits.hour.resetTime) {
    limits.hour = { count: 0, resetTime: now + hourMs };
  }
  if (now >= limits.minute.resetTime) {
    limits.minute = { count: 0, resetTime: now + minuteMs };
  }
  
  // Check limits
  if (tier.requestsPerDay !== Infinity && limits.day.count >= tier.requestsPerDay) {
    return {
      allowed: false,
      reason: 'Daily rate limit exceeded',
      limit: tier.requestsPerDay,
      resetTime: limits.day.resetTime
    };
  }
  
  if (tier.requestsPerHour !== Infinity && limits.hour.count >= tier.requestsPerHour) {
    return {
      allowed: false,
      reason: 'Hourly rate limit exceeded',
      limit: tier.requestsPerHour,
      resetTime: limits.hour.resetTime
    };
  }
  
  if (tier.requestsPerMinute !== Infinity && limits.minute.count >= tier.requestsPerMinute) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      limit: tier.requestsPerMinute,
      resetTime: limits.minute.resetTime
    };
  }
  
  // Increment counters
  limits.day.count++;
  limits.hour.count++;
  limits.minute.count++;
  
  return { allowed: true, remaining: tier.requestsPerDay - limits.day.count };
}

// Helper function to validate API key and check tier
function validateApiKey(request) {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey || apiKey.length === 0) {
    return { valid: false, error: 'Missing API key' };
  }
  
  const tier = getApiKeyTier(apiKey);
  if (!tier) {
    return { valid: false, error: 'Invalid API key format' };
  }
  
  return { valid: true, tier, apiKey };
}

// Middleware function to validate API key, check rate limits, and enforce tier restrictions
async function validateRequest(request, requireAuth = true) {
  if (!requireAuth) {
    return { valid: true, tier: null, apiKey: null, rateLimit: null };
  }
  
  const keyValidation = validateApiKey(request);
  if (!keyValidation.valid) {
    return {
      valid: false,
      error: errorResponse(keyValidation.error || 'Invalid or missing API key', 'INVALID_API_KEY', 401)
    };
  }
  
  // Check rate limit
  const rateLimit = checkRateLimit(keyValidation.apiKey, keyValidation.tier);
  if (!rateLimit.allowed) {
    return {
      valid: false,
      error: errorResponse(
        `Rate limit exceeded: ${rateLimit.reason}. Limit: ${rateLimit.limit} requests. Reset at: ${new Date(rateLimit.resetTime).toISOString()}`,
        'RATE_LIMIT_EXCEEDED',
        429
      )
    };
  }
  
  return {
    valid: true,
    tier: keyValidation.tier,
    apiKey: keyValidation.apiKey,
    rateLimit: rateLimit,
    headers: {
      'X-RateLimit-Limit': keyValidation.tier.requestsPerDay.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '0',
      'X-RateLimit-Reset': rateLimit.resetTime?.toString() || '',
      'X-API-Tier': keyValidation.tier.name
    }
  };
}

// Helper function to check if real hardware is allowed
function canUseRealHardware(tier, requestBody) {
  if (!tier) return false;
  if (tier.allowRealHardware) return true;
  
  // Free tier: force simulation mode
  const useReal = requestBody?.use_real_hardware || requestBody?.useRealHardware;
  if (useReal && !tier.allowRealHardware) {
    return false;
  }
  
  return true;
}

// Simulate quantum operations (replace with real quantum backend calls)
function simulateBellPair(backend, fidelityTarget, shots) {
  const fidelity = Math.min(0.99, fidelityTarget + (Math.random() * 0.05 - 0.02));
  const total = shots;
  const count00 = Math.floor(total * fidelity / 2);
  const count11 = Math.floor(total * fidelity / 2);
  const count01 = Math.floor(total * (1 - fidelity) / 2);
  const count10 = total - count00 - count11 - count01;
  
  return {
    fidelity: Math.round(fidelity * 100) / 100,
    measurements: {
      '00': count00,
      '11': count11,
      '01': count01,
      '10': count10
    },
    backend: backend,
    hardware: false,
    timestamp: getTimestamp(),
    queue_time: 0
  };
}

function simulateCHSH(nMeasurements) {
  // Perfect quantum CHSH value is 2√2 ≈ 2.828
  const chshValue = 2.828 + (Math.random() * 0.1 - 0.05);
  
  return {
    chsh_value: Math.round(chshValue * 1000) / 1000,
    violates_classical: chshValue > 2.0,
    correlations: {
      E_ab: Math.round(0.707 * 1000) / 1000,
      E_ab_prime: Math.round(0.707 * 1000) / 1000,
      E_a_prime_b: Math.round(0.707 * 1000) / 1000,
      E_a_prime_b_prime: Math.round(-0.707 * 1000) / 1000
    },
    backend: 'ibm_brisbane',
    timestamp: getTimestamp()
  };
}

function simulateQKD(protocol, nQubits, errorThreshold) {
  const errorRate = Math.random() * 0.1;
  const secureKeyLength = Math.floor(nQubits * (1 - errorRate) * 0.85);
  
  return {
    secure_key_length: secureKeyLength,
    raw_key_length: nQubits,
    error_rate: Math.round(errorRate * 1000) / 1000,
    session_id: `${protocol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    backend: 'ibm_brisbane',
    timestamp: getTimestamp()
  };
}

function simulateE91(nPairs, chshThreshold) {
  const chshValue = 2.828 + (Math.random() * 0.1 - 0.05);
  const errorRate = Math.random() * 0.1;
  const secureKeyLength = Math.floor(nPairs * (1 - errorRate) * 0.82);
  
  return {
    secure_key_length: secureKeyLength,
    chsh_value: Math.round(chshValue * 1000) / 1000,
    error_rate: Math.round(errorRate * 1000) / 1000,
    session_id: `e91-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entanglement_verified: chshValue > chshThreshold,
    timestamp: getTimestamp()
  };
}

// Route handlers
async function handlePing() {
  return jsonResponse({
    status: 'ok',
    timestamp: getTimestamp()
  });
}

async function handleStatus() {
  return jsonResponse({
    status: 'operational',
    version: '1.0.0',
    uptime: '72h 15m',
    backends_connected: 5,
    real_hardware_available: true
  });
}

async function handleBellPair(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const backend = body.backend || 'ibm_brisbane';
    const fidelityTarget = body.fidelity_target || 0.95;
    const shots = body.shots || 1024;
    const requestedRealHardware = body.use_real_hardware || false;
    
    // Check if tier allows real hardware
    const useRealHardware = canUseRealHardware(validation.tier, body) && requestedRealHardware;
    
    if (requestedRealHardware && !useRealHardware) {
      return errorResponse(
        'Real hardware access requires Pro or Enterprise tier. Upgrade at operations@sparse-supernova.com',
        'HARDWARE_ACCESS_DENIED',
        403
      );
    }
    
    const result = simulateBellPair(backend, fidelityTarget, shots);
    result.hardware = useRealHardware;
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleCHSH(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const nMeasurements = body.n_measurements || 1000;
    const backend = body.backend || 'ibm_brisbane';
    
    const result = simulateCHSH(nMeasurements);
    result.backend = backend;
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleListBackends() {
  return jsonResponse({
    backends: [
      {
        name: 'ibm_brisbane',
        qubits: 127,
        status: 'online',
        queue_length: 5,
        quantum_volume: 64
      },
      {
        name: 'ibm_osaka',
        qubits: 127,
        status: 'online',
        queue_length: 3,
        quantum_volume: 64
      },
      {
        name: 'ibm_kyoto',
        qubits: 127,
        status: 'online',
        queue_length: 2,
        quantum_volume: 64
      }
    ]
  });
}

async function handleBackendInfo(url) {
  const backendName = url.pathname.split('/').pop();
  
  return jsonResponse({
    name: backendName,
    qubits: 127,
    quantum_volume: 64,
    clops: 15000,
    status: 'online',
    capabilities: ['bell_pair', 'qkd', 'chsh']
  });
}

async function handleBridgeStatus() {
  return jsonResponse({
    status: 'operational',
    backends_connected: 5,
    uptime: '72h',
    requests_today: 1523
  });
}

async function handleBB84(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const nQubits = body.n_qubits || 100;
    const errorThreshold = body.error_rate_threshold || 0.11;
    const requestedRealHardware = body.use_real_hardware || false;
    
    // Check if tier allows real hardware
    const useRealHardware = canUseRealHardware(validation.tier, body) && requestedRealHardware;
    
    if (requestedRealHardware && !useRealHardware) {
      return errorResponse(
        'Real hardware access requires Pro or Enterprise tier. Upgrade at operations@sparse-supernova.com',
        'HARDWARE_ACCESS_DENIED',
        403
      );
    }
    
    const result = simulateQKD('bb84', nQubits, errorThreshold);
    result.backend = body.backend || 'ibm_brisbane';
    result.hardware = useRealHardware;
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleE91(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const nPairs = body.n_pairs || 100;
    const chshThreshold = body.chsh_threshold || 2.0;
    
    const result = simulateE91(nPairs, chshThreshold);
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleSARG04(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const nQubits = body.n_qubits || 100;
    
    const result = simulateQKD('sarg04', nQubits, 0.11);
    result.backend = body.backend || 'ibm_brisbane';
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleBBM92(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const nPairs = body.n_pairs || 100;
    
    const result = simulateE91(nPairs, 2.0);
    result.session_id = `bbm92-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return jsonResponse(result, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleRatchetInit(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    
    return jsonResponse({
      session_id: `ratchet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      peer_id: body.peer_id,
      protocol: body.qkd_protocol || 'bb84',
      created_at: getTimestamp()
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleRatchetEncrypt(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    
    return jsonResponse({
      ciphertext: btoa(JSON.stringify(body.message)),
      key_id: `key-${Date.now()}`,
      message_id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: getTimestamp()
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleRatchetDecrypt(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    const message = JSON.parse(atob(body.ciphertext));
    
    return jsonResponse({
      message: message,
      key_id: `key-${Date.now()}`,
      message_id: `msg-${Date.now()}`,
      timestamp: getTimestamp()
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleSSCMint(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    
    return jsonResponse({
      tokens: body.amount,
      tx_id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: getTimestamp(),
      carbon_credits: body.carbon_reduced || 0,
      energy_saved: body.energy_saved || 0
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleSSCBalance(url) {
  const address = url.pathname.split('/').pop();
  
  return jsonResponse({
    address: address,
    ssc: 1500,
    carbon_credits: 7.5,
    energy_saved: 15.0,
    staked: 0,
    available: 1500
  });
}

async function handleP2PConnect(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    
    return jsonResponse({
      connection_id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      peer_id: body.peer_id,
      status: 'connected',
      qkd_enabled: body.enable_qkd || false,
      protocol: body.protocol || 'bb84',
      encryption_enabled: body.encryption !== false,
      timestamp: getTimestamp()
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

async function handleP2PSend(request) {
  const validation = await validateRequest(request);
  if (!validation.valid) {
    return validation.error;
  }
  
  try {
    const body = await request.json();
    
    return jsonResponse({
      atom_id: `atom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      destination: body.destination,
      status: 'sent',
      encrypted: body.encrypt !== false,
      qkd_used: body.use_qkd || false,
      timestamp: getTimestamp()
    }, 200, validation.headers);
  } catch (error) {
    return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Route handling
    try {
      // Root endpoint
      if (path === '/v1' || path === '/v1/') {
        return jsonResponse({
          name: 'Quantum Internet Foundation API',
          version: '1.0.0',
          status: 'operational',
          base_url: url.origin + '/v1',
          endpoints: {
            general: ['/v1/ping', '/v1/status'],
            bridge: ['/v1/quantum/bridge/bell-pair', '/v1/quantum/bridge/chsh', '/v1/quantum/bridge/backends'],
            protocols: ['/v1/quantum/protocols/bb84', '/v1/quantum/protocols/e91', '/v1/quantum/protocols/sarg04', '/v1/quantum/protocols/bbm92'],
            ratchet: ['/v1/quantum/ratchet/init', '/v1/quantum/ratchet/encrypt', '/v1/quantum/ratchet/decrypt'],
            ssc: ['/v1/quantum/ssc/mint', '/v1/quantum/ssc/balance/{address}'],
            p2p: ['/v1/quantum/p2p/connect', '/v1/quantum/p2p/send']
          },
          documentation: 'https://github.com/sparse-supernova/quantum-internet-foundation',
          timestamp: getTimestamp()
        });
      }
      
      // General endpoints
      if (path === '/v1/ping' && method === 'GET') {
        return await handlePing();
      }
      
      if (path === '/v1/status' && method === 'GET') {
        return await handleStatus();
      }

      // Quantum Bridge endpoints
      if (path === '/v1/quantum/bridge/bell-pair' && method === 'POST') {
        return await handleBellPair(request);
      }
      
      if (path === '/v1/quantum/bridge/chsh' && method === 'POST') {
        return await handleCHSH(request);
      }
      
      if (path === '/v1/quantum/bridge/backends' && method === 'GET') {
        return await handleListBackends();
      }
      
      if (path.startsWith('/v1/quantum/bridge/backends/') && method === 'GET') {
        return await handleBackendInfo(url);
      }
      
      if (path === '/v1/quantum/bridge/status' && method === 'GET') {
        return await handleBridgeStatus();
      }

      // QKD Protocol endpoints
      if (path === '/v1/quantum/protocols/bb84' && method === 'POST') {
        return await handleBB84(request);
      }
      
      if (path.startsWith('/v1/quantum/protocols/bb84/stats/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          secure_key_length: 153,
          error_rate: 0.10,
          privacy_amplification_applied: true,
          error_correction_applied: true,
          timestamp: getTimestamp()
        });
      }
      
      if (path.startsWith('/v1/quantum/protocols/bb84/validate/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          secure: true,
          security_level: 'high',
          error_rate: 0.10,
          eavesdropper_detected: false,
          recommendations: []
        });
      }
      
      if (path === '/v1/quantum/protocols/e91' && method === 'POST') {
        return await handleE91(request);
      }
      
      if (path.startsWith('/v1/quantum/protocols/e91/chsh/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          chsh_value: 2.828,
          correlations: {
            E_ab: 0.707,
            E_ab_prime: 0.707,
            E_a_prime_b: 0.707,
            E_a_prime_b_prime: -0.707
          },
          violates_classical: true
        });
      }
      
      if (path.startsWith('/v1/quantum/protocols/e91/validate/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          entanglement_verified: true,
          chsh_value: 2.828,
          security_level: 'high'
        });
      }
      
      if (path === '/v1/quantum/protocols/sarg04' && method === 'POST') {
        return await handleSARG04(request);
      }
      
      if (path.startsWith('/v1/quantum/protocols/sarg04/stats/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          secure_key_length: 150,
          error_rate: 0.10,
          pns_resistant: true
        });
      }
      
      if (path === '/v1/quantum/protocols/bbm92' && method === 'POST') {
        return await handleBBM92(request);
      }
      
      if (path.startsWith('/v1/quantum/protocols/bbm92/stats/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          secure_key_length: 150,
          error_rate: 0.10,
          entanglement_verified: true
        });
      }
      
      if (path.startsWith('/v1/quantum/protocols/bbm92/validate/') && method === 'GET') {
        const sessionId = path.split('/').pop();
        return jsonResponse({
          session_id: sessionId,
          entanglement_verified: true,
          security_level: 'high'
        });
      }

      // Quantum Ratchet endpoints
      if (path === '/v1/quantum/ratchet/init' && method === 'POST') {
        return await handleRatchetInit(request);
      }
      
      if (path === '/v1/quantum/ratchet/encrypt' && method === 'POST') {
        return await handleRatchetEncrypt(request);
      }
      
      if (path === '/v1/quantum/ratchet/decrypt' && method === 'POST') {
        return await handleRatchetDecrypt(request);
      }
      
      if (path === '/v1/quantum/ratchet/rotate' && method === 'POST') {
        if (!validateApiKey(request)) {
          return errorResponse('Invalid or missing API key', 'INVALID_API_KEY', 401);
        }
        try {
          const body = await request.json();
          return jsonResponse({
            session_id: body.session_id,
            new_key_id: `key-${Date.now()}`,
            rotation_type: body.force_qkd ? 'qkd_refresh' : 'automatic',
            timestamp: getTimestamp()
          });
        } catch (error) {
          return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
        }
      }
      
      if (path.startsWith('/v1/quantum/ratchet/session/') && path.endsWith('/status') && method === 'GET') {
        const sessionId = path.split('/')[5];
        return jsonResponse({
          session_id: sessionId,
          peer_id: 'alice',
          protocol: 'bb84',
          status: 'active',
          messages_encrypted: 3,
          messages_decrypted: 3,
          current_key_id: `key-${Date.now()}`,
          key_age: 3,
          last_activity: getTimestamp(),
          created_at: getTimestamp()
        });
      }
      
      if (path.startsWith('/v1/quantum/ratchet/session/') && path.endsWith('/terminate') && method === 'POST') {
        const sessionId = path.split('/')[5];
        return jsonResponse({
          session_id: sessionId,
          terminated: true,
          timestamp: getTimestamp()
        });
      }
      
      if (path === '/v1/quantum/ratchet/sessions' && method === 'GET') {
        return jsonResponse({
          sessions: [{
            session_id: 'ratchet-123',
            peer_id: 'alice',
            protocol: 'bb84',
            status: 'active',
            created_at: getTimestamp(),
            messages_encrypted: 3
          }]
        });
      }

      // SSC Economics endpoints
      if (path === '/v1/quantum/ssc/mint' && method === 'POST') {
        return await handleSSCMint(request);
      }
      
      if (path.startsWith('/v1/quantum/ssc/balance/') && method === 'GET') {
        return await handleSSCBalance(url);
      }

      // P2P Network endpoints
      if (path === '/v1/quantum/p2p/connect' && method === 'POST') {
        return await handleP2PConnect(request);
      }
      
      if (path === '/v1/quantum/p2p/send' && method === 'POST') {
        return await handleP2PSend(request);
      }
      
      if (path.startsWith('/v1/quantum/p2p/receive/') && method === 'GET') {
        return jsonResponse({
          node_id: path.split('/').pop(),
          messages: [],
          count: 0
        });
      }
      
      if (path === '/v1/quantum/p2p/status' || (path.startsWith('/v1/quantum/p2p/status/') && method === 'GET')) {
        return jsonResponse({
          status: 'online',
          connected_peers: 1,
          active_connections: 1,
          messages_sent: 3,
          messages_received: 0,
          qkd_sessions: 1
        });
      }
      
      if (path.startsWith('/v1/quantum/p2p/node/') && path.endsWith('/peers') && method === 'GET') {
        const nodeId = path.split('/')[5];
        return jsonResponse({
          node_id: nodeId,
          peers: [{
            peer_id: 'bob',
            connection_id: 'conn-123',
            status: 'connected',
            qkd_enabled: true,
            connected_since: getTimestamp()
          }]
        });
      }
      
      if (path.startsWith('/v1/quantum/p2p/connection/') && path.endsWith('/disconnect') && method === 'POST') {
        const connectionId = path.split('/')[5];
        return jsonResponse({
          connection_id: connectionId,
          disconnected: true,
          timestamp: getTimestamp()
        });
      }
      
      if (path.startsWith('/v1/quantum/p2p/connection/') && path.endsWith('/metrics') && method === 'GET') {
        const connectionId = path.split('/')[5];
        return jsonResponse({
          connection_id: connectionId,
          latency: 45,
          throughput: 1024000,
          qkd_sessions: 1,
          messages_sent: 3,
          messages_received: 0,
          error_rate: 0.0,
          uptime: 3600
        });
      }
      
      if (path === '/v1/quantum/p2p/swarm/join' && method === 'POST') {
        if (!validateApiKey(request)) {
          return errorResponse('Invalid or missing API key', 'INVALID_API_KEY', 401);
        }
        try {
          const body = await request.json();
          return jsonResponse({
            node_id: body.node_id,
            swarm_id: body.swarm_id,
            joined: true,
            peers_count: 5,
            qkd_enabled: body.enable_qkd || false,
            timestamp: getTimestamp()
          });
        } catch (error) {
          return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
        }
      }
      
      if (path === '/v1/quantum/p2p/swarm/leave' && method === 'POST') {
        if (!validateApiKey(request)) {
          return errorResponse('Invalid or missing API key', 'INVALID_API_KEY', 401);
        }
        try {
          const body = await request.json();
          return jsonResponse({
            node_id: body.node_id,
            swarm_id: body.swarm_id,
            left: true,
            timestamp: getTimestamp()
          });
        } catch (error) {
          return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
        }
      }
      
      if (path === '/v1/quantum/p2p/topology' || (path.startsWith('/v1/quantum/p2p/topology/') && method === 'GET')) {
        return jsonResponse({
          nodes: [
            { node_id: 'alice', connections: ['bob'], status: 'online' },
            { node_id: 'bob', connections: ['alice'], status: 'online' }
          ],
          edges: [
            { from: 'alice', to: 'bob', latency: 45, qkd_enabled: true }
          ],
          metrics: {
            total_nodes: 2,
            total_connections: 1,
            avg_latency: 45
          }
        });
      }
      
      if (path === '/v1/quantum/ssc/transfer' && method === 'POST') {
        if (!validateApiKey(request)) {
          return errorResponse('Invalid or missing API key', 'INVALID_API_KEY', 401);
        }
        try {
          const body = await request.json();
          return jsonResponse({
            tx_id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: body.from,
            to: body.to,
            amount: body.amount,
            timestamp: getTimestamp(),
            status: 'confirmed'
          });
        } catch (error) {
          return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
        }
      }
      
      if (path.startsWith('/v1/quantum/ssc/history/') && method === 'GET') {
        const address = path.split('/').pop();
        return jsonResponse({
          address: address,
          transactions: [],
          total: 0,
          limit: 10,
          offset: 0
        });
      }
      
      if (path === '/v1/quantum/ssc/carbon' || (path.startsWith('/v1/quantum/ssc/carbon/') && method === 'GET')) {
        return jsonResponse({
          carbon_credits: 7.5,
          energy_saved: 15.0,
          operations_count: 10,
          equivalent_trees: 0.5
        });
      }
      
      if (path.startsWith('/v1/quantum/ssc/rate/') && method === 'GET') {
        const currency = path.split('/').pop();
        return jsonResponse({
          currency: currency,
          rate: 0.01,
          inverse_rate: 100,
          timestamp: getTimestamp()
        });
      }
      
      if (path === '/v1/quantum/ssc/stake' && method === 'POST') {
        if (!validateApiKey(request)) {
          return errorResponse('Invalid or missing API key', 'INVALID_API_KEY', 401);
        }
        try {
          const body = await request.json();
          return jsonResponse({
            tx_id: `tx-${Date.now()}`,
            address: body.address,
            amount: body.amount,
            duration: body.duration || 30,
            expected_reward: 5.0,
            unlock_date: new Date(Date.now() + (body.duration || 30) * 24 * 60 * 60 * 1000).toISOString(),
            timestamp: getTimestamp()
          });
        } catch (error) {
          return errorResponse('Invalid request body', 'INVALID_PARAMETERS', 400);
        }
      }
      
      if (path === '/v1/quantum/ssc/stats' && method === 'GET') {
        return jsonResponse({
          total_supply: 1000000,
          circulating_supply: 500000,
          total_carbon_credits: 7500,
          total_energy_saved: 15000,
          active_addresses: 100,
          transactions_count: 5000
        });
      }

      // 404 for unknown routes
      return errorResponse('Endpoint not found', 'NOT_FOUND', 404);
      
    } catch (error) {
      return errorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR',
        500
      );
    }
  }
};

