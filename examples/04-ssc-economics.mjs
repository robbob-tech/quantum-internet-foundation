// examples/04-ssc-economics.mjs
// Example: SSC (Smart Savings Coin) economics and carbon credits

import { QuantumInternetClient } from '../src/index.mjs';

async function sscEconomicsDemo() {
  console.log('💰 SSC Economics & Carbon Credits Demo\n');
  console.log('This example demonstrates YOUR SSC token minting and');
  console.log('carbon credit system implementation.\n');
  
  const client = new QuantumInternetClient({
    apiKey: process.env.QUANTUM_INTERNET_API_KEY
  });
  
  if (!process.env.QUANTUM_INTERNET_API_KEY) {
    console.log('⚠️  Set QUANTUM_INTERNET_API_KEY environment variable\n');
    return;
  }
  
  // Example addresses
  const aliceAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const bobAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
  
  try {
    // 1. Get system statistics
    console.log('1️⃣  Getting SSC system statistics...');
    const stats = await client.ssc.getSystemStats();
    console.log('   💵 Total supply:', stats.total_supply.toLocaleString(), 'SSC');
    console.log('   💸 Circulating supply:', stats.circulating_supply.toLocaleString(), 'SSC');
    console.log('   🌍 Total carbon offset:', stats.total_carbon_offset.toFixed(2), 'kg CO₂');
    console.log('   ⚡ Total energy saved:', stats.total_energy_saved.toFixed(2), 'kWh');
    console.log();
    
    // 2. Mint SSC tokens (quantum entanglement operation)
    console.log('2️⃣  Minting SSC tokens for quantum entanglement...');
    const mint1 = await client.ssc.mint({
      amount: 100,
      energySaved: 1.5,  // kWh
      carbonReduced: 0.75,  // kg CO₂
      operationType: 'quantum_entanglement',
      recipient: aliceAddress,
      metadata: {
        operation: 'bell_pair_creation',
        backend: 'ibm_brisbane'
      }
    });
    console.log('   ✅ Minted:', mint1.tokens, 'SSC');
    console.log('   🆔 Transaction:', mint1.tx_id);
    console.log('   ⏱️  Timestamp:', mint1.timestamp);
    console.log('   🌱 Carbon offset:', 0.75, 'kg CO₂');
    console.log();
    
    // 3. Mint SSC tokens (QKD operation)
    console.log('3️⃣  Minting SSC tokens for QKD session...');
    const mint2 = await client.ssc.mint({
      amount: 50,
      energySaved: 0.8,
      carbonReduced: 0.4,
      operationType: 'qkd_session',
      recipient: aliceAddress,
      metadata: {
        protocol: 'bb84',
        key_length: 256
      }
    });
    console.log('   ✅ Minted:', mint2.tokens, 'SSC');
    console.log('   🆔 Transaction:', mint2.tx_id);
    console.log('   🌱 Carbon offset:', 0.4, 'kg CO₂');
    console.log();
    
    // 4. Check balance
    console.log('4️⃣  Checking Alice\'s balance...');
    const balance = await client.ssc.getBalance(aliceAddress);
    console.log('   💰 Balance:', balance.ssc.toLocaleString(), 'SSC');
    console.log('   🌍 Carbon credits:', balance.carbon_credits.toFixed(2), 'kg CO₂');
    console.log('   ⚡ Energy saved:', balance.energy_saved.toFixed(2), 'kWh');
    console.log();
    
    // 5. Transfer SSC tokens
    console.log('5️⃣  Transferring SSC tokens to Bob...');
    const transfer = await client.ssc.transfer({
      from: aliceAddress,
      to: bobAddress,
      amount: 30,
      memo: 'Payment for quantum services'
    });
    console.log('   ✅ Transfer complete');
    console.log('   🆔 Transaction:', transfer.tx_id);
    console.log('   💸 Amount:', 30, 'SSC');
    console.log('   📝 Memo:', transfer.memo);
    console.log();
    
    // 6. Check updated balances
    console.log('6️⃣  Checking updated balances...');
    const aliceBalance = await client.ssc.getBalance(aliceAddress);
    const bobBalance = await client.ssc.getBalance(bobAddress);
    console.log('   👩 Alice balance:', aliceBalance.ssc.toLocaleString(), 'SSC');
    console.log('   👨 Bob balance:', bobBalance.ssc.toLocaleString(), 'SSC');
    console.log();
    
    // 7. Get transaction history
    console.log('7️⃣  Getting Alice\'s transaction history...');
    const history = await client.ssc.getTransactionHistory(aliceAddress, {
      limit: 5
    });
    console.log('   📜 Recent transactions:');
    history.transactions.forEach((tx, i) => {
      console.log(`   ${i + 1}. ${tx.type} - ${tx.amount} SSC - ${tx.timestamp}`);
    });
    console.log();
    
    // 8. Get carbon statistics
    console.log('8️⃣  Getting Alice\'s carbon statistics...');
    const carbonStats = await client.ssc.getCarbonStats(aliceAddress);
    console.log('   🌍 Total carbon offset:', carbonStats.total_offset.toFixed(2), 'kg CO₂');
    console.log('   🌲 Trees equivalent:', carbonStats.trees_equivalent.toFixed(1));
    console.log('   🚗 Car miles offset:', carbonStats.car_miles_offset.toFixed(0), 'miles');
    console.log('   ⚡ Total energy saved:', carbonStats.energy_saved.toFixed(2), 'kWh');
    console.log();
    
    // 9. Get exchange rate
    console.log('9️⃣  Getting SSC exchange rate...');
    const rate = await client.ssc.getExchangeRate('USD');
    console.log('   💵 1 SSC =', rate.rate, 'USD');
    console.log('   📈 24h change:', rate.change_24h > 0 ? '+' : '', rate.change_24h.toFixed(2), '%');
    console.log('   📊 Volume (24h):', rate.volume_24h.toLocaleString(), 'SSC');
    console.log();
    
    // 10. Stake SSC tokens
    console.log('🔟 Staking SSC tokens...');
    const stake = await client.ssc.stake({
      address: aliceAddress,
      amount: 50,
      duration: 30  // 30 days
    });
    console.log('   ✅ Staked:', stake.amount, 'SSC');
    console.log('   📅 Duration:', stake.duration, 'days');
    console.log('   💹 APY:', stake.apy, '%');
    console.log('   💰 Expected rewards:', stake.expected_rewards.toFixed(2), 'SSC');
    console.log();
    
    // Summary
    console.log('📊 Session Summary:\n');
    console.log('   Operation              | Amount  | Carbon Offset');
    console.log('   -----------------------|---------|---------------');
    console.log('   Quantum Entanglement   | 100 SSC | 0.75 kg CO₂');
    console.log('   QKD Session            | 50 SSC  | 0.40 kg CO₂');
    console.log('   Transfer to Bob        | -30 SSC | -');
    console.log('   Staked                 | 50 SSC  | -');
    console.log('   -----------------------|---------|---------------');
    console.log('   Final Balance          | 70 SSC  | 1.15 kg CO₂');
    console.log();
    
    console.log('✅ SSC Economics demo complete!\n');
    console.log('YOUR SSC system handled all token operations and carbon tracking.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run demo
sscEconomicsDemo().catch(console.error);
