// examples/02-all-protocols.mjs
// Example: All QKD protocols (BB84, E91, SARG04, BBM92)

import { QuantumInternetClient } from '../src/index.mjs';

async function protocolsDemo() {
  console.log('🔐 Quantum Key Distribution Protocols Demo\n');
  console.log('This example demonstrates all YOUR QKD protocol implementations:');
  console.log('- BB84 (YOUR optimized version)');
  console.log('- E91 (YOUR fixed CHSH calculation)');
  console.log('- SARG04 (YOUR implementation)');
  console.log('- BBM92 (YOUR implementation)\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('⚠️  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  try {
    // 1. BB84 Protocol
    console.log('1️⃣  BB84 Protocol (YOUR optimized implementation)');
    console.log('   Running BB84 with 100 qubits...');
    const bb84 = await client.protocols.bb84.execute({
      nQubits: 100,
      errorThreshold: 0.11,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('   ✅ Secure key length:', bb84.secure_key_length, 'bits');
    console.log('   📊 Raw key length:', bb84.raw_key_length, 'bits');
    console.log('   📉 Error rate:', (bb84.error_rate * 100).toFixed(2), '%');
    console.log('   🔒 Session ID:', bb84.session_id);
    console.log();
    
    // Get BB84 statistics
    console.log('   Getting BB84 session statistics...');
    const bb84Stats = await client.protocols.bb84.getKeyStatistics(bb84.session_id);
    console.log('   📈 Efficiency:', (bb84Stats.efficiency * 100).toFixed(1), '%');
    console.log('   🛡️  Security level:', bb84Stats.security_level);
    console.log();
    
    // 2. E91 Protocol (with YOUR fixed CHSH)
    console.log('2️⃣  E91 Protocol (YOUR fixed CHSH calculation)');
    console.log('   Running E91 with 100 entangled pairs...');
    const e91 = await client.protocols.e91.execute({
      nPairs: 100,
      chshThreshold: 2.0,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('   ✅ Secure key length:', e91.secure_key_length, 'bits');
    console.log('   🔔 CHSH value:', e91.chsh_value.toFixed(3));
    console.log('   🎯 Expected for perfect Bell state: ~2.828');
    console.log('   ✅ Entanglement verified:', e91.entanglement_verified ? 'YES' : 'NO');
    console.log('   📉 Error rate:', (e91.error_rate * 100).toFixed(2), '%');
    console.log();
    
    // Get E91 CHSH statistics
    console.log('   Getting E91 CHSH statistics...');
    const e91CHSH = await client.protocols.e91.getCHSHStatistics(e91.session_id);
    console.log('   📊 Correlations:');
    console.log('      E(a,b):', e91CHSH.correlations.E_ab.toFixed(3));
    console.log('      E(a,b\'):', e91CHSH.correlations.E_ab_prime.toFixed(3));
    console.log('      E(a\',b):', e91CHSH.correlations.E_a_prime_b.toFixed(3));
    console.log('      E(a\',b\'):', e91CHSH.correlations.E_a_prime_b_prime.toFixed(3));
    console.log();
    
    // 3. SARG04 Protocol
    console.log('3️⃣  SARG04 Protocol (YOUR implementation)');
    console.log('   Running SARG04 with 100 qubits...');
    const sarg04 = await client.protocols.sarg04.execute({
      nQubits: 100,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('   ✅ Secure key length:', sarg04.secure_key_length, 'bits');
    console.log('   🛡️  PNS attack resistance: Enhanced');
    console.log('   📉 Error rate:', (sarg04.error_rate * 100).toFixed(2), '%');
    console.log('   🔒 Session ID:', sarg04.session_id);
    console.log();
    
    // 4. BBM92 Protocol
    console.log('4️⃣  BBM92 Protocol (YOUR implementation)');
    console.log('   Running BBM92 with 100 entangled pairs...');
    const bbm92 = await client.protocols.bbm92.execute({
      nPairs: 100,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('   ✅ Secure key length:', bbm92.secure_key_length, 'bits');
    console.log('   🔔 Entanglement-based: YES');
    console.log('   📉 Error rate:', (bbm92.error_rate * 100).toFixed(2), '%');
    console.log('   🔒 Session ID:', bbm92.session_id);
    console.log();
    
    // Comparison
    console.log('📊 Protocol Comparison:\n');
    console.log('   Protocol | Key Length | Error Rate | Special Feature');
    console.log('   ---------|------------|------------|----------------');
    console.log(`   BB84     | ${bb84.secure_key_length.toString().padEnd(10)} | ${(bb84.error_rate * 100).toFixed(1).padEnd(10)}% | Original QKD`);
    console.log(`   E91      | ${e91.secure_key_length.toString().padEnd(10)} | ${(e91.error_rate * 100).toFixed(1).padEnd(10)}% | CHSH test`);
    console.log(`   SARG04   | ${sarg04.secure_key_length.toString().padEnd(10)} | ${(sarg04.error_rate * 100).toFixed(1).padEnd(10)}% | PNS resistant`);
    console.log(`   BBM92    | ${bbm92.secure_key_length.toString().padEnd(10)} | ${(bbm92.error_rate * 100).toFixed(1).padEnd(10)}% | Entanglement`);
    console.log();
    
    console.log('✅ All protocols demo complete!\n');
    console.log('All YOUR protocol implementations handled these operations.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run demo
protocolsDemo().catch(console.error);
