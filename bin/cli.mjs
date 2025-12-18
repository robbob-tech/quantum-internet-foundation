#!/usr/bin/env node
// bin/cli.mjs
// Command-line interface for Quantum Internet Foundation

import { QuantumInternetClient } from '../src/index.mjs';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Quantum Internet Foundation CLI

Usage: qi <command> [options]

Commands:
  status              Check API connection and backend status
  bridge-list         List available quantum backends
  bell-pair           Create a Bell pair
  qkd <protocol>      Execute QKD protocol (bb84, e91, sarg04, bbm92)
  balance <address>   Get SSC balance
  
Options:
  --help, -h          Show this help message
  --version, -v       Show version
  --api-key <key>     API key (or set QUANTUM_INTERNET_API_KEY)
  --real-hardware     Use real quantum hardware (default: false)
  --backend <name>    Quantum backend name (default: ibm_brisbane)
  --qubits <n>        Number of qubits (default: 100)
  
Examples:
  qi status
  qi bridge-list
  qi bell-pair --real-hardware --backend ibm_brisbane
  qi qkd bb84 --qubits 100
  qi balance 0x1234567890abcdef1234567890abcdef12345678
  
Get your API key: operations@sparse-supernova.com
`);
}

async function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    const pkg = await import('../package.json', { assert: { type: 'json' } });
    console.log(`v${pkg.default.version}`);
    process.exit(0);
  }
  
  const command = args[0];
  const apiKey = process.env.QUANTUM_INTERNET_API_KEY || 
                 args[args.indexOf('--api-key') + 1];
  
  if (!apiKey) {
    console.error('Error: No API key provided');
    console.error('Set QUANTUM_INTERNET_API_KEY or use --api-key <key>');
    console.error('Get your API key: operations@sparse-supernova.com');
    process.exit(1);
  }
  
  const client = new QuantumInternetClient({ apiKey });
  
  try {
    switch (command) {
      case 'status': {
        console.log('Checking API status...\n');
        const status = await client.status();
        console.log('API Status:', status.status);
        console.log('Version:', status.version);
        console.log('Uptime:', status.uptime);
        break;
      }
      
      case 'bridge-list': {
        console.log('Listing quantum backends...\n');
        const backends = await client.bridge.listBackends();
        console.log('Available backends:');
        backends.backends.forEach(b => {
          console.log(`  - ${b.name}: ${b.qubits} qubits (${b.status})`);
        });
        break;
      }
      
      case 'bell-pair': {
        const backend = args[args.indexOf('--backend') + 1] || 'ibm_brisbane';
        const useReal = args.includes('--real-hardware');
        console.log('Creating Bell pair...\n');
        const result = await client.bridge.createBellPair({
          backend,
          useRealHardware: useReal
        });
        console.log('Fidelity:', result.fidelity);
        console.log('Hardware:', result.hardware ? 'Real' : 'Simulated');
        console.log('Backend:', result.backend);
        break;
      }
      
      case 'qkd': {
        const protocol = args[1];
        if (!['bb84', 'e91', 'sarg04', 'bbm92'].includes(protocol)) {
          console.error('Invalid protocol. Use: bb84, e91, sarg04, or bbm92');
          process.exit(1);
        }
        const nQubits = parseInt(args[args.indexOf('--qubits') + 1] || '100');
        const useReal = args.includes('--real-hardware');
        
        console.log(`Executing ${protocol.toUpperCase()} protocol...\n`);
        let result;
        if (protocol === 'bb84') {
          result = await client.protocols.bb84.execute({ nQubits, useRealHardware: useReal });
        } else if (protocol === 'e91') {
          result = await client.protocols.e91.execute({ nPairs: nQubits, useRealHardware: useReal });
        } else if (protocol === 'sarg04') {
          result = await client.protocols.sarg04.execute({ nQubits, useRealHardware: useReal });
        } else if (protocol === 'bbm92') {
          result = await client.protocols.bbm92.execute({ nPairs: nQubits, useRealHardware: useReal });
        }
        console.log('Secure key length:', result.secure_key_length, 'bits');
        console.log('Error rate:', (result.error_rate * 100).toFixed(2), '%');
        console.log('Session ID:', result.session_id);
        break;
      }
      
      case 'balance': {
        const address = args[1];
        if (!address) {
          console.error('Error: Address required');
          process.exit(1);
        }
        console.log('Checking SSC balance...\n');
        const balance = await client.ssc.getBalance(address);
        console.log('Balance:', balance.ssc, 'SSC');
        console.log('Carbon credits:', balance.carbon_credits, 'kg CO₂');
        console.log('Energy saved:', balance.energy_saved, 'kWh');
        break;
      }
      
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "qi --help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
