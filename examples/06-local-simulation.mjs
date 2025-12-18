// examples/06-local-simulation.mjs
// Example: Local educational simulation (no API needed)

console.log('📚 Local Simulation Mode (Educational)\n');
console.log('This example shows basic educational simulations that run locally.');
console.log('Note: For production features, use the API (see other examples).\n');

// Simple BB84 simulation (educational only)
function simulateBB84(nQubits) {
  console.log('🔐 BB84 Protocol Simulation (Educational)\n');
  console.log(`Simulating BB84 with ${nQubits} qubits...`);
  
  // Alice's random bits and bases
  const aliceBits = Array.from({ length: nQubits }, () => Math.random() > 0.5 ? 1 : 0);
  const aliceBases = Array.from({ length: nQubits }, () => Math.random() > 0.5 ? 1 : 0);
  
  // Bob's random bases
  const bobBases = Array.from({ length: nQubits }, () => Math.random() > 0.5 ? 1 : 0);
  
  // Bob measures
  const bobMeasurements = aliceBits.map((bit, i) => {
    if (aliceBases[i] === bobBases[i]) {
      return bit; // Same basis = correct measurement
    } else {
      return Math.random() > 0.5 ? 1 : 0; // Different basis = random
    }
  });
  
  // Basis reconciliation
  const matchingBases = aliceBases.map((base, i) => base === bobBases[i] ? i : -1).filter(i => i >= 0);
  const siftedKey = matchingBases.map(i => aliceBits[i]);
  
  // Error estimation (simulate 5% error rate)
  const errorRate = 0.05;
  const testBits = Math.floor(siftedKey.length * 0.2);
  const estimatedErrors = Math.floor(testBits * errorRate);
  
  const secureKeyLength = siftedKey.length - testBits;
  
  console.log('Results:');
  console.log('  Total qubits sent:', nQubits);
  console.log('  Matching bases:', matchingBases.length);
  console.log('  Sifted key length:', siftedKey.length, 'bits');
  console.log('  Test bits used:', testBits);
  console.log('  Estimated error rate:', (errorRate * 100).toFixed(1), '%');
  console.log('  Final secure key:', secureKeyLength, 'bits');
  console.log('  Efficiency:', ((secureKeyLength / nQubits) * 100).toFixed(1), '%\n');
  
  return { secureKeyLength, errorRate, efficiency: secureKeyLength / nQubits };
}

// Simple FRAI calculation
function calculateFRAI(reliability, availability, integrity) {
  console.log('📊 FRAI Trust Metric Calculation\n');
  console.log(`Input metrics:`);
  console.log(`  Reliability: ${reliability}`);
  console.log(`  Availability: ${availability}`);
  console.log(`  Integrity: ${integrity}\n`);
  
  const frai = (reliability * availability * integrity) ** (1/3);
  
  console.log(`FRAI = (R × A × I)^(1/3)`);
  console.log(`FRAI = (${reliability} × ${availability} × ${integrity})^(1/3)`);
  console.log(`FRAI = ${frai.toFixed(4)}\n`);
  
  let rating;
  if (frai > 0.9) rating = 'Excellent';
  else if (frai > 0.7) rating = 'Good';
  else if (frai > 0.5) rating = 'Fair';
  else rating = 'Poor';
  
  console.log(`Rating: ${rating}\n`);
  
  return frai;
}

// Simple carbon calculation
function calculateCarbonOffset(energySaved_kWh) {
  console.log('🌍 Carbon Offset Calculation\n');
  console.log(`Energy saved: ${energySaved_kWh} kWh\n`);
  
  // Average grid emission factor (kg CO2 per kWh)
  const emissionFactor = 0.5;
  const carbonOffset = energySaved_kWh * emissionFactor;
  
  // Equivalent conversions
  const treesEquivalent = carbonOffset / 21; // Average tree absorbs 21kg CO2/year
  const carMiles = carbonOffset / 0.404; // Average car emits 404g CO2/mile
  
  console.log(`Carbon offset: ${carbonOffset.toFixed(2)} kg CO₂`);
  console.log(`Equivalent to:`);
  console.log(`  - ${treesEquivalent.toFixed(2)} tree-years`);
  console.log(`  - ${carMiles.toFixed(0)} miles not driven\n`);
  
  return { carbonOffset, treesEquivalent, carMiles };
}

// Run simulations
console.log('='.repeat(60));
console.log('LOCAL EDUCATIONAL SIMULATIONS');
console.log('='.repeat(60) + '\n');

// 1. BB84 Simulation
simulateBB84(100);

console.log('='.repeat(60) + '\n');

// 2. FRAI Calculation
calculateFRAI(0.95, 0.98, 0.92);

console.log('='.repeat(60) + '\n');

// 3. Carbon Offset
calculateCarbonOffset(10.5);

console.log('='.repeat(60));
console.log('END OF LOCAL SIMULATIONS');
console.log('='.repeat(60) + '\n');

console.log('📌 Note: These are simplified educational simulations.\n');
console.log('For production features (real quantum hardware, optimized protocols,');
console.log('Q-HAL, Quantum Ratchet, SSC, P2P), use the API:\n');
console.log('  export QUANTUM_INTERNET_API_KEY="your-key"');
console.log('  node examples/01-quantum-bridge.mjs\n');
console.log('Get your API key at: https://quantuminternet.dev/api');
