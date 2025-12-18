// examples/0-all-protocols.mjs
// Example: All QKD protocols (BB8, E9, SARG0, BBM9)

import { QuantumInternetClient } from '../src/index.mjs';

async function protocolsDemo() {
  console.log(' Quantum Key Distribution Protocols Demo\n');
  console.log('This example demonstrates all YOUR QKD protocol implementations:');
  console.log('- BB8 (YOUR optimized version)');
  console.log('- E9 (YOUR fixed CHSH calculation)');
  console.log('- SARG0 (YOUR implementation)');
  console.log('- BBM9 (YOUR implementation)\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  try {
    // . BB8 Protocol
    console.log('  BB8 Protocol (YOUR optimized implementation)');
    console.log('   Running BB8 with 00 qubits...');
    const bb8 = await client.protocols.bb8.execute({
      nQubits: 00,
      errorThreshold: 0.,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('    Secure key length:', bb8.secure_key_length, 'bits');
    console.log('    Raw key length:', bb8.raw_key_length, 'bits');
    console.log('    Error rate:', (bb8.error_rate * 00).toFixed(), '%');
    console.log('    Session ID:', bb8.session_id);
    console.log();
    
    // Get BB8 statistics
    console.log('   Getting BB8 session statistics...');
    const bb8Stats = await client.protocols.bb8.getKeyStatistics(bb8.session_id);
    console.log('    Efficiency:', (bb8Stats.efficiency * 00).toFixed(), '%');
    console.log('     Security level:', bb8Stats.security_level);
    console.log();
    
    // . E9 Protocol (with YOUR fixed CHSH)
    console.log('  E9 Protocol (YOUR fixed CHSH calculation)');
    console.log('   Running E9 with 00 entangled pairs...');
    const e9 = await client.protocols.e9.execute({
      nPairs: 00,
      chshThreshold: .0,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('    Secure key length:', e9.secure_key_length, 'bits');
    console.log('    CHSH value:', e9.chsh_value.toFixed());
    console.log('    Expected for perfect Bell state: ~.88');
    console.log('    Entanglement verified:', e9.entanglement_verified ? 'YES' : 'NO');
    console.log('    Error rate:', (e9.error_rate * 00).toFixed(), '%');
    console.log();
    
    // Get E9 CHSH statistics
    console.log('   Getting E9 CHSH statistics...');
    const e9CHSH = await client.protocols.e9.getCHSHStatistics(e9.session_id);
    console.log('    Correlations:');
    console.log('      E(a,b):', e9CHSH.correlations.E_ab.toFixed());
    console.log('      E(a,b\'):', e9CHSH.correlations.E_ab_prime.toFixed());
    console.log('      E(a\',b):', e9CHSH.correlations.E_a_prime_b.toFixed());
    console.log('      E(a\',b\'):', e9CHSH.correlations.E_a_prime_b_prime.toFixed());
    console.log();
    
    // . SARG0 Protocol
    console.log('  SARG0 Protocol (YOUR implementation)');
    console.log('   Running SARG0 with 00 qubits...');
    const sarg0 = await client.protocols.sarg0.execute({
      nQubits: 00,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('    Secure key length:', sarg0.secure_key_length, 'bits');
    console.log('     PNS attack resistance: Enhanced');
    console.log('    Error rate:', (sarg0.error_rate * 00).toFixed(), '%');
    console.log('    Session ID:', sarg0.session_id);
    console.log();
    
    // . BBM9 Protocol
    console.log('  BBM9 Protocol (YOUR implementation)');
    console.log('   Running BBM9 with 00 entangled pairs...');
    const bbm9 = await client.protocols.bbm9.execute({
      nPairs: 00,
      useRealHardware: false,
      backend: 'ibm_brisbane'
    });
    console.log('    Secure key length:', bbm9.secure_key_length, 'bits');
    console.log('    Entanglement-based: YES');
    console.log('    Error rate:', (bbm9.error_rate * 00).toFixed(), '%');
    console.log('    Session ID:', bbm9.session_id);
    console.log();
    
    // Comparison
    console.log(' Protocol Comparison:\n');
    console.log('   Protocol | Key Length | Error Rate | Special Feature');
    console.log('   ---------|------------|------------|----------------');
    console.log(`   BB8     | ${bb8.secure_key_length.toString().padEnd(0)} | ${(bb8.error_rate * 00).toFixed().padEnd(0)}% | Original QKD`);
    console.log(`   E9      | ${e9.secure_key_length.toString().padEnd(0)} | ${(e9.error_rate * 00).toFixed().padEnd(0)}% | CHSH test`);
    console.log(`   SARG0   | ${sarg0.secure_key_length.toString().padEnd(0)} | ${(sarg0.error_rate * 00).toFixed().padEnd(0)}% | PNS resistant`);
    console.log(`   BBM9    | ${bbm9.secure_key_length.toString().padEnd(0)} | ${(bbm9.error_rate * 00).toFixed().padEnd(0)}% | Entanglement`);
    console.log();
    
    console.log(' All protocols demo complete!\n');
    console.log('All YOUR protocol implementations handled these operations.');
    
  } catch (error) {
    console.error(' Error:', error.message);
  }
}

// Run demo
protocolsDemo().catch(console.error);
