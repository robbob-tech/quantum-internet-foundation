// examples/0-quantum-bridge.mjs
// Example: Using Quantum Bridge with real IBM Quantum hardware

import { QuantumInternetClient } from '../src/index.mjs';

async function quantumBridgeDemo() {
  console.log(' Quantum Bridge Demo\n');
  console.log('This example demonstrates connecting to real IBM Quantum hardware');
  console.log('via YOUR quantum-bridge-server.py backend.\n');
  
  // Initialize client
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('  Set QUANTUM_INTERNET_API_KEY environment variable');
    console.log('   Get your API key: operations@sparse-supernova.com\n');
    return;
  }
  
  try {
    // . Check bridge status
    console.log('.  Checking quantum bridge status...');
    const status = await client.bridge.status();
    console.log('   [OK] Bridge status:', status.status);
    console.log('    Connected backends:', status.backends_connected);
    console.log('     Uptime:', status.uptime, '\n');
    
    // . List available backends
    console.log('.  Listing available quantum backends...');
    const backends = await client.bridge.listBackends();
    console.log('   Available backends:');
    backends.backends.forEach(b => {
      console.log(`   - ${b.name}: ${b.qubits} qubits, status: ${b.status}`);
    });
    console.log();
    
    // . Create Bell pair (simulation mode)
    console.log('.  Creating Bell pair (simulation mode)...');
    const bellPairSim = await client.bridge.createBellPair({
      backend: 'ibm_brisbane',
      useRealHardware: false,
      fidelity: 0.9
    });
    console.log('   [OK] Fidelity:', bellPairSim.fidelity);
    console.log('    Measurements:', bellPairSim.measurements);
    console.log('     Hardware:', bellPairSim.hardware ? 'Real' : 'Simulated');
    console.log();
    
    // . Create Bell pair (real hardware - if available)
    if (status.real_hardware_available) {
      console.log('.  Creating Bell pair (REAL IBM Quantum hardware)...');
      const bellPairReal = await client.bridge.createBellPair({
        backend: 'ibm_brisbane',
        useRealHardware: true,
        fidelity: 0.90
      });
      console.log('   [OK] Fidelity:', bellPairReal.fidelity);
      console.log('    Measurements:', bellPairReal.measurements);
      console.log('    Hardware:', bellPairReal.backend);
      console.log('     Queue time:', bellPairReal.queue_time, 'seconds');
      console.log();
    }
    
    // . Perform CHSH test
    console.log('.  Performing CHSH test (Bell inequality)...');
    const chsh = await client.bridge.performCHSH({
      measurements: 000,
      backend: 'ibm_brisbane',
      useRealHardware: false
    });
    console.log('    CHSH value:', chsh.chsh_value);
    console.log('    Classical limit:', .0);
    console.log('    Violates classical:', chsh.violates_classical ? 'YES' : 'NO');
    console.log('    Correlations:', chsh.correlations);
    console.log();
    
    // . Get backend details
    console.log('.  Getting backend information...');
    const backendInfo = await client.bridge.getBackendInfo('ibm_brisbane');
    console.log('   Backend:', backendInfo.name);
    console.log('   Qubits:', backendInfo.qubits);
    console.log('   Quantum volume:', backendInfo.quantum_volume);
    console.log('   CLOPS:', backendInfo.clops);
    console.log();
    
    console.log('[OK] Quantum Bridge demo complete!\n');
    console.log('Your quantum-bridge-server.py handled all these operations.');
    
  } catch (error) {
    console.error('[ERROR] Error:', error.message);
  }
}

// Run demo
quantumBridgeDemo().catch(console.error);
