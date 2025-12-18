// examples/0-ssc-economics.mjs
// Example: SSC (Smart Savings Coin) economics and carbon credits

import { QuantumInternetClient } from '../src/index.mjs';

async function sscEconomicsDemo() {
  console.log(' SSC Economics & Carbon Credits Demo\n');
  console.log('This example demonstrates YOUR SSC token minting and');
  console.log('carbon credit system implementation.\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  // Example addresses
  const aliceAddress = '0x7890abcdef7890abcdef78';
  const bobAddress = '0xabcdef7890abcdef7890abcdef';
  
  try {
    // . Get system statistics
    console.log('  Getting SSC system statistics...');
    const stats = await client.ssc.getSystemStats();
    console.log('   µ Total supply:', stats.total_supply.toLocaleString(), 'SSC');
    console.log('    Circulating supply:', stats.circulating_supply.toLocaleString(), 'SSC');
    console.log('    Total carbon offset:', stats.total_carbon_offset.toFixed(), 'kg CO‚‚');
    console.log('    Total energy saved:', stats.total_energy_saved.toFixed(), 'kWh');
    console.log();
    
    // . Mint SSC tokens (quantum entanglement operation)
    console.log('  Minting SSC tokens for quantum entanglement...');
    const mint = await client.ssc.mint({
      amount: 00,
      energySaved: .,  // kWh
      carbonReduced: 0.7,  // kg CO‚‚
      operationType: 'quantum_entanglement',
      recipient: aliceAddress,
      metadata: {
        operation: 'bell_pair_creation',
        backend: 'ibm_brisbane'
      }
    });
    console.log('    Minted:', mint.tokens, 'SSC');
    console.log('   † Transaction:', mint.tx_id);
    console.log('     Timestamp:', mint.timestamp);
    console.log('    Carbon offset:', 0.7, 'kg CO‚‚');
    console.log();
    
    // . Mint SSC tokens (QKD operation)
    console.log('  Minting SSC tokens for QKD session...');
    const mint = await client.ssc.mint({
      amount: 0,
      energySaved: 0.8,
      carbonReduced: 0.,
      operationType: 'qkd_session',
      recipient: aliceAddress,
      metadata: {
        protocol: 'bb8',
        key_length: 
      }
    });
    console.log('    Minted:', mint.tokens, 'SSC');
    console.log('   † Transaction:', mint.tx_id);
    console.log('    Carbon offset:', 0., 'kg CO‚‚');
    console.log();
    
    // . Check balance
    console.log('  Checking Alice\'s balance...');
    const balance = await client.ssc.getBalance(aliceAddress);
    console.log('    Balance:', balance.ssc.toLocaleString(), 'SSC');
    console.log('    Carbon credits:', balance.carbon_credits.toFixed(), 'kg CO‚‚');
    console.log('    Energy saved:', balance.energy_saved.toFixed(), 'kWh');
    console.log();
    
    // . Transfer SSC tokens
    console.log('  Transferring SSC tokens to Bob...');
    const transfer = await client.ssc.transfer({
      from: aliceAddress,
      to: bobAddress,
      amount: 0,
      memo: 'Payment for quantum services'
    });
    console.log('    Transfer complete');
    console.log('   † Transaction:', transfer.tx_id);
    console.log('    Amount:', 0, 'SSC');
    console.log('    Memo:', transfer.memo);
    console.log();
    
    // . Check updated balances
    console.log('  Checking updated balances...');
    const aliceBalance = await client.ssc.getBalance(aliceAddress);
    const bobBalance = await client.ssc.getBalance(bobAddress);
    console.log('   ‘© Alice balance:', aliceBalance.ssc.toLocaleString(), 'SSC');
    console.log('   ‘¨ Bob balance:', bobBalance.ssc.toLocaleString(), 'SSC');
    console.log();
    
    // 7. Get transaction history
    console.log('7  Getting Alice\'s transaction history...');
    const history = await client.ssc.getTransactionHistory(aliceAddress, {
      limit: 
    });
    console.log('    Recent transactions:');
    history.transactions.forEach((tx, i) => {
      console.log(`   ${i + }. ${tx.type} - ${tx.amount} SSC - ${tx.timestamp}`);
    });
    console.log();
    
    // 8. Get carbon statistics
    console.log('8  Getting Alice\'s carbon statistics...');
    const carbonStats = await client.ssc.getCarbonStats(aliceAddress);
    console.log('    Total carbon offset:', carbonStats.total_offset.toFixed(), 'kg CO‚‚');
    console.log('   ² Trees equivalent:', carbonStats.trees_equivalent.toFixed());
    console.log('    Car miles offset:', carbonStats.car_miles_offset.toFixed(0), 'miles');
    console.log('    Total energy saved:', carbonStats.energy_saved.toFixed(), 'kWh');
    console.log();
    
    // 9. Get exchange rate
    console.log('9  Getting SSC exchange rate...');
    const rate = await client.ssc.getExchangeRate('USD');
    console.log('   µ  SSC =', rate.rate, 'USD');
    console.log('    h change:', rate.change_h > 0 ? '+' : '', rate.change_h.toFixed(), '%');
    console.log('    Volume (h):', rate.volume_h.toLocaleString(), 'SSC');
    console.log();
    
    // 0. Stake SSC tokens
    console.log(' Staking SSC tokens...');
    const stake = await client.ssc.stake({
      address: aliceAddress,
      amount: 0,
      duration: 0  // 0 days
    });
    console.log('    Staked:', stake.amount, 'SSC');
    console.log('    Duration:', stake.duration, 'days');
    console.log('   ¹ APY:', stake.apy, '%');
    console.log('    Expected rewards:', stake.expected_rewards.toFixed(), 'SSC');
    console.log();
    
    // Summary
    console.log(' Session Summary:\n');
    console.log('   Operation              | Amount  | Carbon Offset');
    console.log('   -----------------------|---------|---------------');
    console.log('   Quantum Entanglement   | 00 SSC | 0.7 kg CO‚‚');
    console.log('   QKD Session            | 0 SSC  | 0.0 kg CO‚‚');
    console.log('   Transfer to Bob        | -0 SSC | -');
    console.log('   Staked                 | 0 SSC  | -');
    console.log('   -----------------------|---------|---------------');
    console.log('   Final Balance          | 70 SSC  | . kg CO‚‚');
    console.log();
    
    console.log(' SSC Economics demo complete!\n');
    console.log('YOUR SSC system handled all token operations and carbon tracking.');
    
  } catch (error) {
    console.error(' Error:', error.message);
  }
}

// Run demo
sscEconomicsDemo().catch(console.error);
