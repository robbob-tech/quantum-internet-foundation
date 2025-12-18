// examples/03-quantum-ratchet.mjs
// Example: Quantum Ratchet encryption

import { QuantumInternetClient } from '../src/index.mjs';

async function quantumRatchetDemo() {
  console.log('🔒 Quantum Ratchet Encryption Demo\n');
  console.log('This example demonstrates YOUR Quantum Ratchet implementation');
  console.log('for QKD-enhanced end-to-end encryption.\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('⚠️  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  try {
    // 1. Initialize ratchet session
    console.log('1️⃣  Initializing Quantum Ratchet session...');
    const session = await client.ratchet.initialize({
      peerId: 'alice',
      qkdProtocol: 'bb84',
      useRealHardware: false,
      keyRefreshInterval: 100
    });
    console.log('   ✅ Session ID:', session.session_id);
    console.log('   👤 Peer ID:', session.peer_id);
    console.log('   🔐 QKD Protocol:', session.protocol);
    console.log('   ⏱️  Created:', session.created_at);
    console.log();
    
    // 2. Encrypt message
    console.log('2️⃣  Encrypting message with Quantum Ratchet...');
    const message = 'This is a secret message protected by quantum keys!';
    const encrypted = await client.ratchet.encrypt(session.session_id, message);
    console.log('   📝 Original:', message);
    console.log('   🔒 Encrypted:', encrypted.ciphertext.substring(0, 50) + '...');
    console.log('   📏 Ciphertext length:', encrypted.ciphertext.length, 'chars');
    console.log('   🔑 Key ID:', encrypted.key_id);
    console.log();
    
    // 3. Decrypt message
    console.log('3️⃣  Decrypting message with Quantum Ratchet...');
    const decrypted = await client.ratchet.decrypt(
      session.session_id,
      encrypted.ciphertext
    );
    console.log('   🔓 Decrypted:', decrypted.message);
    console.log('   ✅ Match:', decrypted.message === message ? 'YES' : 'NO');
    console.log();
    
    // 4. Encrypt JSON object
    console.log('4️⃣  Encrypting JSON object...');
    const dataObject = {
      user: 'bob',
      balance: 1000,
      transactions: ['tx1', 'tx2', 'tx3'],
      sensitive: true
    };
    const encryptedObj = await client.ratchet.encrypt(
      session.session_id,
      dataObject
    );
    console.log('   📦 Original:', JSON.stringify(dataObject));
    console.log('   🔒 Encrypted:', encryptedObj.ciphertext.substring(0, 50) + '...');
    console.log();
    
    const decryptedObj = await client.ratchet.decrypt(
      session.session_id,
      encryptedObj.ciphertext
    );
    console.log('   🔓 Decrypted:', decryptedObj.message);
    console.log();
    
    // 5. Check session status
    console.log('5️⃣  Checking session status...');
    const status = await client.ratchet.getSessionStatus(session.session_id);
    console.log('   📊 Messages encrypted:', status.messages_encrypted);
    console.log('   🔑 Current key age:', status.key_age, 'messages');
    console.log('   🔄 Keys rotated:', status.keys_rotated, 'times');
    console.log('   ⏱️  Last activity:', status.last_activity);
    console.log();
    
    // 6. Manual key rotation
    console.log('6️⃣  Manually rotating keys...');
    const rotated = await client.ratchet.rotateKeys(session.session_id, {
      forceQKD: true
    });
    console.log('   ✅ Keys rotated successfully');
    console.log('   🔑 New key ID:', rotated.new_key_id);
    console.log('   🔐 QKD used:', rotated.qkd_used ? 'YES' : 'NO');
    console.log();
    
    // 7. Encrypt with new key
    console.log('7️⃣  Encrypting with new key...');
    const message2 = 'New message with rotated keys';
    const encrypted2 = await client.ratchet.encrypt(session.session_id, message2);
    console.log('   📝 Message:', message2);
    console.log('   🔑 Key ID:', encrypted2.key_id);
    console.log('   ✅ Different from previous:', encrypted2.key_id !== encrypted.key_id ? 'YES' : 'NO');
    console.log();
    
    // 8. List all sessions
    console.log('8️⃣  Listing all active sessions...');
    const sessions = await client.ratchet.listSessions();
    console.log('   📋 Active sessions:', sessions.count);
    sessions.sessions.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.session_id} - Peer: ${s.peer_id} - Age: ${s.age}s`);
    });
    console.log();
    
    // 9. Terminate session
    console.log('9️⃣  Terminating session...');
    await client.ratchet.terminate(session.session_id);
    console.log('   ✅ Session terminated successfully');
    console.log('   🔒 Keys securely destroyed');
    console.log();
    
    console.log('✅ Quantum Ratchet demo complete!\n');
    console.log('YOUR Quantum Ratchet implementation handled all encryption.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run demo
quantumRatchetDemo().catch(console.error);
