// examples/0-local-simulation.mjs
// Example: Local educational simulation (no API needed)

console.log(' Local Simulation Mode (Educational)\n');
console.log('This example shows basic educational simulations that run locally.');
console.log('Note: For production features, use the API (see other examples).\n');

// Simple BB8 simulation (educational only)
function simulateBB8(nQubits) {
  console.log(' BB8 Protocol Simulation (Educational)\n');
  console.log(`Simulating BB8 with ${nQubits} qubits...`);
  
  // Alice's random bits and bases
  const aliceBits = Array.from({ length: nQubits }, () => Math.random() > 0. ?  : 0);
  const aliceBases = Array.from({ length: nQubits }, () => Math.random() > 0. ?  : 0);
  
  // Bob's random bases
  const bobBases = Array.from({ length: nQubits }, () => Math.random() > 0. ?  : 0);
  
  // Bob measures
  const bobMeasurements = aliceBits.map((bit, i) => {
    if (aliceBases[i] === bobBases[i]) {
      return bit; // Same basis = correct measurement
    } else {
      return Math.random() > 0. ?  : 0; // Different basis = random
    }
  });
  
  // Basis reconciliation
  const matchingBases = aliceBases.map((base, i) => base === bobBases[i] ? i : -).filter(i => i >= 0);
  const siftedKey = matchingBases.map(i => aliceBits[i]);
  
  // Error estimation (simulate % error rate)
  const errorRate = 0.0;
  const testBits = Math.floor(siftedKey.length * 0.);
  const estimatedErrors = Math.floor(testBits * errorRate);
  
  const secureKeyLength = siftedKey.length - testBits;
  
  console.log('Results:');
  console.log('  Total qubits sent:', nQubits);
  console.log('  Matching bases:', matchingBases.length);
  console.log('  Sifted key length:', siftedKey.length, 'bits');
  console.log('  Test bits used:', testBits);
  console.log('  Estimated error rate:', (errorRate * 00).toFixed(), '%');
  console.log('  Final secure key:', secureKeyLength, 'bits');
  console.log('  Efficiency:', ((secureKeyLength / nQubits) * 00).toFixed(), '%\n');
  
  return { secureKeyLength, errorRate, efficiency: secureKeyLength / nQubits };
}

// Simple FRAI calculation
function calculateFRAI(reliability, availability, integrity) {
  console.log(' FRAI Trust Metric Calculation\n');
  console.log(`Input metrics:`);
  console.log(`  Reliability: ${reliability}`);
  console.log(`  Availability: ${availability}`);
  console.log(`  Integrity: ${integrity}\n`);
  
  const frai = (reliability * availability * integrity) ** (/);
  
  console.log(`FRAI = (R Ã A Ã I)^(/)`);
  console.log(`FRAI = (${reliability} Ã ${availability} Ã ${integrity})^(/)`);
  console.log(`FRAI = ${frai.toFixed()}\n`);
  
  let rating;
  if (frai > 0.9) rating = 'Excellent';
  else if (frai > 0.7) rating = 'Good';
  else if (frai > 0.) rating = 'Fair';
  else rating = 'Poor';
  
  console.log(`Rating: ${rating}\n`);
  
  return frai;
}

// Simple carbon calculation
function calculateCarbonOffset(energySaved_kWh) {
  console.log(' Carbon Offset Calculation\n');
  console.log(`Energy saved: ${energySaved_kWh} kWh\n`);
  
  // Average grid emission factor (kg CO per kWh)
  const emissionFactor = 0.;
  const carbonOffset = energySaved_kWh * emissionFactor;
  
  // Equivalent conversions
  const treesEquivalent = carbonOffset / ; // Average tree absorbs kg CO/year
  const carMiles = carbonOffset / 0.0; // Average car emits 0g CO/mile
  
  console.log(`Carbon offset: ${carbonOffset.toFixed()} kg CO‚‚`);
  console.log(`Equivalent to:`);
  console.log(`  - ${treesEquivalent.toFixed()} tree-years`);
  console.log(`  - ${carMiles.toFixed(0)} miles not driven\n`);
  
  return { carbonOffset, treesEquivalent, carMiles };
}

// Run simulations
console.log('='.repeat(0));
console.log('LOCAL EDUCATIONAL SIMULATIONS');
console.log('='.repeat(0) + '\n');

// . BB8 Simulation
simulateBB8(00);

console.log('='.repeat(0) + '\n');

// . FRAI Calculation
calculateFRAI(0.9, 0.98, 0.9);

console.log('='.repeat(0) + '\n');

// . Carbon Offset
calculateCarbonOffset(0.);

console.log('='.repeat(0));
console.log('END OF LOCAL SIMULATIONS');
console.log('='.repeat(0) + '\n');

console.log(' Note: These are simplified educational simulations.\n');
console.log('For production features (real quantum hardware, optimized protocols,');
console.log('Q-HAL, Quantum Ratchet, SSC, PP), use the API:\n');
console.log('  export QUANTUM_INTERNET_API_KEY="your-key"');
console.log('  node examples/0-quantum-bridge.mjs\n');
console.log('Get your API key: operations@sparse-supernova.com');
