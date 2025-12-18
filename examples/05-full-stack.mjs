// examples/0-full-stack.mjs
// Example: Full stack integration - All features together

import { QuantumInternetClient } from '../src/index.mjs';

async function fullStackDemo() {
  console.log(' Full Stack Quantum Internet Demo\n');
  console.log('This example demonstrates ALL YOUR features working together:');
  console.log('- Quantum Bridge † Q-HAL † Protocols † Ratchet † SSC † PP\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY,
    debug: false
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  const nodeAlice = 'alice-node-00';
  const nodeBob = 'bob-node-00';
  const aliceAddress = '0x7890abcdef7890abcdef78';
  
  try {
    console.log('='.repeat(70));
    console.log('PHASE : Infrastructure Setup');
    console.log('='.repeat(70) + '\n');
    
    // . Check quantum bridge status
    console.log('  Checking quantum infrastructure...');
    const bridgeStatus = await client.bridge.status();
    console.log('    Quantum bridge:', bridgeStatus.status);
    
    const qhalStatus = await client.qhal.status();
    console.log('    Q-HAL:', qhalStatus.status);
    console.log('    Available devices:', qhalStatus.devices_count);
    console.log();
    
    // . List quantum backends
    console.log('  Discovering quantum backends...');
    const backends = await client.bridge.listBackends();
    const backend = backends.backends[0];
    console.log('    Selected backend:', backend.name);
    console.log('    Qubits:', backend.qubits);
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE : Quantum Key Distribution');
    console.log('='.repeat(70) + '\n');
    
    // . Create Bell pair
    console.log('  Creating entangled Bell pair...');
    const bellPair = await client.bridge.createBellPair({
      backend: backend.name,
      useRealHardware: false,
      fidelity: 0.9
    });
    console.log('    Fidelity:', bellPair.fidelity);
    console.log('    Entanglement created');
    console.log();
    
    // . Generate quantum key via E9
    console.log('  Generating quantum key (E9 protocol)...');
    const qkd = await client.protocols.e9.execute({
      nPairs: 00,
      useRealHardware: false,
      backend: backend.name
    });
    console.log('    Secure key:', qkd.secure_key_length, 'bits');
    console.log('    CHSH value:', qkd.chsh_value.toFixed());
    console.log('    Security verified');
    console.log();
    
    // . Mint SSC tokens for QKD operation
    console.log('  Minting SSC tokens for quantum operations...');
    const sscMint = await client.ssc.mint({
      amount: 0,
      energySaved: 0.8,
      carbonReduced: 0.,
      operationType: 'e9_qkd',
      recipient: aliceAddress
    });
    console.log('    Minted:', sscMint.tokens, 'SSC');
    console.log('    Carbon offset:', 0., 'kg CO‚‚');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE : Secure Communication Channel');
    console.log('='.repeat(70) + '\n');
    
    // . Initialize Quantum Ratchet
    console.log('  Initializing Quantum Ratchet encryption...');
    const ratchet = await client.ratchet.initialize({
      peerId: nodeBob,
      qkdProtocol: 'e9',
      useRealHardware: false,
      backend: backend.name
    });
    console.log('    Session ID:', ratchet.session_id);
    console.log('    End-to-end encryption ready');
    console.log();
    
    // 7. Establish PP connection
    console.log('7  Establishing PP quantum network connection...');
    const ppConn = await client.pp.connect({
      peerId: nodeBob,
      enableQKD: true,
      protocol: 'e9',
      useRealHardware: false,
      backend: backend.name
    });
    console.log('    Connection ID:', ppConn.connection_id);
    console.log('    PP link established');
    console.log('    QKD enabled');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE : Secure Messaging');
    console.log('='.repeat(70) + '\n');
    
    // 8. Encrypt and send message
    console.log('8  Sending encrypted quantum message...');
    const secretData = {
      type: 'financial_transaction',
      from: nodeAlice,
      to: nodeBob,
      amount: 000,
      currency: 'SSC',
      timestamp: new Date().toISOString(),
      sensitive: true
    };
    
    const encrypted = await client.ratchet.encrypt(
      ratchet.session_id,
      secretData
    );
    console.log('    Original data:', JSON.stringify(secretData));
    console.log('    Encrypted:', encrypted.ciphertext.substring(0, 0) + '...');
    console.log();
    
    const sent = await client.pp.send({
      destination: nodeBob,
      payload: encrypted.ciphertext,
      useQKD: true,
      encrypt: true
    });
    console.log('    Message sent');
    console.log('   † Atom ID:', sent.atom_id);
    console.log('    Delivery status:', sent.status);
    console.log();
    
    // 9. Mint SSC for messaging
    console.log('9  Minting SSC tokens for secure messaging...');
    const sscMsg = await client.ssc.mint({
      amount: 0,
      energySaved: 0.,
      carbonReduced: 0.,
      operationType: 'quantum_messaging',
      recipient: aliceAddress
    });
    console.log('    Minted:', sscMsg.tokens, 'SSC');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE : Network Monitoring');
    console.log('='.repeat(70) + '\n');
    
    // 0. Get connection metrics
    console.log(' Checking connection metrics...');
    const metrics = await client.pp.getConnectionMetrics(ppConn.connection_id);
    console.log('    Latency:', metrics.latency, 'ms');
    console.log('    Throughput:', metrics.throughput, 'Mbps');
    console.log('    QKD sessions:', metrics.qkd_sessions);
    console.log('    Messages sent:', metrics.messages_sent);
    console.log();
    
    // . Check Ratchet session status
    console.log('  Checking Quantum Ratchet status...');
    const ratchetStatus = await client.ratchet.getSessionStatus(ratchet.session_id);
    console.log('   ‘ Key age:', ratchetStatus.key_age, 'messages');
    console.log('    Keys rotated:', ratchetStatus.keys_rotated, 'times');
    console.log('    Messages:', ratchetStatus.messages_encrypted);
    console.log();
    
    // . Get final balance
    console.log('  Checking final SSC balance...');
    const finalBalance = await client.ssc.getBalance(aliceAddress);
    console.log('    Balance:', finalBalance.ssc.toLocaleString(), 'SSC');
    console.log('    Carbon credits:', finalBalance.carbon_credits.toFixed(), 'kg CO‚‚');
    console.log('    Energy saved:', finalBalance.energy_saved.toFixed(), 'kWh');
    console.log();
    
    console.log('='.repeat(70));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(70) + '\n');
    
    console.log(' Full Stack Operations Completed:\n');
    console.log('    Quantum Bridge: Bell pair created');
    console.log('    Q-HAL: Device management operational');
    console.log('    E9 Protocol: Quantum key generated (' + qkd.secure_key_length + ' bits)');
    console.log('    Quantum Ratchet: EE encryption established');
    console.log('    PP Network: Secure connection active');
    console.log('    SSC Economics: ' + (sscMint.tokens + sscMsg.tokens) + ' tokens minted');
    console.log('    Carbon Impact: ' + (0. + 0.).toFixed() + ' kg CO‚‚ offset');
    console.log('    Secure Message: Successfully transmitted\n');
    
    console.log(' Full Stack Demo Complete!\n');
    console.log('ALL YOUR SYSTEMS worked together seamlessly:');
    console.log('- quantum-bridge-server.py');
    console.log('- Q-HAL device drivers');
    console.log('- Optimized QKD protocols');
    console.log('- Quantum Ratchet encryption');
    console.log('- SSC economics engine');
    console.log('- PP network infrastructure\n');
    
  } catch (error) {
    console.error(' Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run demo
fullStackDemo().catch(console.error);
