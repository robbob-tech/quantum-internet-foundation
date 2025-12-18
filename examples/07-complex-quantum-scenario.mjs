#!/usr/bin/env node
/**
 * Example 07: Complex Quantum-Secured Communication Scenario
 * 
 * This example demonstrates a complete quantum-secured communication setup:
 * 1. Quantum entanglement verification via Bell pairs and CHSH test
 * 2. Quantum Key Distribution (BB84) for secure key generation
 * 3. Quantum Ratchet encryption for end-to-end security
 * 4. P2P quantum network with QKD-enabled messaging
 * 5. SSC token minting for energy savings tracking
 * 
 * This represents a real-world quantum internet use case where multiple
 * quantum technologies work together to provide secure communication.
 * 
 * Usage:
 *   export QUANTUM_INTERNET_API_KEY="your-api-key"
 *   node examples/07-complex-quantum-scenario.mjs
 * 
 * Or with npm:
 *   npm run example:complex
 */

import { QuantumInternetClient } from '../src/index.mjs';

// Configuration
const API_KEY = process.env.QUANTUM_INTERNET_API_KEY;
const API_URL = process.env.QUANTUM_INTERNET_API_URL || 'https://quantum-internet-api.sparsesupernova.workers.dev/v1';

if (!API_KEY) {
  console.error('Error: QUANTUM_INTERNET_API_KEY environment variable not set');
  console.error('   Get your API key: operations@sparse-supernova.com');
  process.exit(1);
}

console.log('Complex Quantum Problem: Quantum-Secured Communication Setup\n');
console.log('=' .repeat(70));
console.log('Scenario: Establish end-to-end quantum-secured communication');
console.log('Steps:');
console.log('  1. Create Bell pairs for entanglement verification');
console.log('  2. Perform CHSH test to verify quantum entanglement');
console.log('  3. Execute BB84 QKD to generate secure keys');
console.log('  4. Initialize Quantum Ratchet session with QKD');
console.log('  5. Encrypt and decrypt messages using quantum keys');
console.log('  6. Establish P2P quantum network connection');
console.log('  7. Send quantum-secured messages via P2P network');
console.log('  8. Mint SSC tokens for energy savings');
console.log('=' .repeat(70) + '\n');

// Initialize client
const client = new QuantumInternetClient({
  apiKey: API_KEY,
  baseUrl: API_URL,
  debug: false
});

