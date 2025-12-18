// tests/test-basic.mjs
// Basic tests for Quantum Internet Foundation client

import { QuantumInternetClient } from '../src/index.mjs';

console.log(' Running Basic Tests\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(` ${name}`);
    passed++;
  } catch (error) {
    console.log(` ${name}: ${error.message}`);
    failed++;
  }
}

// Test 1: Client initialization
test('Client can be initialized without API key', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (!client) throw new Error('Client not created');
  if (!client.bridge) throw new Error('Bridge client not initialized');
  if (!client.qhal) throw new Error('Q-HAL client not initialized');
  if (!client.protocols) throw new Error('Protocols not initialized');
  if (!client.ratchet) throw new Error('Ratchet client not initialized');
  if (!client.ssc) throw new Error('SSC client not initialized');
  if (!client.p2p) throw new Error('P2P client not initialized');
});

// Test 2: Client initialization with config
test('Client can be initialized with custom config', () => {
  const client = new QuantumInternetClient({
    apiKey: 'test-key',
    baseUrl: 'https://test.example.com',
    timeout: 60000,
    debug: true
  });
  if (client.apiKey !== 'test-key') throw new Error('API key not set');
  if (client.baseUrl !== 'https://test.example.com') throw new Error('Base URL not set');
  if (client.timeout !== 60000) throw new Error('Timeout not set');
  if (!client.debug) throw new Error('Debug not enabled');
});

// Test 3: Protocol clients exist
test('All protocol clients are initialized', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (!client.protocols.bb84) throw new Error('BB84 client missing');
  if (!client.protocols.e91) throw new Error('E91 client missing');
  if (!client.protocols.sarg04) throw new Error('SARG04 client missing');
  if (!client.protocols.bbm92) throw new Error('BBM92 client missing');
});

// Test 4: Client methods exist
test('Client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.request !== 'function') throw new Error('request method missing');
  if (typeof client.ping !== 'function') throw new Error('ping method missing');
  if (typeof client.status !== 'function') throw new Error('status method missing');
});

// Test 5: Bridge client methods
test('Bridge client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.bridge.createBellPair !== 'function') 
    throw new Error('createBellPair missing');
  if (typeof client.bridge.performCHSH !== 'function') 
    throw new Error('performCHSH missing');
  if (typeof client.bridge.listBackends !== 'function') 
    throw new Error('listBackends missing');
  if (typeof client.bridge.status !== 'function') 
    throw new Error('status missing');
});

// Test 6: Q-HAL client methods
test('Q-HAL client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.qhal.registerDevice !== 'function') 
    throw new Error('registerDevice missing');
  if (typeof client.qhal.listDevices !== 'function') 
    throw new Error('listDevices missing');
  if (typeof client.qhal.executeOperation !== 'function') 
    throw new Error('executeOperation missing');
});

// Test 7: Protocol client methods
test('BB84 client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.protocols.bb84.execute !== 'function') 
    throw new Error('execute missing');
  if (typeof client.protocols.bb84.getKeyStatistics !== 'function') 
    throw new Error('getKeyStatistics missing');
});

// Test 8: Ratchet client methods
test('Ratchet client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.ratchet.initialize !== 'function') 
    throw new Error('initialize missing');
  if (typeof client.ratchet.encrypt !== 'function') 
    throw new Error('encrypt missing');
  if (typeof client.ratchet.decrypt !== 'function') 
    throw new Error('decrypt missing');
  if (typeof client.ratchet.rotateKeys !== 'function') 
    throw new Error('rotateKeys missing');
});

// Test 9: SSC client methods
test('SSC client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.ssc.mint !== 'function') 
    throw new Error('mint missing');
  if (typeof client.ssc.getBalance !== 'function') 
    throw new Error('getBalance missing');
  if (typeof client.ssc.transfer !== 'function') 
    throw new Error('transfer missing');
});

// Test 10: P2P client methods
test('P2P client has required methods', () => {
  const client = new QuantumInternetClient({ skipAuth: true });
  if (typeof client.p2p.connect !== 'function') 
    throw new Error('connect missing');
  if (typeof client.p2p.send !== 'function') 
    throw new Error('send missing');
  if (typeof client.p2p.getStatus !== 'function') 
    throw new Error('getStatus missing');
});

// Test 11: createClient helper
test('createClient helper works', () => {
  const { createClient } = await import('../src/index.mjs');
  const client = createClient({ skipAuth: true });
  if (!client) throw new Error('Client not created');
  if (!(client instanceof QuantumInternetClient)) 
    throw new Error('Not a QuantumInternetClient instance');
});

// Test 12: All exports available
test('All exports are available', async () => {
  const exports = await import('../src/index.mjs');
  if (!exports.QuantumInternetClient) throw new Error('QuantumInternetClient missing');
  if (!exports.QuantumBridgeClient) throw new Error('QuantumBridgeClient missing');
  if (!exports.QHALClient) throw new Error('QHALClient missing');
  if (!exports.BB84Client) throw new Error('BB84Client missing');
  if (!exports.E91Client) throw new Error('E91Client missing');
  if (!exports.SARG04Client) throw new Error('SARG04Client missing');
  if (!exports.BBM92Client) throw new Error('BBM92Client missing');
  if (!exports.QuantumRatchetClient) throw new Error('QuantumRatchetClient missing');
  if (!exports.SSCClient) throw new Error('SSCClient missing');
  if (!exports.P2PClient) throw new Error('P2PClient missing');
  if (!exports.createClient) throw new Error('createClient missing');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n All tests passed!\n');
}
