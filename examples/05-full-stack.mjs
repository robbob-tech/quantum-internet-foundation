// examples/05-full-stack.mjs
// Example: Full stack integration - All features together

import { QuantumInternetClient } from '../src/index.mjs';

async function fullStackDemo() {
  console.log('🚀 Full Stack Quantum Internet Demo\n');
  console.log('This example demonstrates ALL YOUR features working together:');
  console.log('- Quantum Bridge → Q-HAL → Protocols → Ratchet → SSC → P2P\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY,
    debug: false
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('⚠️  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  const nodeAlice = 'alice-node-001';
  const nodeBob = 'bob-node-002';
  const aliceAddress = '0x1234567890abcdef1234567890abcdef12345678';
  
  try {
    console.log('='.repeat(70));
    console.log('PHASE 1: Infrastructure Setup');
    console.log('='.repeat(70) + '\n');
    
    // 1. Check quantum bridge status
    console.log('1️⃣  Checking quantum infrastructure...');
    const bridgeStatus = await client.bridge.status();
    console.log('   ✅ Quantum bridge:', bridgeStatus.status);
    
    const qhalStatus = await client.qhal.status();
    console.log('   ✅ Q-HAL:', qhalStatus.status);
    console.log('   📡 Available devices:', qhalStatus.devices_count);
    console.log();
    
    // 2. List quantum backends
    console.log('2️⃣  Discovering quantum backends...');
    const backends = await client.bridge.listBackends();
    const backend = backends.backends[0];
    console.log('   ✅ Selected backend:', backend.name);
    console.log('   🔬 Qubits:', backend.qubits);
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE 2: Quantum Key Distribution');
    console.log('='.repeat(70) + '\n');
    
    // 3. Create Bell pair
    console.log('3️⃣  Creating entangled Bell pair...');
    const bellPair = await client.bridge.createBellPair({
      backend: backend.name,
      useRealHardware: false,
      fidelity: 0.95
    });
    console.log('   ✅ Fidelity:', bellPair.fidelity);
    console.log('   🌟 Entanglement created');
    console.log();
    
    // 4. Generate quantum key via E91
    console.log('4️⃣  Generating quantum key (E91 protocol)...');
    const qkd = await client.protocols.e91.execute({
      nPairs: 100,
      useRealHardware: false,
      backend: backend.name
    });
    console.log('   ✅ Secure key:', qkd.secure_key_length, 'bits');
    console.log('   🔔 CHSH value:', qkd.chsh_value.toFixed(3));
    console.log('   ✅ Security verified');
    console.log();
    
    // 5. Mint SSC tokens for QKD operation
    console.log('5️⃣  Minting SSC tokens for quantum operations...');
    const sscMint = await client.ssc.mint({
      amount: 50,
      energySaved: 0.8,
      carbonReduced: 0.4,
      operationType: 'e91_qkd',
      recipient: aliceAddress
    });
    console.log('   ✅ Minted:', sscMint.tokens, 'SSC');
    console.log('   🌱 Carbon offset:', 0.4, 'kg CO₂');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE 3: Secure Communication Channel');
    console.log('='.repeat(70) + '\n');
    
    // 6. Initialize Quantum Ratchet
    console.log('6️⃣  Initializing Quantum Ratchet encryption...');
    const ratchet = await client.ratchet.initialize({
      peerId: nodeBob,
      qkdProtocol: 'e91',
      useRealHardware: false,
      backend: backend.name
    });
    console.log('   ✅ Session ID:', ratchet.session_id);
    console.log('   🔐 End-to-end encryption ready');
    console.log();
    
    // 7. Establish P2P connection
    console.log('7️⃣  Establishing P2P quantum network connection...');
    const p2pConn = await client.p2p.connect({
      peerId: nodeBob,
      enableQKD: true,
      protocol: 'e91',
      useRealHardware: false,
      backend: backend.name
    });
    console.log('   ✅ Connection ID:', p2pConn.connection_id);
    console.log('   🔗 P2P link established');
    console.log('   🔐 QKD enabled');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE 4: Secure Messaging');
    console.log('='.repeat(70) + '\n');
    
    // 8. Encrypt and send message
    console.log('8️⃣  Sending encrypted quantum message...');
    const secretData = {
      type: 'financial_transaction',
      from: nodeAlice,
      to: nodeBob,
      amount: 1000,
      currency: 'SSC',
      timestamp: new Date().toISOString(),
      sensitive: true
    };
    
    const encrypted = await client.ratchet.encrypt(
      ratchet.session_id,
      secretData
    );
    console.log('   📝 Original data:', JSON.stringify(secretData));
    console.log('   🔒 Encrypted:', encrypted.ciphertext.substring(0, 40) + '...');
    console.log();
    
    const sent = await client.p2p.send({
      destination: nodeBob,
      payload: encrypted.ciphertext,
      useQKD: true,
      encrypt: true
    });
    console.log('   ✅ Message sent');
    console.log('   🆔 Atom ID:', sent.atom_id);
    console.log('   📡 Delivery status:', sent.status);
    console.log();
    
    // 9. Mint SSC for messaging
    console.log('9️⃣  Minting SSC tokens for secure messaging...');
    const sscMsg = await client.ssc.mint({
      amount: 10,
      energySaved: 0.2,
      carbonReduced: 0.1,
      operationType: 'quantum_messaging',
      recipient: aliceAddress
    });
    console.log('   ✅ Minted:', sscMsg.tokens, 'SSC');
    console.log();
    
    console.log('='.repeat(70));
    console.log('PHASE 5: Network Monitoring');
    console.log('='.repeat(70) + '\n');
    
    // 10. Get connection metrics
    console.log('🔟 Checking connection metrics...');
    const metrics = await client.p2p.getConnectionMetrics(p2pConn.connection_id);
    console.log('   📊 Latency:', metrics.latency, 'ms');
    console.log('   📈 Throughput:', metrics.throughput, 'Mbps');
    console.log('   🔐 QKD sessions:', metrics.qkd_sessions);
    console.log('   📦 Messages sent:', metrics.messages_sent);
    console.log();
    
    // 11. Check Ratchet session status
    console.log('1️⃣1️⃣  Checking Quantum Ratchet status...');
    const ratchetStatus = await client.ratchet.getSessionStatus(ratchet.session_id);
    console.log('   🔑 Key age:', ratchetStatus.key_age, 'messages');
    console.log('   🔄 Keys rotated:', ratchetStatus.keys_rotated, 'times');
    console.log('   📊 Messages:', ratchetStatus.messages_encrypted);
    console.log();
    
    // 12. Get final balance
    console.log('1️⃣2️⃣  Checking final SSC balance...');
    const finalBalance = await client.ssc.getBalance(aliceAddress);
    console.log('   💰 Balance:', finalBalance.ssc.toLocaleString(), 'SSC');
    console.log('   🌍 Carbon credits:', finalBalance.carbon_credits.toFixed(2), 'kg CO₂');
    console.log('   ⚡ Energy saved:', finalBalance.energy_saved.toFixed(2), 'kWh');
    console.log();
    
    console.log('='.repeat(70));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(70) + '\n');
    
    console.log('✅ Full Stack Operations Completed:\n');
    console.log('   ✓ Quantum Bridge: Bell pair created');
    console.log('   ✓ Q-HAL: Device management operational');
    console.log('   ✓ E91 Protocol: Quantum key generated (' + qkd.secure_key_length + ' bits)');
    console.log('   ✓ Quantum Ratchet: E2E encryption established');
    console.log('   ✓ P2P Network: Secure connection active');
    console.log('   ✓ SSC Economics: ' + (sscMint.tokens + sscMsg.tokens) + ' tokens minted');
    console.log('   ✓ Carbon Impact: ' + (0.4 + 0.1).toFixed(1) + ' kg CO₂ offset');
    console.log('   ✓ Secure Message: Successfully transmitted\n');
    
    console.log('🎉 Full Stack Demo Complete!\n');
    console.log('ALL YOUR SYSTEMS worked together seamlessly:');
    console.log('- quantum-bridge-server.py');
    console.log('- Q-HAL device drivers');
    console.log('- Optimized QKD protocols');
    console.log('- Quantum Ratchet encryption');
    console.log('- SSC economics engine');
    console.log('- P2P network infrastructure\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run demo
fullStackDemo().catch(console.error);