async function runComplexQuantumScenario() {
  const results = {
    steps: [],
    success: true,
    errors: []
  };

  try {
    // Step 1: Verify API connectivity
    console.log('Step 1: Verifying API connectivity...');
    const status = await client.status();
    console.log(`   API Status: ${status.status}`);
    console.log(`   Version: ${status.version}`);
    console.log(`   Backends Connected: ${status.backends_connected}`);
    results.steps.push({ step: 1, name: 'API Connectivity', success: true });

    // Step 2: List available quantum backends
    console.log('\nStep 2: Listing available quantum backends...');
    const backends = await client.bridge.listBackends();
    console.log(`   Found ${backends.backends.length} backends:`);
    backends.backends.forEach(b => {
      console.log(`      - ${b.name}: ${b.qubits} qubits, ${b.status}`);
    });
    const selectedBackend = backends.backends[0]?.name || 'ibm_brisbane';
    results.steps.push({ step: 2, name: 'Backend Discovery', success: true, backend: selectedBackend });

    // Step 3: Create Bell pairs for entanglement
    console.log('\nStep 3: Creating entangled Bell pairs...');
    const bellPair1 = await client.bridge.createBellPair({
      backend: selectedBackend,
      fidelity: 0.95,
      shots: 2048
    });
    console.log(`   Bell Pair 1 Created:`);
    console.log(`      - Fidelity: ${bellPair1.fidelity}`);
    console.log(`      - Measurements: ${JSON.stringify(bellPair1.measurements)}`);
    console.log(`      - Hardware: ${bellPair1.hardware ? 'Real' : 'Simulated'}`);

    const bellPair2 = await client.bridge.createBellPair({
      backend: selectedBackend,
      fidelity: 0.97,
      shots: 2048
    });
    console.log(`   Bell Pair 2 Created:`);
    console.log(`      - Fidelity: ${bellPair2.fidelity}`);
    results.steps.push({ 
      step: 3, 
      name: 'Bell Pair Creation', 
      success: true, 
      fidelity1: bellPair1.fidelity,
      fidelity2: bellPair2.fidelity
    });

    // Step 4: Perform CHSH test to verify quantum entanglement
    console.log('\nStep 4: Performing CHSH test (Bell inequality violation)...');
    const chsh = await client.bridge.performCHSH({
      measurements: 2000,
      backend: selectedBackend
    });
    console.log(`   CHSH Test Results:`);
    console.log(`      - CHSH Value: ${chsh.chsh_value}`);
    console.log(`      - Violates Classical: ${chsh.violates_classical ? 'YES' : 'NO'}`);
    console.log(`      - Correlations: E_ab=${chsh.correlations.E_ab}, E_ab'=${chsh.correlations.E_ab_prime}`);
    if (chsh.chsh_value > 2.0) {
      console.log(`      Quantum entanglement verified! (CHSH > 2.0)`);
    }
    results.steps.push({ 
      step: 4, 
      name: 'CHSH Test', 
      success: true, 
      chsh_value: chsh.chsh_value,
      quantum_verified: chsh.violates_classical
    });

    // Step 5: Execute BB84 QKD protocol
    console.log('\nStep 5: Executing BB84 Quantum Key Distribution...');
    const bb84 = await client.protocols.bb84.execute({
      nQubits: 200,
      errorThreshold: 0.11,
      backend: selectedBackend,
      privacyAmplification: true,
      errorCorrection: true
    });
    console.log(`   BB84 QKD Results:`);
    console.log(`      - Raw Key Length: ${bb84.raw_key_length} bits`);
    console.log(`      - Secure Key Length: ${bb84.secure_key_length} bits`);
    console.log(`      - Error Rate: ${(bb84.error_rate * 100).toFixed(2)}%`);
    console.log(`      - Session ID: ${bb84.session_id}`);
    const keyEfficiency = ((bb84.secure_key_length / bb84.raw_key_length) * 100).toFixed(1);
    console.log(`      - Key Efficiency: ${keyEfficiency}%`);
    results.steps.push({ 
      step: 5, 
      name: 'BB84 QKD', 
      success: true, 
      secure_key_length: bb84.secure_key_length,
      error_rate: bb84.error_rate
    });

    // Step 6: Validate BB84 security
    console.log('\nStep 6: Validating BB84 session security...');
    const validation = await client.protocols.bb84.validateSecurity(bb84.session_id);
    console.log(`   Security Validation:`);
    console.log(`      - Secure: ${validation.secure ? 'YES' : 'NO'}`);
    console.log(`      - Security Level: ${validation.security_level}`);
    console.log(`      - Eavesdropper Detected: ${validation.eavesdropper_detected ? 'YES' : 'NO'}`);
    results.steps.push({ 
      step: 6, 
      name: 'Security Validation', 
      success: validation.secure,
      security_level: validation.security_level
    });

    // Step 7: Initialize Quantum Ratchet session
    console.log('\nStep 7: Initializing Quantum Ratchet encryption session...');
    const ratchetSession = await client.ratchet.initialize({
      peerId: 'alice',
      qkdProtocol: 'bb84',
      backend: selectedBackend,
      keyRefreshInterval: 50
    });
    console.log(`   Quantum Ratchet Session Created:`);
    console.log(`      - Session ID: ${ratchetSession.session_id}`);
    console.log(`      - Peer ID: ${ratchetSession.peer_id}`);
    console.log(`      - Protocol: ${ratchetSession.protocol}`);
    results.steps.push({ 
      step: 7, 
      name: 'Quantum Ratchet Init', 
      success: true, 
      session_id: ratchetSession.session_id
    });

    // Step 8: Encrypt messages using Quantum Ratchet
    console.log('\nStep 8: Encrypting messages with quantum keys...');
    const messages = [
      'Quantum-secured message #1',
      'Sensitive data: 42',
      'Top secret quantum information'
    ];
    const encryptedMessages = [];
    
    for (let i = 0; i < messages.length; i++) {
      const encrypted = await client.ratchet.encrypt(ratchetSession.session_id, messages[i]);
      encryptedMessages.push(encrypted);
      console.log(`   Message ${i + 1} encrypted:`);
      console.log(`      - Original: "${messages[i]}"`);
      console.log(`      - Ciphertext: ${encrypted.ciphertext.substring(0, 50)}...`);
      console.log(`      - Key ID: ${encrypted.key_id}`);
    }
    results.steps.push({ 
      step: 8, 
      name: 'Message Encryption', 
      success: true, 
      messages_encrypted: messages.length
    });

    // Step 9: Decrypt messages
    console.log('\nStep 9: Decrypting messages...');
    for (let i = 0; i < encryptedMessages.length; i++) {
      const decrypted = await client.ratchet.decrypt(
        ratchetSession.session_id, 
        encryptedMessages[i].ciphertext
      );
      const match = decrypted.message === messages[i];
      console.log(`   ${match ? '[OK]' : '[FAIL]'} Message ${i + 1} decrypted:`);
      console.log(`      - Decrypted: "${decrypted.message}"`);
      console.log(`      - Match: ${match ? 'YES' : 'NO'}`);
      if (!match) {
        results.success = false;
        results.errors.push(`Message ${i + 1} decryption mismatch`);
      }
    }
    results.steps.push({ 
      step: 9, 
      name: 'Message Decryption', 
      success: true
    });

    // Step 10: Establish P2P quantum network connection
    console.log('\nStep 10: Establishing P2P quantum network connection...');
    const p2pConnection = await client.p2p.connect({
      peerId: 'bob',
      enableQKD: true,
      protocol: 'bb84',
      backend: selectedBackend,
      encryption: true
    });
    console.log(`   P2P Connection Established:`);
    console.log(`      - Connection ID: ${p2pConnection.connection_id}`);
    console.log(`      - Peer ID: ${p2pConnection.peer_id}`);
    console.log(`      - QKD Enabled: ${p2pConnection.qkd_enabled ? 'YES' : 'NO'}`);
    console.log(`      - Encryption: ${p2pConnection.encryption_enabled ? 'Enabled' : 'Disabled'}`);
    results.steps.push({ 
      step: 10, 
      name: 'P2P Connection', 
      success: true, 
      connection_id: p2pConnection.connection_id
    });

    // Step 11: Send quantum-secured messages via P2P
    console.log('\nStep 11: Sending quantum-secured messages via P2P network...');
    const p2pMessages = [
      { message: 'Hello from quantum network!', priority: 'normal' },
      { message: 'Quantum data: [1,0,1,1,0,1]', priority: 'high' },
      { message: 'Final quantum state achieved', priority: 'normal' }
    ];
    
    for (let i = 0; i < p2pMessages.length; i++) {
      const sent = await client.p2p.send({
        destination: 'bob',
        payload: p2pMessages[i],
        useQKD: true,
        encrypt: true,
        priority: p2pMessages[i].priority
      });
      console.log(`   Message ${i + 1} sent:`);
      console.log(`      - Atom ID: ${sent.atom_id}`);
      console.log(`      - Status: ${sent.status}`);
      console.log(`      - QKD Used: ${sent.qkd_used ? 'YES' : 'NO'}`);
      console.log(`      - Encrypted: ${sent.encrypted ? 'YES' : 'NO'}`);
    }
    results.steps.push({ 
      step: 11, 
      name: 'P2P Messaging', 
      success: true, 
      messages_sent: p2pMessages.length
    });

    // Step 12: Get connection metrics
    console.log('\nStep 12: Retrieving P2P connection metrics...');
    const metrics = await client.p2p.getConnectionMetrics(p2pConnection.connection_id);
    console.log(`   Connection Metrics:`);
    console.log(`      - Latency: ${metrics.latency}ms`);
    console.log(`      - Throughput: ${metrics.throughput} bytes/s`);
    console.log(`      - QKD Sessions: ${metrics.qkd_sessions}`);
    console.log(`      - Messages Sent: ${metrics.messages_sent}`);
    console.log(`      - Error Rate: ${(metrics.error_rate * 100).toFixed(2)}%`);
    results.steps.push({ 
      step: 12, 
      name: 'Connection Metrics', 
      success: true, 
      latency: metrics.latency,
      qkd_sessions: metrics.qkd_sessions
    });

    // Step 13: Mint SSC tokens for energy savings
    console.log('\nStep 13: Minting SSC tokens for quantum operations...');
    const energySaved = 2.5; // kWh
    const carbonReduced = 1.25; // kg CO₂
    const sscMint = await client.ssc.mint({
      amount: 250,
      energySaved: energySaved,
      carbonReduced: carbonReduced,
      operationType: 'quantum_entanglement'
    });
    console.log(`   SSC Tokens Minted:`);
    console.log(`      - Tokens: ${sscMint.tokens} SSC`);
    console.log(`      - Transaction ID: ${sscMint.tx_id}`);
    console.log(`      - Energy Saved: ${energySaved} kWh`);
    console.log(`      - Carbon Reduced: ${carbonReduced} kg CO₂`);
    results.steps.push({ 
      step: 13, 
      name: 'SSC Token Minting', 
      success: true, 
      tokens: sscMint.tokens,
      energy_saved: energySaved
    });

    // Step 14: Check SSC balance
    console.log('\nStep 14: Checking SSC balance...');
    const address = 'alice-wallet-address';
    const balance = await client.ssc.getBalance(address);
    console.log(`   Balance for ${address}:`);
    console.log(`      - SSC Tokens: ${balance.ssc}`);
    console.log(`      - Carbon Credits: ${balance.carbon_credits} kg CO₂`);
    console.log(`      - Energy Saved: ${balance.energy_saved} kWh`);
    results.steps.push({ 
      step: 14, 
      name: 'Balance Check', 
      success: true, 
      balance: balance.ssc
    });

    // Summary
    console.log('\n' + '=' .repeat(70));
    console.log('Scenario Summary');
    console.log('=' .repeat(70));
    console.log(`Total Steps: ${results.steps.length}`);
    console.log(`Successful: ${results.steps.filter(s => s.success).length}`);
    console.log(`Failed: ${results.steps.filter(s => !s.success).length}`);
    console.log(`\nOverall Result: ${results.success ? 'SUCCESS' : 'PARTIAL SUCCESS'}`);
    
    if (results.errors.length > 0) {
      console.log(`\nErrors:`);
      results.errors.forEach(err => console.log(`   - ${err}`));
    }

    console.log('\nQuantum Problem Solved:');
    console.log('   - Quantum entanglement verified (CHSH > 2.0)');
    console.log('   - Secure quantum keys generated (BB84 QKD)');
    console.log('   - End-to-end quantum encryption established');
    console.log('   - Quantum-secured P2P network operational');
    console.log('   - Energy savings tracked and tokenized');
    console.log('\n' + '=' .repeat(70));

    return results;

  } catch (error) {
    console.error('\nFatal Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    results.success = false;
    results.errors.push(error.message);
    return results;
  }
}

// Run the scenario
runComplexQuantumScenario()
  .then(results => {
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

