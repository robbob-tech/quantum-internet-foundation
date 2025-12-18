# Quantum Internet Foundation

[![npm version](https://img.shields.io/npm/v/@quantum-internet/foundation.svg)](https://www.npmjs.com/package/@quantum-internet/foundation)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
![QI Repo-Sat Audit](https://img.shields.io/badge/QI%20Repo--Sat-Passed-skyblue?style=flat-square)

> _QI repo-saturation audit passed — no proprietary quantum bridge, hardware drivers, or production protocols detected._

**Professional quantum networking client library with full access to production quantum infrastructure.**

This package provides a complete client library for quantum internet operations, connecting to our production backend infrastructure that handles all quantum operations, protocol implementations, and hardware integration.

## What You Get

This client library provides access to **ALL** our quantum networking features:

- **Quantum Bridge** - Real IBM Quantum hardware integration
- **Q-HAL** - Hardware abstraction layer with multi-vendor support  
- **QKD Protocols** - BB84, E91 (fixed CHSH), SARG04, BBM92
- **Quantum Ratchet** - QKD-enhanced end-to-end encryption
- **SSC Economics** - Token minting and carbon credit system
- **P2P Network** - Quantum-secured mesh networking

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
- SARG04/BBM92 protocol implementations
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
- Node.js >= 20.0.0
- API key from operations@sparse-supernova.com

**API Access Tiers:**
- **Free Tier**: 100 requests/day, simulation mode only, all protocols available
- **Pro Tier**: 10,000 requests/day, real hardware access, $99/month
- **Enterprise Tier**: Unlimited requests, custom pricing

See [API Tiers Documentation](docs/API_TIERS.md) for complete details.

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
  fidelity: 0.95
});

console.log('Fidelity:', bellPair.fidelity);
console.log('Hardware:', bellPair.hardware); // true = real quantum hardware
```

---

## Features

### 1. Quantum Bridge (Real Hardware Integration)

Connect to real IBM Quantum computers via our production quantum bridge:

```javascript
// Create entangled Bell pairs
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true
});

// Perform CHSH test (Bell inequality)
const chsh = await client.bridge.performCHSH({
  measurements: 1000,
  backend: 'ibm_brisbane'
});
console.log('CHSH value:', chsh.chsh_value); // > 2.0 violates classical

// List available quantum backends
const backends = await client.bridge.listBackends();
```

### 2. Q-HAL (Hardware Abstraction Layer)

Unified interface for multi-vendor quantum devices:

```javascript
// Register quantum device
await client.qhal.registerDevice({
  type: 'photonic',
  id: 'photonic-lab-01',
  capabilities: ['bell_pair', 'qkd', 'entanglement_swapping']
});

// List available devices
const devices = await client.qhal.listDevices();

// Execute operation on specific device
const result = await client.qhal.executeOperation(
  'ibm_brisbane',
  'create_bell_pair',
  { fidelity_target: 0.95 }
);
```

### 3. Quantum Key Distribution (All Protocols)

#### BB84 (Optimized Implementation)

```javascript
const bb84 = await client.protocols.bb84.execute({
  nQubits: 100,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});
