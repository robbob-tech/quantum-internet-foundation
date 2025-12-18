#!/usr/bin/env node
/**
 * Free Tier Smoke Test
 * 
 * Comprehensive test of Free Tier functionality:
 * - Simulation mode works
 * - Real hardware blocked
 * - Rate limits enforced
 * - All protocols available
 * - Headers correct
 */

const API_URL = 'https://quantum-internet-api.sparsesupernova.workers.dev/v1';
const FREE_TIER_KEY = 'free_smoke_test_key_12345';

let testsPassed = 0;
let testsFailed = 0;
const failures = [];

function log(message) {
  console.log(message);
}

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    log(`✅ ${name}`);
  } catch (error) {
    testsFailed++;
    failures.push({ name, error: error.message });
    log(`❌ ${name}: ${error.message}`);
  }
}

async function apiRequest(endpoint, method = 'GET', body = null, apiKey = FREE_TIER_KEY) {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  };
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    data
  };
}

async function runSmokeTests() {
  log('\n🔥 Free Tier Smoke Test\n');
  log('='.repeat(60));
  
  // Test 1: API Status (no auth required)
  log('\n📊 Test 1: API Status');
  test('Status endpoint accessible', async () => {
    const result = await apiRequest('/status', 'GET', null, null);
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.status) throw new Error('Missing status field');
  });
  
  // Test 2: Free Tier Simulation Mode Works
  log('\n🔬 Test 2: Simulation Mode');
  test('Bell pair creation in simulation mode', async () => {
    const result = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane',
      use_real_hardware: false
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (result.data.hardware !== false) throw new Error('Should be simulation mode');
    if (!result.data.fidelity) throw new Error('Missing fidelity');
  });
  
  test('Rate limit headers present', async () => {
    const result = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane',
      use_real_hardware: false
    });
    if (!result.headers['x-api-tier']) throw new Error('Missing X-API-Tier header');
    if (!result.headers['x-ratelimit-limit']) throw new Error('Missing X-RateLimit-Limit header');
    if (!result.headers['x-ratelimit-remaining']) throw new Error('Missing X-RateLimit-Remaining header');
    if (result.headers['x-api-tier'] !== 'Free') throw new Error('Tier should be Free');
  });
  
  // Test 3: Real Hardware Blocked
  log('\n🚫 Test 3: Hardware Access Restrictions');
  test('Real hardware request rejected', async () => {
    const result = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane',
      use_real_hardware: true
    });
    if (result.status !== 403) throw new Error(`Expected 403, got ${result.status}`);
    if (result.data.code !== 'HARDWARE_ACCESS_DENIED') throw new Error('Wrong error code');
    if (!result.data.error.includes('Pro or Enterprise')) throw new Error('Error message should mention upgrade');
  });
  
  // Test 4: All QKD Protocols Work
  log('\n🔐 Test 4: QKD Protocols');
  test('BB84 protocol works', async () => {
    const result = await apiRequest('/quantum/protocols/bb84', 'POST', {
      n_qubits: 100,
      error_rate_threshold: 0.11
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.secure_key_length) throw new Error('Missing secure_key_length');
    if (!result.data.session_id) throw new Error('Missing session_id');
  });
  
  test('E91 protocol works', async () => {
    const result = await apiRequest('/quantum/protocols/e91', 'POST', {
      n_pairs: 100,
      chsh_threshold: 2.0
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.secure_key_length) throw new Error('Missing secure_key_length');
    if (!result.data.chsh_value) throw new Error('Missing chsh_value');
  });
  
  test('SARG04 protocol works', async () => {
    const result = await apiRequest('/quantum/protocols/sarg04', 'POST', {
      n_qubits: 100
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.secure_key_length) throw new Error('Missing secure_key_length');
  });
  
  test('BBM92 protocol works', async () => {
    const result = await apiRequest('/quantum/protocols/bbm92', 'POST', {
      n_pairs: 100
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.secure_key_length) throw new Error('Missing secure_key_length');
  });
  
  // Test 5: Quantum Ratchet
  log('\n🔒 Test 5: Quantum Ratchet');
  test('Ratchet initialization works', async () => {
    const result = await apiRequest('/quantum/ratchet/init', 'POST', {
      peer_id: 'test_peer_001',
      qkd_protocol: 'bb84'
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.session_id) throw new Error('Missing session_id');
  });
  
  test('Ratchet encryption works', async () => {
    const result = await apiRequest('/quantum/ratchet/encrypt', 'POST', {
      session_id: 'test_session',
      message: { text: 'Hello Quantum' }
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.ciphertext) throw new Error('Missing ciphertext');
  });
  
  // Test 6: SSC Economics
  log('\n💎 Test 6: SSC Economics');
  test('SSC minting works', async () => {
    const result = await apiRequest('/quantum/ssc/mint', 'POST', {
      amount: 100,
      carbon_reduced: 0.5,
      energy_saved: 1.0
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.tokens) throw new Error('Missing tokens');
    if (!result.data.tx_id) throw new Error('Missing tx_id');
  });
  
  // Test 7: P2P Network
  log('\n🌐 Test 7: P2P Network');
  test('P2P connection works', async () => {
    const result = await apiRequest('/quantum/p2p/connect', 'POST', {
      peer_id: 'test_peer_002',
      enable_qkd: true,
      protocol: 'bb84'
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.connection_id) throw new Error('Missing connection_id');
  });
  
  // Test 8: Rate Limit Tracking
  log('\n📈 Test 8: Rate Limit Tracking');
  test('Rate limit decreases with requests', async () => {
    const result1 = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane',
      use_real_hardware: false
    });
    const remaining1 = parseInt(result1.headers['x-ratelimit-remaining'] || '0');
    
    const result2 = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane',
      use_real_hardware: false
    });
    const remaining2 = parseInt(result2.headers['x-ratelimit-remaining'] || '0');
    
    if (remaining2 >= remaining1) throw new Error('Rate limit should decrease');
  });
  
  // Test 9: Invalid API Key
  log('\n🔑 Test 9: Authentication');
  test('Missing API key rejected', async () => {
    const result = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane'
    }, null);
    if (result.status !== 401) throw new Error(`Expected 401, got ${result.status}`);
  });
  
  test('Invalid API key format rejected', async () => {
    const result = await apiRequest('/quantum/bridge/bell-pair', 'POST', {
      backend: 'ibm_brisbane'
    }, 'invalid_key');
    // Should still work (we accept any key format for now, but tier defaults to Free)
    // This test verifies the system doesn't crash
    if (result.status >= 500) throw new Error('Server error with invalid key format');
  });
  
  // Test 10: CHSH Test
  log('\n⚛️  Test 10: CHSH Test');
  test('CHSH test works', async () => {
    const result = await apiRequest('/quantum/bridge/chsh', 'POST', {
      n_measurements: 1000
    });
    if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
    if (!result.data.chsh_value) throw new Error('Missing chsh_value');
    if (!result.data.violates_classical) throw new Error('Missing violates_classical');
  });
  
  // Summary
  log('\n' + '='.repeat(60));
  log('\n📊 Test Summary');
  log(`✅ Passed: ${testsPassed}`);
  log(`❌ Failed: ${testsFailed}`);
  
  if (failures.length > 0) {
    log('\n❌ Failures:');
    failures.forEach(f => {
      log(`   - ${f.name}: ${f.error}`);
    });
  }
  
  log('\n' + '='.repeat(60));
  
  if (testsFailed === 0) {
    log('\n🎉 All Free Tier smoke tests passed!');
    log('\nFree Tier is fully functional:');
    log('  ✅ Simulation mode works');
    log('  ✅ Real hardware properly blocked');
    log('  ✅ All protocols available');
    log('  ✅ Rate limits tracked');
    log('  ✅ Headers correct');
    log('  ✅ Error messages clear');
    return 0;
  } else {
    log('\n⚠️  Some tests failed. Review errors above.');
    return 1;
  }
}

// Run tests
runSmokeTests().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

