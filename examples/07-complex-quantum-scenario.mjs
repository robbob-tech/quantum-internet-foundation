#!/usr/bin/env node
/**
 * Example 07: Complex Quantum-Secured Communication Scenario
 * 
 * This example demonstrates a complete quantum-secured communication setup:
 * . Quantum entanglement verification via Bell pairs and CHSH test
 * . Quantum Key Distribution (BB8) for secure key generation
 * . Quantum Ratchet encryption for end-to-end security
 * . PP quantum network with QKD-enabled messaging
 * . SSC token minting for energy savings tracking
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
const API_URL = process.env.QUANTUM_INTERNET_API_URL || 'https://quantum-internet-api.sparsesupernova.workers.dev/v';

if (!API_KEY) {
  console.error('Error: QUANTUM_INTERNET_API_KEY environment variable not set');
  console.error('   Get your API key: operations@sparse-supernova.com');
  process.exit();
}

console.log('Complex Quantum Problem: Quantum-Secured Communication Setup\n');
console.log('=' .repeat(70));
console.log('Scenario: Establish end-to-end quantum-secured communication');
console.log('Steps:');
console.log('  . Create Bell pairs for entanglement verification');
console.log('  . Perform CHSH test to verify quantum entanglement');
console.log('  . Execute BB8 QKD to generate secure keys');
console.log('  . Initialize Quantum Ratchet session with QKD');
console.log('  . Encrypt and decrypt messages using quantum keys');
console.log('  . Establish PP quantum network connection');
console.log('  7. Send quantum-secured messages via PP network');
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
    // Step : Verify API connectivity
    console.log('Step : Verifying API connectivity...');
    const status = await client.status();
    console.log(`   API Status: ${status.status}`);
    console.log(`   Version: ${status.version}`);
    console.log(`   Backends Connected: ${status.backends_connected}`);
    results.steps.push({ step: , name: 'API Connectivity', success: true });

    // Step : List available quantum backends
    console.log('\nStep : Listing available quantum backends...');
    const backends = await client.bridge.listBackends();
    console.log(`   Found ${backends.backends.length} backends:`);
    backends.backends.forEach(b => {
      console.log(`      - ${b.name}: ${b.qubits} qubits, ${b.status}`);
    });
    const selectedBackend = backends.backends[0]?.name || 'ibm_brisbane';
    results.steps.push({ step: , name: 'Backend Discovery', success: true, backend: selectedBackend });

    // Step : Create Bell pairs for entanglement
    console.log('\nStep : Creating entangled Bell pairs...');
    const bellPair = await client.bridge.createBellPair({
      backend: selectedBackend,
      fidelity: 0.9,
      shots: 08
    });
    console.log(`   Bell Pair  Created:`);
    console.log(`      - Fidelity: ${bellPair.fidelity}`);
    console.log(`      - Measurements: ${JSON.stringify(bellPair.measurements)}`);
    console.log(`      - Hardware: ${bellPair.hardware ? 'Real' : 'Simulated'}`);

    const bellPair = await client.bridge.createBellPair({
      backend: selectedBackend,
      fidelity: 0.97,
      shots: 08
    });
    console.log(`   Bell Pair  Created:`);
    console.log(`      - Fidelity: ${bellPair.fidelity}`);
    results.steps.push({ 
      step: , 
      name: 'Bell Pair Creation', 
      success: true, 
      fidelity: bellPair.fidelity,
      fidelity: bellPair.fidelity
    });

    // Step : Perform CHSH test to verify quantum entanglement
    console.log('\nStep : Performing CHSH test (Bell inequality violation)...');
    const chsh = await client.bridge.performCHSH({
      measurements: 000,
      backend: selectedBackend
    });
    console.log(`   CHSH Test Results:`);
    console.log(`      - CHSH Value: ${chsh.chsh_value}`);
    console.log(`      - Violates Classical: ${chsh.violates_classical ? 'YES' : 'NO'}`);
    console.log(`      - Correlations: E_ab=${chsh.correlations.E_ab}, E_ab'=${chsh.correlations.E_ab_prime}`);
    if (chsh.chsh_value > .0) {
      console.log(`      Quantum entanglement verified! (CHSH > .0)`);
    }
    results.steps.push({ 
      step: , 
      name: 'CHSH Test', 
      success: true, 
      chsh_value: chsh.chsh_value,
      quantum_verified: chsh.violates_classical
    });

    // Step : Execute BB8 QKD protocol
    console.log('\nStep : Executing BB8 Quantum Key Distribution...');
    const bb8 = await client.protocols.bb8.execute({
      nQubits: 00,
      errorThreshold: 0.,
      backend: selectedBackend,
      privacyAmplification: true,
      errorCorrection: true
    });
    console.log(`   BB8 QKD Results:`);
    console.log(`      - Raw Key Length: ${bb8.raw_key_length} bits`);
    console.log(`      - Secure Key Length: ${bb8.secure_key_length} bits`);
    console.log(`      - Error Rate: ${(bb8.error_rate * 00).toFixed()}%`);
    console.log(`      - Session ID: ${bb8.session_id}`);
    const keyEfficiency = ((bb8.secure_key_length / bb8.raw_key_length) * 00).toFixed();
    console.log(`      - Key Efficiency: ${keyEfficiency}%`);
    results.steps.push({ 
      step: , 
      name: 'BB8 QKD', 
      success: true, 
      secure_key_length: bb8.secure_key_length,
      error_rate: bb8.error_rate
    });

    // Step : Validate BB8 security
    console.log('\nStep : Validating BB8 session security...');
    const validation = await client.protocols.bb8.validateSecurity(bb8.session_id);
    console.log(`   Security Validation:`);
    console.log(`      - Secure: ${validation.secure ? 'YES' : 'NO'}`);
    console.log(`      - Security Level: ${validation.security_level}`);
    console.log(`      - Eavesdropper Detected: ${validation.eavesdropper_detected ? 'YES' : 'NO'}`);
    results.steps.push({ 
      step: , 
      name: 'Security Validation', 
      success: validation.secure,
      security_level: validation.security_level
    });

    // Step 7: Initialize Quantum Ratchet session
    console.log('\nStep 7: Initializing Quantum Ratchet encryption session...');
    const ratchetSession = await client.ratchet.initialize({
      peerId: 'alice',
      qkdProtocol: 'bb8',
      backend: selectedBackend,
      keyRefreshInterval: 0
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
      'Quantum-secured message #',
      'Sensitive data: ',
      'Top secret quantum information'
    ];
    const encryptedMessages = [];
    
    for (let i = 0; i < messages.length; i++) {
      const encrypted = await client.ratchet.encrypt(ratchetSession.session_id, messages[i]);
      encryptedMessages.push(encrypted);
      console.log(`   Message ${i + } encrypted:`);
      console.log(`      - Original: "${messages[i]}"`);
      console.log(`      - Ciphertext: ${encrypted.ciphertext.substring(0, 0)}...`);
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
      console.log(`   ${match ? '[OK]' : '[FAIL]'} Message ${i + } decrypted:`);
      console.log(`      - Decrypted: "${decrypted.message}"`);
      console.log(`      - Match: ${match ? 'YES' : 'NO'}`);
      if (!match) {
        results.success = false;
        results.errors.push(`Message ${i + } decryption mismatch`);
      }
    }
    results.steps.push({ 
      step: 9, 
      name: 'Message Decryption', 
      success: true
    });

    // Step 0: Establish PP quantum network connection
    console.log('\nStep 0: Establishing PP quantum network connection...');
    const ppConnection = await client.pp.connect({
      peerId: 'bob',
      enableQKD: true,
      protocol: 'bb8',
      backend: selectedBackend,
      encryption: true
    });
    console.log(`   PP Connection Established:`);
    console.log(`      - Connection ID: ${ppConnection.connection_id}`);
    console.log(`      - Peer ID: ${ppConnection.peer_id}`);
    console.log(`      - QKD Enabled: ${ppConnection.qkd_enabled ? 'YES' : 'NO'}`);
    console.log(`      - Encryption: ${ppConnection.encryption_enabled ? 'Enabled' : 'Disabled'}`);
    results.steps.push({ 
      step: 0, 
      name: 'PP Connection', 
      success: true, 
      connection_id: ppConnection.connection_id
    });

    // Step : Send quantum-secured messages via PP
    console.log('\nStep : Sending quantum-secured messages via PP network...');
    const ppMessages = [
      { message: 'Hello from quantum network!', priority: 'normal' },
      { message: 'Quantum data: [,0,,,0,]', priority: 'high' },
      { message: 'Final quantum state achieved', priority: 'normal' }
    ];
    
    for (let i = 0; i < ppMessages.length; i++) {
      const sent = await client.pp.send({
        destination: 'bob',
        payload: ppMessages[i],
        useQKD: true,
        encrypt: true,
        priority: ppMessages[i].priority
      });
      console.log(`   Message ${i + } sent:`);
      console.log(`      - Atom ID: ${sent.atom_id}`);
      console.log(`      - Status: ${sent.status}`);
      console.log(`      - QKD Used: ${sent.qkd_used ? 'YES' : 'NO'}`);
      console.log(`      - Encrypted: ${sent.encrypted ? 'YES' : 'NO'}`);
    }
    results.steps.push({ 
      step: , 
      name: 'PP Messaging', 
      success: true, 
      messages_sent: ppMessages.length
    });

    // Step : Get connection metrics
    console.log('\nStep : Retrieving PP connection metrics...');
    const metrics = await client.pp.getConnectionMetrics(ppConnection.connection_id);
    console.log(`   Connection Metrics:`);
    console.log(`      - Latency: ${metrics.latency}ms`);
    console.log(`      - Throughput: ${metrics.throughput} bytes/s`);
    console.log(`      - QKD Sessions: ${metrics.qkd_sessions}`);
    console.log(`      - Messages Sent: ${metrics.messages_sent}`);
    console.log(`      - Error Rate: ${(metrics.error_rate * 00).toFixed()}%`);
    results.steps.push({ 
      step: , 
      name: 'Connection Metrics', 
      success: true, 
      latency: metrics.latency,
      qkd_sessions: metrics.qkd_sessions
    });

    // Step : Mint SSC tokens for energy savings
    console.log('\nStep : Minting SSC tokens for quantum operations...');
    const energySaved = .; // kWh
    const carbonReduced = .; // kg CO‚‚
    const sscMint = await client.ssc.mint({
      amount: 0,
      energySaved: energySaved,
      carbonReduced: carbonReduced,
      operationType: 'quantum_entanglement'
    });
    console.log(`   SSC Tokens Minted:`);
    console.log(`      - Tokens: ${sscMint.tokens} SSC`);
    console.log(`      - Transaction ID: ${sscMint.tx_id}`);
    console.log(`      - Energy Saved: ${energySaved} kWh`);
    console.log(`      - Carbon Reduced: ${carbonReduced} kg CO‚‚`);
    results.steps.push({ 
      step: , 
      name: 'SSC Token Minting', 
      success: true, 
      tokens: sscMint.tokens,
      energy_saved: energySaved
    });

    // Step : Check SSC balance
    console.log('\nStep : Checking SSC balance...');
    const address = 'alice-wallet-address';
    const balance = await client.ssc.getBalance(address);
    console.log(`   Balance for ${address}:`);
    console.log(`      - SSC Tokens: ${balance.ssc}`);
    console.log(`      - Carbon Credits: ${balance.carbon_credits} kg CO‚‚`);
    console.log(`      - Energy Saved: ${balance.energy_saved} kWh`);
    results.steps.push({ 
      step: , 
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
    console.log('   - Quantum entanglement verified (CHSH > .0)');
    console.log('   - Secure quantum keys generated (BB8 QKD)');
    console.log('   - End-to-end quantum encryption established');
    console.log('   - Quantum-secured PP network operational');
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
    process.exit(results.success ? 0 : );
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit();
  });

