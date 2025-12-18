#!/usr/bin/env node
/**
 * Free Tier Demo
 * 
 * Demonstrates how the Free Tier works:
 * - 100 requests/day limit
 * - Simulation mode only (no real hardware)
 * - All protocols available
 * - Rate limit headers in responses
 * 
 * Usage:
 *   node examples/08-free-tier-demo.mjs
 * 
 * Get your Free Tier API key: operations@sparse-supernova.com
 */

import { QuantumInternetClient } from '../src/index.mjs';

const API_KEY = process.env.QUANTUM_INTERNET_API_KEY || 'free_demo_key_12345';

console.log('🔬 Quantum Internet Foundation - Free Tier Demo\n');
console.log('This demo shows how the Free Tier works:');
console.log('  • 100 requests/day limit');
console.log('  • Simulation mode only');
console.log('  • All protocols available');
console.log('  • Rate limit tracking\n');

const client = new QuantumInternetClient({
  apiKey: API_KEY,
  baseUrl: 'https://quantum-internet-api.sparsesupernova.workers.dev/v1'
});

async function demonstrateFreeTier() {
  try {
    console.log('📊 Step 1: Check API Status');
    const status = await client.status();
    console.log('   Status:', status.status);
    console.log('   Version:', status.version);
    console.log('   Real hardware available:', status.real_hardware_available);
    console.log('');

    console.log('🔗 Step 2: Create Bell Pair (Simulation Mode)');
    console.log('   Note: Free tier automatically uses simulation mode');
    const bellPair = await client.bridge.createBellPair({
      backend: 'ibm_brisbane',
      useRealHardware: false  // Free tier requires false
    });
    console.log('   ✅ Bell pair created');
    console.log('   Fidelity:', bellPair.fidelity);
    console.log('   Hardware mode:', bellPair.hardware ? 'Real' : 'Simulation');
    console.log('');

    console.log('🔐 Step 3: Run BB84 QKD Protocol');
    const qkd = await client.protocols.bb84({
      nQubits: 100,
      errorRateThreshold: 0.11
    });
    console.log('   ✅ QKD session created');
    console.log('   Secure key length:', qkd.secure_key_length);
    console.log('   Error rate:', qkd.error_rate);
    console.log('   Session ID:', qkd.session_id);
    console.log('');

    console.log('🔒 Step 4: Initialize Quantum Ratchet');
    const ratchet = await client.ratchet.init({
      peerId: 'peer_demo_001',
      qkdProtocol: 'bb84'
    });
    console.log('   ✅ Ratchet session initialized');
    console.log('   Session ID:', ratchet.session_id);
    console.log('   Protocol:', ratchet.protocol);
    console.log('');

    console.log('💎 Step 5: Mint SSC Tokens');
    const mint = await client.ssc.mint({
      amount: 100,
      carbonReduced: 0.5,
      energySaved: 1.0
    });
    console.log('   ✅ Tokens minted');
    console.log('   Tokens:', mint.tokens);
    console.log('   Transaction ID:', mint.tx_id);
    console.log('   Carbon credits:', mint.carbon_credits);
    console.log('');

    console.log('🌐 Step 6: Connect to P2P Network');
    const connection = await client.p2p.connect({
      peerId: 'peer_demo_002',
      enableQkd: true,
      protocol: 'bb84'
    });
    console.log('   ✅ P2P connection established');
    console.log('   Connection ID:', connection.connection_id);
    console.log('   QKD enabled:', connection.qkd_enabled);
    console.log('');

    console.log('❌ Step 7: Attempt Real Hardware (Will Fail on Free Tier)');
    try {
      const realBellPair = await client.bridge.createBellPair({
        backend: 'ibm_brisbane',
        useRealHardware: true  // This will be rejected for Free tier
      });
      console.log('   ⚠️  Unexpected: Real hardware request succeeded');
    } catch (error) {
      console.log('   ✅ Expected error for Free tier:');
      console.log('   Error:', error.message);
      if (error.message.includes('HARDWARE_ACCESS_DENIED')) {
        console.log('   This is correct - Free tier cannot use real hardware');
      }
    }
    console.log('');

    console.log('📈 Step 8: Check Rate Limits');
    console.log('   Rate limit information is included in response headers');
    console.log('   Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-API-Tier');
    console.log('   Free tier limit: 100 requests/day');
    console.log('');

    console.log('✅ Free Tier Demo Complete!');
    console.log('');
    console.log('Summary:');
    console.log('  • Free tier works perfectly for simulation-based operations');
    console.log('  • All QKD protocols are available');
    console.log('  • Real hardware access requires Pro or Enterprise tier');
    console.log('  • Rate limits are enforced and tracked');
    console.log('');
    console.log('To upgrade to Pro tier: operations@sparse-supernova.com');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
      console.error('   Rate limit exceeded. Please wait or upgrade your tier.');
    } else if (error.message.includes('INVALID_API_KEY')) {
      console.error('   Invalid API key. Get your Free tier key at: operations@sparse-supernova.com');
    }
    process.exit(1);
  }
}

// Run the demo
demonstrateFreeTier();