console.log('Secure key:', bb84.secure_key_length, 'bits');
```

#### E91 (Fixed CHSH Calculation)

```javascript
const e91 = await client.protocols.e91.execute({
  nPairs: 100,
  useRealHardware: true
});
console.log('CHSH:', e91.chsh_value); // Correctly ~2.828 for perfect Bell states
console.log('Key:', e91.secure_key_length, 'bits');
```

#### SARG04 (PNS Attack Resistant)

```javascript
const sarg04 = await client.protocols.sarg04.execute({
  nQubits: 100,
  useRealHardware: false
});
```

#### BBM92 (Entanglement-Based)

```javascript
const bbm92 = await client.protocols.bbm92.execute({
  nPairs: 100,
  useRealHardware: false
});
```

### 4. Quantum Ratchet (E2E Encryption)

QKD-enhanced forward-secure encryption:

```javascript
// Initialize encrypted session
const session = await client.ratchet.initialize({
  peerId: 'alice',
  qkdProtocol: 'bb84',
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

### 5. SSC Economics (Carbon Credits)

Token minting based on energy savings and carbon offsets:

```javascript
// Mint SSC tokens
const minted = await client.ssc.mint({
  amount: 100,
  energySaved: 1.5,  // kWh
  carbonReduced: 0.75,  // kg CO₂
  operationType: 'quantum_entanglement'
});

// Check balance
const balance = await client.ssc.getBalance(address);
console.log('Balance:', balance.ssc, 'SSC');
console.log('Carbon credits:', balance.carbon_credits, 'kg CO₂');

// Transfer tokens
await client.ssc.transfer({
  from: addressA,
  to: addressB,
  amount: 50
});
```

### 6. P2P Quantum Network

Decentralized quantum-secured mesh networking:

```javascript
// Connect to peer with QKD
const connection = await client.p2p.connect({
  peerId: 'bob',
  enableQKD: true,
  protocol: 'bb84',
  useRealHardware: true
});

// Send encrypted message
await client.p2p.send({
  destination: 'bob',
  payload: { message: 'Hello quantum world!' },
  useQKD: true,
  encrypt: true
});

// Check connection metrics
const metrics = await client.p2p.getConnectionMetrics(connection.connection_id);
console.log('Latency:', metrics.latency, 'ms');
console.log('QKD sessions:', metrics.qkd_sessions);
```

---

## Examples

See the `examples/` directory for complete working examples:

- `01-quantum-bridge.mjs` - Quantum bridge and real IBM Quantum hardware
- `02-all-protocols.mjs` - All QKD protocols (BB84, E91, SARG04, BBM92)
- `03-quantum-ratchet.mjs` - End-to-end encryption with key rotation
- `04-ssc-economics.mjs` - Token minting and carbon credit system
- `05-full-stack.mjs` - Complete integration of all features
- `06-local-simulation.mjs` - Educational simulations (no API needed)
- `07-complex-quantum-scenario.mjs` - **Complex quantum-secured communication scenario** (14-step workflow)
- `08-free-tier-demo.mjs` - **Free Tier demonstration** (shows rate limits, simulation mode, hardware restrictions)

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
npm run example:free-tier

# Local simulation (no API key needed)
npm run example:local
```

---

## API Access

### Free Tier
- 100 requests/day
- Simulation mode only
- All protocols available
- Educational use

### Pro Tier ($99/month)
- 10,000 requests/day
- **Real quantum hardware access**
- All features
- Email support

### Enterprise (Custom Pricing)
- Unlimited requests
- Dedicated hardware access
- Custom integration
- 24/7 support
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
├── src/
│   ├── client/
│   │   ├── QuantumInternetClient.mjs  # Main client
│   │   ├── hardware/                   # Bridge & Q-HAL clients
│   │   ├── protocols/                  # QKD protocol clients
│   │   ├── security/                   # Quantum Ratchet client
│   │   ├── economics/                  # SSC client
│   │   └── network/                    # P2P client
│   └── types/                          # TypeScript definitions
└── examples/                           # Working examples
```

### Backend Infrastructure (Private)

All quantum operations run on our production backend:

```
quantum-internet-api.sparsesupernova.workers.dev/v1/
├── /quantum/bridge/          # Quantum bridge endpoints
├── /quantum/qhal/            # Q-HAL endpoints
├── /quantum/protocols/       # QKD protocol endpoints
├── /quantum/ratchet/         # Quantum Ratchet endpoints
├── /quantum/ssc/             # SSC economics endpoints
└── /quantum/p2p/             # P2P network endpoints
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

Apache 2.0 - See [LICENSE](./LICENSE) for details.

---

## Links

- **Website:** https://sparse-supernova.com
- **API Documentation:** [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | [docs/BACKEND_API.md](docs/BACKEND_API.md) | [docs/API_TIERS.md](docs/API_TIERS.md)
- **Get API Key:** operations@sparse-supernova.com
- **GitHub:** https://github.com/sparse-supernova/quantum-internet-foundation
- **npm:** https://www.npmjs.com/package/@quantum-internet/foundation
- **Support:** operations@sparse-supernova.com

---

## Testing

Run the test suite:

```bash
# Basic tests
npm test

# All tests
npm run test:all

# Free Tier smoke test (verifies tier restrictions and rate limits)
npm run test:free-tier
```

## Educational Use

This package includes basic local simulations for educational purposes (see `examples/06-local-simulation.mjs`). These are simplified implementations for learning quantum networking concepts.

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
- 24/7 monitoring
- SLA guarantees (Enterprise)

---

## Support

- **Email:** operations@sparse-supernova.com
- **Documentation:** See [docs/](docs/) folder for complete API documentation

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
