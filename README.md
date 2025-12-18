# Quantum Internet Foundation

[![npm version](https://img.shields.io/npm/v/@quantum-internet/foundation.svg)](https://www.npmjs.com/package/@quantum-internet/foundation)
[![License](https://img.shields.io/badge/License-Apache%0.0-blue.svg)](https://opensource.org/licenses/Apache-.0)
[![Node](https://img.shields.io/badge/node-%E%D0.0.0-brightgreen.svg)](https://nodejs.org)
![QI Repo-Sat Audit](https://img.shields.io/badge/QI%0Repo--Sat-Passed-skyblue?style=flat-square)

> _QI repo-saturation audit passed  no proprietary quantum bridge, hardware drivers, or production protocols detected._

**Professional quantum networking client library with full access to production quantum infrastructure.**

This package provides a complete client library for quantum internet operations, connecting to our production backend infrastructure that handles all quantum operations, protocol implementations, and hardware integration.

## What You Get

This client library provides access to **ALL** our quantum networking features:

- **Quantum Bridge** - Real IBM Quantum hardware integration
- **Q-HAL** - Hardware abstraction layer with multi-vendor support  
- **QKD Protocols** - BB8, E9 (fixed CHSH), SARG0, BBM9
- **Quantum Ratchet** - QKD-enhanced end-to-end encryption
- **SSC Economics** - Token minting and carbon credit system
- **PP Network** - Quantum-secured mesh networking

All features are delivered via our production API - you get full functionality without exposing proprietary code.

---

## Security / IP Notice

This repository contains **only the client library** for accessing our quantum internet infrastructure.

**What's included in this package:**
- API client for all quantum operations
- TypeScript type definitions
- Usage examples and comprehensive documentation
- Basic educational simulations (optional, local-only)

**What's NOT included (delivered via production API):**
- Quantum bridge implementation (`quantum-bridge-server.py`)
- Q-HAL device drivers and hardware abstraction logic
- Protocol optimization algorithms and improvements
- SARG0/BBM9 protocol implementations
- Quantum Ratchet encryption engine
- SSC economics smart contracts and token minting logic
- Real IBM Quantum hardware integration code
- Production networking infrastructure
- Carbon-aware routing algorithms
- Advanced FRAI trust metrics implementation

**All proprietary algorithms and production code run on our secure backend infrastructure.**

This project is published under an open-source license for transparency and community access. The maintainers make **no commitment** that the public client code reflects, approximates, or reveals any functionality of the private quantum internet backend systems.

**For API access and production use:** operations@sparse-supernova.com

---

## Installation

```bash
npm install @quantum-internet/foundation
```

**Requirements:**
- Node.js >= 0.0.0
- API key from operations@sparse-supernova.com

---

## Quick Start

```javascript
import { QuantumInternetClient } from '@quantum-internet/foundation';

// Initialize client
const client = new QuantumInternetClient({
  apiKey: process.env.QUANTUM_INTERNET_API_KEY
});

// Create Bell pair on real IBM Quantum hardware
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true,
  fidelity: 0.9
});

console.log('Fidelity:', bellPair.fidelity);
console.log('Hardware:', bellPair.hardware); // true = real quantum hardware
```

---

## Features

### . Quantum Bridge (Real Hardware Integration)

Connect to real IBM Quantum computers via our production quantum bridge:

```javascript
// Create entangled Bell pairs
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true
});

// Perform CHSH test (Bell inequality)
const chsh = await client.bridge.performCHSH({
  measurements: 000,
  backend: 'ibm_brisbane'
});
console.log('CHSH value:', chsh.chsh_value); // > .0 violates classical

// List available quantum backends
const backends = await client.bridge.listBackends();
```

### . Q-HAL (Hardware Abstraction Layer)

Unified interface for multi-vendor quantum devices:

```javascript
// Register quantum device
await client.qhal.registerDevice({
  type: 'photonic',
  id: 'photonic-lab-0',
  capabilities: ['bell_pair', 'qkd', 'entanglement_swapping']
});

// List available devices
const devices = await client.qhal.listDevices();

// Execute operation on specific device
const result = await client.qhal.executeOperation(
  'ibm_brisbane',
  'create_bell_pair',
  { fidelity_target: 0.9 }
);
```

### . Quantum Key Distribution (All Protocols)

#### BB8 (Optimized Implementation)

```javascript
const bb8 = await client.protocols.bb8.execute({
  nQubits: 00,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});
console.log('Secure key:', bb8.secure_key_length, 'bits');
```

#### E9 (Fixed CHSH Calculation)

```javascript
const e9 = await client.protocols.e9.execute({
  nPairs: 00,
  useRealHardware: true
});
console.log('CHSH:', e9.chsh_value); // Correctly ~.88 for perfect Bell states
console.log('Key:', e9.secure_key_length, 'bits');
```

#### SARG0 (PNS Attack Resistant)

```javascript
const sarg0 = await client.protocols.sarg0.execute({
  nQubits: 00,
  useRealHardware: false
});
```

#### BBM9 (Entanglement-Based)

```javascript
const bbm9 = await client.protocols.bbm9.execute({
  nPairs: 00,
  useRealHardware: false
});
```

### . Quantum Ratchet (EE Encryption)

QKD-enhanced forward-secure encryption:

```javascript
// Initialize encrypted session
const session = await client.ratchet.initialize({
  peerId: 'alice',
  qkdProtocol: 'bb8',
  useRealHardware: true
});

// Encrypt message
const encrypted = await client.ratchet.encrypt(
  session.session_id,
  'Secret quantum message'
);

// Decrypt message
const decrypted = await client.ratchet.decrypt(
  session.session_id,
  encrypted.ciphertext
);

// Rotate keys
await client.ratchet.rotateKeys(session.session_id);
```

### . SSC Economics (Carbon Credits)

Token minting based on energy savings and carbon offsets:

```javascript
// Mint SSC tokens
const minted = await client.ssc.mint({
  amount: 00,
  energySaved: .,  // kWh
  carbonReduced: 0.7,  // kg CO‚‚
  operationType: 'quantum_entanglement'
});

// Check balance
const balance = await client.ssc.getBalance(address);
console.log('Balance:', balance.ssc, 'SSC');
console.log('Carbon credits:', balance.carbon_credits, 'kg CO‚‚');

// Transfer tokens
await client.ssc.transfer({
  from: addressA,
  to: addressB,
  amount: 0
});
```

### . PP Quantum Network

Decentralized quantum-secured mesh networking:

```javascript
// Connect to peer with QKD
const connection = await client.pp.connect({
  peerId: 'bob',
  enableQKD: true,
  protocol: 'bb8',
  useRealHardware: true
});

// Send encrypted message
await client.pp.send({
  destination: 'bob',
  payload: { message: 'Hello quantum world!' },
  useQKD: true,
  encrypt: true
});

// Check connection metrics
const metrics = await client.pp.getConnectionMetrics(connection.connection_id);
console.log('Latency:', metrics.latency, 'ms');
console.log('QKD sessions:', metrics.qkd_sessions);
```

---

## Examples

See the `examples/` directory for complete working examples:

- `0-quantum-bridge.mjs` - Quantum bridge and real IBM Quantum hardware
- `0-all-protocols.mjs` - All QKD protocols (BB8, E9, SARG0, BBM9)
- `0-quantum-ratchet.mjs` - End-to-end encryption with key rotation
- `0-ssc-economics.mjs` - Token minting and carbon credit system
- `0-full-stack.mjs` - Complete integration of all features
- `0-local-simulation.mjs` - Educational simulations (no API needed)
- `07-complex-quantum-scenario.mjs` - **Complex quantum-secured communication scenario** (-step workflow)

### Running Examples

```bash
# Set your API key
export QUANTUM_INTERNET_API_KEY="your-api-key-here"

# Run examples
npm run example:bridge
npm run example:protocols
npm run example:ratchet
npm run example:ssc
npm run example:full
npm run example:complex

# Local simulation (no API key needed)
npm run example:local
```

---

## API Access

### Free Tier
- 00 requests/day
- Simulation mode only
- All protocols available
- Educational use

### Pro Tier ($99/month)
- 0,000 requests/day
- **Real quantum hardware access**
- All features
- Email support

### Enterprise (Custom Pricing)
- Unlimited requests
- Dedicated hardware access
- Custom integration
- /7 support
- SLA guarantees

**Get your API key:** operations@sparse-supernova.com

---

## Documentation

- **[Complete API Reference](./docs/API_REFERENCE.md)** - Comprehensive API documentation with all methods, parameters, and examples
- [Backend API Specification](./docs/BACKEND_API.md) - Backend endpoint specification for implementation
- [TypeScript Types](./src/types/index.d.ts) - Full TypeScript type definitions
- [Examples Directory](./examples/) - Working code examples for all features

---

## Architecture

### Client Library (This Package)

```
@quantum-internet/foundation
 src/
‚    client/
‚   ‚    QuantumInternetClient.mjs  # Main client
‚   ‚    hardware/                   # Bridge & Q-HAL clients
‚   ‚    protocols/                  # QKD protocol clients
‚   ‚    security/                   # Quantum Ratchet client
‚   ‚    economics/                  # SSC client
‚   ‚    network/                    # PP client
‚    types/                          # TypeScript definitions
 examples/                           # Working examples
```

### Backend Infrastructure (Private)

All quantum operations run on our production backend:

```
quantum-internet-api.sparsesupernova.workers.dev/v/
 /quantum/bridge/          # Quantum bridge endpoints
 /quantum/qhal/            # Q-HAL endpoints
 /quantum/protocols/       # QKD protocol endpoints
 /quantum/ratchet/         # Quantum Ratchet endpoints
 /quantum/ssc/             # SSC economics endpoints
 /quantum/pp/             # PP network endpoints
```

---

## Testing

```bash
# Run basic tests
npm test

# Run all tests
npm run test:all
```

---

## Contributing

We welcome contributions to the client library! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Note:** Contributions are limited to the client library. The backend infrastructure is proprietary and not open for contributions.

---

## License

Apache .0 - See [LICENSE](./LICENSE) for details.

---

## Links

- **Website:** https://sparse-supernova.com
- **API Documentation:** https://sparse-supernova.com/docs
- **Get API Key:** operations@sparse-supernova.com
- **GitHub:** https://github.com/sparse-supernova
- **npm:** https://www.npmjs.com/package/@quantum-internet/foundation
- **Support:** operations@sparse-supernova.com

---

## Educational Use

This package includes basic local simulations for educational purposes (see `examples/0-local-simulation.mjs`). These are simplified implementations for learning quantum networking concepts.

For production use cases, research, or real quantum hardware access, use the API which provides access to our optimized implementations.

---

## Why Use the API?

**Client Library (This Package):**
- Simple to install and use
- TypeScript support
- Comprehensive examples
- Educational simulations

**Backend API (Your Production Code):**
- Optimized quantum protocols
- Real IBM Quantum hardware
- Production-grade Q-HAL
- Quantum Ratchet security
- SSC economics engine
- Scalable infrastructure
- /7 monitoring
- SLA guarantees (Enterprise)

---

## Support

- **Email:** operations@sparse-supernova.com
- **Documentation:** https://sparse-supernova.com/docs

---

## Powered By

This client library connects to production quantum infrastructure powered by:
- IBM Quantum computers
- Qiskit quantum computing framework
- Custom quantum bridge architecture
- Q-HAL hardware abstraction layer
- Production networking infrastructure

**All proprietary implementations run on our secure backend.**

---

Get started today: https://sparse-supernova.com
