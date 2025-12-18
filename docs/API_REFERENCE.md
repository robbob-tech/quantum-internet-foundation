# Quantum Internet Foundation - API Reference

Complete API documentation for the Quantum Internet Foundation client library.

**Version:** 1.0.0  
**Base URL:** `https://api.quantuminternet.dev/v1`

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Client Configuration](#client-configuration)
4. [Quantum Bridge API](#quantum-bridge-api)
5. [Q-HAL API](#q-hal-api)
6. [QKD Protocols API](#qkd-protocols-api)
7. [Quantum Ratchet API](#quantum-ratchet-api)
8. [SSC Economics API](#ssc-economics-api)
9. [P2P Network API](#p2p-network-api)
10. [Error Handling](#error-handling)
11. [Rate Limits](#rate-limits)
12. [TypeScript Support](#typescript-support)
13. [Examples](#examples)

---

## Getting Started

### Installation

```bash
npm install @quantum-internet/foundation
```

### Basic Usage

```javascript
import { QuantumInternetClient } from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  apiKey: process.env.QUANTUM_INTERNET_API_KEY
});

// Test connection
const status = await client.ping();
console.log('API Status:', status);
```

---

## Authentication

All API requests require authentication via an API key.

### Setting API Key

**Option 1: Environment Variable (Recommended)**
```bash
export QUANTUM_INTERNET_API_KEY="sk_your_api_key_here"
```

**Option 2: Constructor Parameter**
```javascript
const client = new QuantumInternetClient({
  apiKey: 'sk_your_api_key_here'
});
```

### API Key Format

API keys follow the format: `sk_...` for standard keys, or `pk_...` for public keys (read-only).

**Get your API key:** operations@sparse-supernova.com

---

## Client Configuration

### Constructor Options

```typescript
interface QuantumInternetClientConfig {
  apiKey?: string;           // API key (or use QUANTUM_INTERNET_API_KEY env var)
  baseUrl?: string;          // Base API URL (default: https://api.quantuminternet.dev/v1)
  timeout?: number;          // Request timeout in ms (default: 30000)
  debug?: boolean;           // Enable debug logging (default: false)
  skipAuth?: boolean;        // Skip authentication (for testing only)
}
```

### Example Configuration

```javascript
const client = new QuantumInternetClient({
  apiKey: 'sk_...',
  baseUrl: 'https://api.quantuminternet.dev/v1',
  timeout: 60000,  // 60 seconds
  debug: true      // Log all requests/responses
});
```

---

## Quantum Bridge API

The Quantum Bridge provides access to real IBM Quantum hardware and quantum operations.

### `client.bridge.createBellPair(options)`

Create an entangled Bell pair on quantum hardware.

**Parameters:**
```typescript
interface BellPairOptions {
  backend?: string;          // Quantum backend name (default: 'ibm_brisbane')
  useRealHardware?: boolean; // Use real hardware vs simulator (default: false)
  fidelity?: number;         // Target fidelity 0-1 (default: 0.95)
  shots?: number;           // Number of measurement shots (default: 1024)
}
```

**Returns:**
```typescript
interface BellPairResult {
  fidelity: number;                    // Achieved fidelity
  measurements: Record<string, number>; // Measurement counts (e.g., {"00": 510, "11": 514})
  backend: string;                     // Backend used
  hardware: boolean;                    // true if real hardware was used
  timestamp: string;                    // ISO 8601 timestamp
  queue_time?: number;                  // Queue wait time in seconds
}
```

**Example:**
```javascript
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true,
  fidelity: 0.95,
  shots: 1024
});

console.log(`Fidelity: ${bellPair.fidelity}`);
console.log(`Hardware: ${bellPair.hardware ? 'Real' : 'Simulator'}`);
```

---

### `client.bridge.performCHSH(options)`

Perform CHSH test (Bell inequality violation test).

**Parameters:**
```typescript
interface CHSHOptions {
  measurements?: number;     // Number of measurements (default: 1000)
  backend?: string;          // Quantum backend name
  useRealHardware?: boolean; // Use real hardware
}
```

**Returns:**
```typescript
interface CHSHResult {
  chsh_value: number;              // CHSH value (classical ≤ 2, quantum ≤ 2√2 ≈ 2.828)
  violates_classical: boolean;     // true if CHSH > 2.0
  correlations: {
    E_ab: number;                  // Correlation E(a,b)
    E_ab_prime: number;            // Correlation E(a,b')
    E_a_prime_b: number;           // Correlation E(a',b)
    E_a_prime_b_prime: number;      // Correlation E(a',b')
  };
  backend: string;
  timestamp?: string;
}
```

**Example:**
```javascript
const chsh = await client.bridge.performCHSH({
  measurements: 1000,
  backend: 'ibm_brisbane',
  useRealHardware: true
});

console.log(`CHSH Value: ${chsh.chsh_value}`);
console.log(`Violates Classical: ${chsh.violates_classical}`);
```

---

### `client.bridge.executeCircuit(options)`

Execute arbitrary quantum circuit on backend.

**Parameters:**
```typescript
interface CircuitOptions {
  circuit: Array<any>;       // Quantum circuit definition
  backend?: string;          // Quantum backend name
  shots?: number;            // Number of shots (default: 1024)
  useRealHardware?: boolean; // Use real hardware
}
```

**Returns:**
```typescript
{
  results: Record<string, number>; // Measurement results
  backend: string;
  execution_time: number;          // Execution time in seconds
  hardware: boolean;
}
```

---

### `client.bridge.listBackends()`

List all available quantum backends.

**Returns:**
```typescript
{
  backends: Array<{
    name: string;           // Backend name
    qubits: number;         // Number of qubits
    status: string;         // 'online' | 'offline' | 'maintenance'
    queue_length: number;    // Current queue length
    quantum_volume: number;  // Quantum volume metric
  }>;
}
```

**Example:**
```javascript
const backends = await client.bridge.listBackends();
backends.backends.forEach(backend => {
  console.log(`${backend.name}: ${backend.qubits} qubits, ${backend.status}`);
});
```

---

### `client.bridge.getBackendInfo(backendName)`

Get detailed information about a specific backend.

**Parameters:**
- `backendName` (string): Name of the backend

**Returns:**
```typescript
{
  name: string;
  qubits: number;
  quantum_volume: number;
  clops: number;            // Circuit Layer Operations Per Second
  status: string;
  capabilities: string[];    // e.g., ['bell_pair', 'qkd', 'chsh']
  connectivity?: object;     // Qubit connectivity graph
}
```

---

### `client.bridge.status()`

Get quantum bridge system status.

**Returns:**
```typescript
{
  status: string;            // 'operational' | 'degraded' | 'offline'
  backends_connected: number;
  uptime: string;            // e.g., "72h 15m"
  requests_today: number;
}
```

---

### `client.bridge.health()`

Get quantum bridge health metrics.

**Returns:**
```typescript
{
  status: string;
  backends: Array<{
    name: string;
    status: string;
    queue_length: number;
    avg_wait_time: number;
  }>;
  system_metrics: {
    cpu_usage: number;
    memory_usage: number;
    request_rate: number;
  };
}
```

---

## Q-HAL API

Q-HAL (Quantum Hardware Abstraction Layer) provides unified access to multi-vendor quantum devices.

### `client.qhal.registerDevice(deviceConfig)`

Register a quantum device with Q-HAL.

**Parameters:**
```typescript
interface DeviceConfig {
  type: string;              // 'photonic' | 'nv_center' | 'superconducting' | 'repeater'
  id: string;                // Unique device identifier
  capabilities: string[];    // e.g., ['bell_pair', 'qkd', 'entanglement_swapping']
  metadata?: Record<string, any>;
}
```

**Returns:**
```typescript
{
  device_id: string;
  registered: boolean;
  timestamp: string;
}
```

---

### `client.qhal.listDevices(filter)`

List available quantum devices.

**Parameters:**
```typescript
interface DeviceFilter {
  type?: string;             // Filter by device type
  status?: string;           // Filter by status
  capability?: string;       // Filter by capability
}
```

**Returns:**
```typescript
{
  devices: Array<{
    id: string;
    type: string;
    status: string;          // 'online' | 'offline' | 'calibrating'
    qubits?: number;
    capabilities: string[];
    last_seen: string;
  }>;
}
```

---

### `client.qhal.getDevice(deviceId)`

Get detailed information about a specific device.

**Parameters:**
- `deviceId` (string): Device identifier

**Returns:**
```typescript
{
  id: string;
  type: string;
  status: string;
  capabilities: string[];
  metrics: {
    fidelity: number;
    uptime: number;           // Uptime in seconds
    operations_count: number;
  };
  configuration: Record<string, any>;
}
```

---

### `client.qhal.executeOperation(deviceId, operation, params)`

Execute an operation on a specific device.

**Parameters:**
- `deviceId` (string): Device identifier
- `operation` (string): Operation name (e.g., 'create_bell_pair', 'qkd', 'entanglement_swapping')
- `params` (object): Operation-specific parameters

**Returns:**
```typescript
{
  result: any;                // Operation-specific result
  device_id: string;
  operation: string;
  execution_time: number;    // Execution time in seconds
  success: boolean;
}
```

**Example:**
```javascript
const result = await client.qhal.executeOperation(
  'ibm_brisbane',
  'create_bell_pair',
  { fidelity_target: 0.95 }
);
```

---

### `client.qhal.getDeviceMetrics(deviceId, options)`

Get device performance metrics.

**Parameters:**
- `deviceId` (string): Device identifier
- `options` (object): Optional query parameters
  - `timeframe?: string` - '1h' | '24h' | '7d' | '30d'
  - `metric?: string` - Specific metric to retrieve

**Returns:**
```typescript
{
  device_id: string;
  metrics: {
    fidelity: number;
    uptime: number;
    operations_count: number;
    error_rate: number;
    avg_execution_time: number;
  };
  time_series?: Array<{
    timestamp: string;
    value: number;
  }>;
}
```

---

### `client.qhal.getDeviceErrors(deviceId, limit)`

Get device error log.

**Parameters:**
- `deviceId` (string): Device identifier
- `limit` (number): Number of recent errors to retrieve (default: 10)

**Returns:**
```typescript
{
  errors: Array<{
    timestamp: string;
    error_type: string;
    message: string;
    operation?: string;
  }>;
}
```

---

### `client.qhal.calibrateDevice(deviceId, calibrationParams)`

Calibrate a quantum device.

**Parameters:**
- `deviceId` (string): Device identifier
- `calibrationParams` (object): Calibration parameters

**Returns:**
```typescript
{
  device_id: string;
  calibration_status: string;  // 'success' | 'failed' | 'partial'
  metrics_before: Record<string, number>;
  metrics_after: Record<string, number>;
  timestamp: string;
}
```

---

### `client.qhal.status()`

Get Q-HAL system status.

**Returns:**
```typescript
{
  status: string;
  devices_registered: number;
  devices_online: number;
  total_operations: number;
}
```

---

## QKD Protocols API

Quantum Key Distribution protocols for secure key exchange.

### BB84 Protocol

#### `client.protocols.bb84.execute(options)`

Execute BB84 QKD protocol.

**Parameters:**
```typescript
interface BB84Options {
  nQubits?: number;              // Number of qubits (default: 100)
  errorThreshold?: number;        // Error rate threshold (default: 0.11)
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;               // Quantum backend name
  privacyAmplification?: boolean; // Apply privacy amplification (default: true)
  errorCorrection?: boolean;      // Apply error correction (default: true)
  authenticatedChannel?: boolean; // Use authenticated channel (default: true)
}
```

**Returns:**
```typescript
interface BB84Result {
  secure_key_length: number;      // Final secure key length in bits
  raw_key_length: number;         // Raw key length before processing
  error_rate: number;             // Detected error rate
  session_id: string;             // Session identifier
  backend: string;
  timestamp: string;
  privacy_amplified: boolean;
  error_corrected: boolean;
}
```

**Example:**
```javascript
const bb84 = await client.protocols.bb84.execute({
  nQubits: 100,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});

console.log(`Secure Key: ${bb84.secure_key_length} bits`);
console.log(`Error Rate: ${bb84.error_rate}`);
```

---

#### `client.protocols.bb84.getKeyStatistics(sessionId)`

Get BB84 session key statistics.

**Parameters:**
- `sessionId` (string): BB84 session identifier

**Returns:**
```typescript
{
  session_id: string;
  secure_key_length: number;
  error_rate: number;
  privacy_amplification_applied: boolean;
  error_correction_applied: boolean;
  timestamp: string;
}
```

---

#### `client.protocols.bb84.validateSecurity(sessionId)`

Validate BB84 session security.

**Parameters:**
- `sessionId` (string): BB84 session identifier

**Returns:**
```typescript
{
  session_id: string;
  secure: boolean;
  security_level: string;         // 'high' | 'medium' | 'low' | 'compromised'
  error_rate: number;
  eavesdropper_detected: boolean;
  recommendations: string[];
}
```

---

### E91 Protocol

#### `client.protocols.e91.execute(options)`

Execute E91 QKD protocol (entanglement-based with CHSH test).

**Parameters:**
```typescript
interface E91Options {
  nPairs?: number;                // Number of entangled pairs (default: 100)
  chshThreshold?: number;          // CHSH threshold (default: 2.0)
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;                // Quantum backend name
  eavesdropperDetection?: boolean; // Enable eavesdropper detection (default: true)
}
```

**Returns:**
```typescript
interface E91Result {
  secure_key_length: number;      // Final secure key length
  chsh_value: number;              // CHSH test value
  error_rate: number;
  session_id: string;
  entanglement_verified: boolean; // true if CHSH > threshold
}
```

**Example:**
```javascript
const e91 = await client.protocols.e91.execute({
  nPairs: 100,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});

console.log(`CHSH Value: ${e91.chsh_value}`);
console.log(`Entanglement Verified: ${e91.entanglement_verified}`);
console.log(`Secure Key: ${e91.secure_key_length} bits`);
```

---

#### `client.protocols.e91.getCHSHStatistics(sessionId)`

Get E91 CHSH test statistics.

**Parameters:**
- `sessionId` (string): E91 session identifier

**Returns:**
```typescript
{
  session_id: string;
  chsh_value: number;
  correlations: {
    E_ab: number;
    E_ab_prime: number;
    E_a_prime_b: number;
    E_a_prime_b_prime: number;
  };
  violates_classical: boolean;
}
```

---

#### `client.protocols.e91.validateEntanglement(sessionId)`

Validate entanglement in E91 session.

**Parameters:**
- `sessionId` (string): E91 session identifier

**Returns:**
```typescript
{
  session_id: string;
  entanglement_verified: boolean;
  chsh_value: number;
  security_level: string;
}
```

---

### SARG04 Protocol

#### `client.protocols.sarg04.execute(options)`

Execute SARG04 QKD protocol (PNS attack resistant).

**Parameters:**
```typescript
interface SARG04Options {
  nQubits?: number;               // Number of qubits
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;                // Quantum backend name
  privacyAmplification?: boolean; // Apply privacy amplification
  errorCorrection?: boolean;       // Apply error correction
}
```

**Returns:**
```typescript
{
  secure_key_length: number;
  raw_key_length: number;
  error_rate: number;
  session_id: string;
  backend: string;
  timestamp: string;
}
```

---

#### `client.protocols.sarg04.getKeyStatistics(sessionId)`

Get SARG04 session statistics.

**Parameters:**
- `sessionId` (string): SARG04 session identifier

**Returns:**
```typescript
{
  session_id: string;
  secure_key_length: number;
  error_rate: number;
  pns_resistant: boolean;
}
```

---

### BBM92 Protocol

#### `client.protocols.bbm92.execute(options)`

Execute BBM92 QKD protocol (entanglement-based).

**Parameters:**
```typescript
interface BBM92Options {
  nPairs?: number;                // Number of entangled pairs
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;                // Quantum backend name
  basisReconciliation?: boolean;  // Apply basis reconciliation
  privacyAmplification?: boolean; // Apply privacy amplification
}
```

**Returns:**
```typescript
{
  secure_key_length: number;
  raw_key_length: number;
  error_rate: number;
  session_id: string;
  entanglement_verified: boolean;
  timestamp: string;
}
```

---

#### `client.protocols.bbm92.getKeyStatistics(sessionId)`

Get BBM92 session statistics.

**Parameters:**
- `sessionId` (string): BBM92 session identifier

**Returns:**
```typescript
{
  session_id: string;
  secure_key_length: number;
  error_rate: number;
  entanglement_verified: boolean;
}
```

---

#### `client.protocols.bbm92.validateEntanglement(sessionId)`

Validate entanglement in BBM92 session.

**Parameters:**
- `sessionId` (string): BBM92 session identifier

**Returns:**
```typescript
{
  session_id: string;
  entanglement_verified: boolean;
  security_level: string;
}
```

---

## Quantum Ratchet API

Quantum Ratchet provides QKD-enhanced forward-secure encryption.

### `client.ratchet.initialize(options)`

Initialize a Quantum Ratchet session.

**Parameters:**
```typescript
interface QuantumRatchetInitOptions {
  peerId: string;                 // Peer identifier (required)
  qkdProtocol?: string;           // QKD protocol: 'bb84' | 'e91' | 'sarg04' | 'bbm92' (default: 'bb84')
  useRealHardware?: boolean;      // Use real quantum hardware for QKD
  backend?: string;                // Quantum backend name
  keyRefreshInterval?: number;    // Key refresh interval in messages (default: 100)
}
```

**Returns:**
```typescript
interface QuantumRatchetSession {
  session_id: string;             // Session identifier
  peer_id: string;
  protocol: string;                // QKD protocol used
  created_at: string;              // ISO 8601 timestamp
  key_refresh_interval: number;
}
```

**Example:**
```javascript
const session = await client.ratchet.initialize({
  peerId: 'alice',
  qkdProtocol: 'bb84',
  useRealHardware: true,
  backend: 'ibm_brisbane'
});

console.log(`Session ID: ${session.session_id}`);
```

---

### `client.ratchet.encrypt(sessionId, message)`

Encrypt a message using Quantum Ratchet.

**Parameters:**
- `sessionId` (string): Ratchet session identifier
- `message` (string | object): Message to encrypt

**Returns:**
```typescript
{
  ciphertext: string;             // Encrypted message
  key_id: string;                 // Key identifier used
  message_id: string;              // Unique message identifier
  timestamp: string;
}
```

**Example:**
```javascript
const encrypted = await client.ratchet.encrypt(
  session.session_id,
  'Secret quantum message'
);

console.log(`Ciphertext: ${encrypted.ciphertext}`);
```

---

### `client.ratchet.decrypt(sessionId, ciphertext)`

Decrypt a message using Quantum Ratchet.

**Parameters:**
- `sessionId` (string): Ratchet session identifier
- `ciphertext` (string): Encrypted message

**Returns:**
```typescript
{
  message: string;                // Decrypted message
  key_id: string;                 // Key identifier used
  message_id: string;
  timestamp: string;
}
```

**Example:**
```javascript
const decrypted = await client.ratchet.decrypt(
  session.session_id,
  encrypted.ciphertext
);

console.log(`Message: ${decrypted.message}`);
```

---

### `client.ratchet.rotateKeys(sessionId, options)`

Rotate encryption keys (forward security).

**Parameters:**
- `sessionId` (string): Ratchet session identifier
- `options` (object): Optional rotation options
  - `forceQKD?: boolean` - Force new QKD session for key rotation

**Returns:**
```typescript
{
  session_id: string;
  new_key_id: string;
  rotation_type: string;           // 'automatic' | 'qkd_refresh' | 'manual'
  timestamp: string;
}
```

**Example:**
```javascript
await client.ratchet.rotateKeys(session.session_id, {
  forceQKD: true  // Force new QKD session
});
```

---

### `client.ratchet.getSessionStatus(sessionId)`

Get Quantum Ratchet session status.

**Parameters:**
- `sessionId` (string): Ratchet session identifier

**Returns:**
```typescript
{
  session_id: string;
  peer_id: string;
  protocol: string;
  status: string;                 // 'active' | 'paused' | 'terminated'
  messages_encrypted: number;
  messages_decrypted: number;
  current_key_id: string;
  key_age: number;                // Key age in messages
  last_activity: string;
  created_at: string;
}
```

---

### `client.ratchet.terminate(sessionId)`

Terminate a Quantum Ratchet session.

**Parameters:**
- `sessionId` (string): Ratchet session identifier

**Returns:**
```typescript
{
  session_id: string;
  terminated: boolean;
  timestamp: string;
}
```

---

### `client.ratchet.listSessions()`

List all active Quantum Ratchet sessions.

**Returns:**
```typescript
{
  sessions: Array<{
    session_id: string;
    peer_id: string;
    protocol: string;
    status: string;
    created_at: string;
    messages_encrypted: number;
  }>;
}
```

---

## SSC Economics API

SSC (Smart Savings Coin) is a token system for carbon credits and energy savings.

### `client.ssc.mint(options)`

Mint SSC tokens based on energy savings and carbon reduction.

**Parameters:**
```typescript
interface SSCMintOptions {
  amount: number;                 // Amount of SSC to mint (required)
  energySaved: number;            // Energy saved in kWh (required)
  carbonReduced: number;          // Carbon reduced in kg CO₂ (required)
  operationType: string;          // Operation type: 'quantum_entanglement' | 'qkd' | 'quantum_computation' (required)
  recipient?: string;             // Recipient address (optional, defaults to API key owner)
  metadata?: Record<string, any>; // Additional metadata
}
```

**Returns:**
```typescript
interface SSCMintResult {
  tokens: number;                 // Tokens minted
  tx_id: string;                  // Transaction identifier
  timestamp: string;
  carbon_credits: number;         // Carbon credits earned
  energy_saved: number;           // Energy saved (kWh)
}
```

**Example:**
```javascript
const minted = await client.ssc.mint({
  amount: 100,
  energySaved: 1.5,      // kWh
  carbonReduced: 0.75,    // kg CO₂
  operationType: 'quantum_entanglement'
});

console.log(`Minted ${minted.tokens} SSC tokens`);
console.log(`Transaction ID: ${minted.tx_id}`);
```

---

### `client.ssc.getBalance(address)`

Get SSC balance for an address.

**Parameters:**
- `address` (string): Wallet address

**Returns:**
```typescript
{
  address: string;
  ssc: number;                    // SSC token balance
  carbon_credits: number;         // Carbon credits (kg CO₂)
  energy_saved: number;           // Total energy saved (kWh)
  staked: number;                 // Staked SSC tokens
  available: number;              // Available SSC tokens
}
```

**Example:**
```javascript
const balance = await client.ssc.getBalance('wallet_address_here');
console.log(`Balance: ${balance.ssc} SSC`);
console.log(`Carbon Credits: ${balance.carbon_credits} kg CO₂`);
```

---

### `client.ssc.transfer(options)`

Transfer SSC tokens between addresses.

**Parameters:**
```typescript
interface SSCTransferOptions {
  from: string;                   // Sender address (required)
  to: string;                     // Recipient address (required)
  amount: number;                 // Amount to transfer (required)
  memo?: string;                  // Optional memo
}
```

**Returns:**
```typescript
{
  tx_id: string;                  // Transaction identifier
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  status: string;                 // 'pending' | 'confirmed'
}
```

**Example:**
```javascript
const transfer = await client.ssc.transfer({
  from: 'address_a',
  to: 'address_b',
  amount: 50,
  memo: 'Payment for quantum services'
});

console.log(`Transfer ID: ${transfer.tx_id}`);
```

---

### `client.ssc.getTransactionHistory(address, options)`

Get transaction history for an address.

**Parameters:**
- `address` (string): Wallet address
- `options` (object): Query options
  - `limit?: number` - Number of transactions (default: 10)
  - `offset?: number` - Pagination offset (default: 0)

**Returns:**
```typescript
{
  address: string;
  transactions: Array<{
    tx_id: string;
    type: string;                 // 'mint' | 'transfer' | 'stake'
    amount: number;
    from?: string;
    to?: string;
    timestamp: string;
    status: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}
```

---

### `client.ssc.getCarbonStats(address?)`

Get carbon credit statistics.

**Parameters:**
- `address` (string, optional): Wallet address (if omitted, returns global stats)

**Returns:**
```typescript
{
  address?: string;               // Present if address provided
  carbon_credits: number;         // Total carbon credits (kg CO₂)
  energy_saved: number;           // Total energy saved (kWh)
  operations_count: number;       // Number of operations
  equivalent_trees: number;       // Equivalent trees planted
  time_period?: string;           // Time period for stats
}
```

---

### `client.ssc.getExchangeRate(currency)`

Get SSC exchange rate.

**Parameters:**
- `currency` (string): Target currency (default: 'USD')

**Returns:**
```typescript
{
  currency: string;
  rate: number;                   // SSC per unit of currency
  inverse_rate: number;           // Currency per SSC
  timestamp: string;
  market_cap?: number;           // Market capitalization
}
```

---

### `client.ssc.stake(options)`

Stake SSC tokens.

**Parameters:**
```typescript
interface StakeOptions {
  address: string;                 // Staker address
  amount: number;                  // Amount to stake
  duration: number;                 // Staking duration in days (default: 30)
}
```

**Returns:**
```typescript
{
  tx_id: string;
  address: string;
  amount: number;
  duration: number;
  expected_reward: number;        // Expected reward percentage
  unlock_date: string;             // ISO 8601 timestamp
  timestamp: string;
}
```

---

### `client.ssc.getSystemStats()`

Get SSC system-wide statistics.

**Returns:**
```typescript
{
  total_supply: number;           // Total SSC supply
  circulating_supply: number;     // Circulating supply
  total_carbon_credits: number;   // Total carbon credits (kg CO₂)
  total_energy_saved: number;      // Total energy saved (kWh)
  active_addresses: number;       // Number of active addresses
  transactions_count: number;     // Total transactions
  market_stats?: {
    price: number;
    volume_24h: number;
    market_cap: number;
  };
}
```

---

## P2P Network API

P2P quantum-secured mesh networking.

### `client.p2p.connect(options)`

Establish P2P connection with quantum security.

**Parameters:**
```typescript
interface P2PConnectOptions {
  peerId: string;                  // Peer identifier to connect to (required)
  enableQKD?: boolean;            // Enable quantum key distribution (default: false)
  protocol?: string;               // QKD protocol: 'bb84' | 'e91' | 'sarg04' | 'bbm92' (default: 'bb84')
  useRealHardware?: boolean;      // Use real quantum hardware
  backend?: string;                // Quantum backend name
  encryption?: boolean;            // Enable encryption (default: true)
}
```

**Returns:**
```typescript
{
  connection_id: string;          // Connection identifier
  peer_id: string;
  status: string;                  // 'connected' | 'connecting' | 'failed'
  qkd_enabled: boolean;
  protocol?: string;               // QKD protocol used
  encryption_enabled: boolean;
  timestamp: string;
}
```

**Example:**
```javascript
const connection = await client.p2p.connect({
  peerId: 'bob',
  enableQKD: true,
  protocol: 'bb84',
  useRealHardware: true
});

console.log(`Connected: ${connection.connection_id}`);
```

---

### `client.p2p.send(options)`

Send message via P2P network.

**Parameters:**
```typescript
interface P2PSendOptions {
  destination: string;             // Destination peer ID (required)
  payload: any;                    // Message payload (required)
  useQKD?: boolean;               // Use QKD for this message (default: false)
  encrypt?: boolean;               // Encrypt message (default: true)
  priority?: string;               // 'low' | 'normal' | 'high' (default: 'normal')
}
```

**Returns:**
```typescript
{
  atom_id: string;                // Message identifier
  destination: string;
  status: string;                  // 'sent' | 'delivered' | 'failed'
  encrypted: boolean;
  qkd_used: boolean;
  timestamp: string;
}
```

**Example:**
```javascript
const result = await client.p2p.send({
  destination: 'bob',
  payload: { message: 'Hello quantum world!' },
  useQKD: true,
  encrypt: true
});

console.log(`Message ID: ${result.atom_id}`);
```

---

### `client.p2p.receive(nodeId, options)`

Receive messages from P2P network.

**Parameters:**
- `nodeId` (string): Your node identifier
- `options` (object): Receive options
  - `limit?: number` - Number of messages (default: 10)
  - `since?: number` - Timestamp to receive messages since

**Returns:**
```typescript
{
  node_id: string;
  messages: Array<{
    atom_id: string;
    from: string;
    payload: any;
    timestamp: string;
    encrypted: boolean;
    qkd_used: boolean;
  }>;
  count: number;
}
```

---

### `client.p2p.getStatus(nodeId?)`

Get P2P network status.

**Parameters:**
- `nodeId` (string, optional): Node identifier (if omitted, returns global status)

**Returns:**
```typescript
{
  node_id?: string;                // Present if nodeId provided
  status: string;                  // 'online' | 'offline'
  connected_peers: number;
  active_connections: number;
  messages_sent: number;
  messages_received: number;
  qkd_sessions: number;
}
```

---

### `client.p2p.listPeers(nodeId)`

List connected peers for a node.

**Parameters:**
- `nodeId` (string): Your node identifier

**Returns:**
```typescript
{
  node_id: string;
  peers: Array<{
    peer_id: string;
    connection_id: string;
    status: string;
    qkd_enabled: boolean;
    connected_since: string;
  }>;
}
```

---

### `client.p2p.disconnect(connectionId)`

Disconnect from a peer.

**Parameters:**
- `connectionId` (string): Connection identifier

**Returns:**
```typescript
{
  connection_id: string;
  disconnected: boolean;
  timestamp: string;
}
```

---

### `client.p2p.getConnectionMetrics(connectionId)`

Get connection performance metrics.

**Parameters:**
- `connectionId` (string): Connection identifier

**Returns:**
```typescript
{
  connection_id: string;
  latency: number;                // Latency in milliseconds
  throughput: number;             // Throughput in bytes/second
  qkd_sessions: number;           // Number of QKD sessions
  messages_sent: number;
  messages_received: number;
  error_rate: number;              // Error rate (0-1)
  uptime: number;                  // Connection uptime in seconds
}
```

---

### `client.p2p.joinSwarm(options)`

Join a P2P network swarm.

**Parameters:**
```typescript
interface SwarmJoinOptions {
  nodeId: string;                   // Your node identifier (required)
  swarmId: string;                  // Swarm to join (required)
  enableQKD?: boolean;            // Enable QKD for swarm (default: false)
  carbonAware?: boolean;           // Enable carbon-aware routing (default: true)
}
```

**Returns:**
```typescript
{
  node_id: string;
  swarm_id: string;
  joined: boolean;
  peers_count: number;
  qkd_enabled: boolean;
  timestamp: string;
}
```

---

### `client.p2p.leaveSwarm(nodeId, swarmId)`

Leave a P2P network swarm.

**Parameters:**
- `nodeId` (string): Your node identifier
- `swarmId` (string): Swarm to leave

**Returns:**
```typescript
{
  node_id: string;
  swarm_id: string;
  left: boolean;
  timestamp: string;
}
```

---

### `client.p2p.getTopology(swarmId?)`

Get P2P network topology.

**Parameters:**
- `swarmId` (string, optional): Swarm identifier (if omitted, returns global topology)

**Returns:**
```typescript
{
  swarm_id?: string;               // Present if swarmId provided
  nodes: Array<{
    node_id: string;
    connections: string[];          // Connected node IDs
    status: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    latency: number;
    qkd_enabled: boolean;
  }>;
  metrics: {
    total_nodes: number;
    total_connections: number;
    avg_latency: number;
  };
}
```

---

## Error Handling

All API methods throw errors that should be caught and handled appropriately.

### Error Format

```typescript
class QuantumInternetError extends Error {
  message: string;
  code: string;
  statusCode?: number;
  details?: any;
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_API_KEY` | API key invalid or missing | 401 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `BACKEND_UNAVAILABLE` | Quantum backend offline | 503 |
| `INVALID_PARAMETERS` | Invalid request parameters | 400 |
| `HARDWARE_ACCESS_DENIED` | Real hardware not available for your plan | 403 |
| `SESSION_NOT_FOUND` | Session identifier not found | 404 |
| `OPERATION_FAILED` | Quantum operation failed | 500 |
| `NETWORK_ERROR` | Network connection error | - |
| `TIMEOUT` | Request timeout | - |

### Error Handling Example

```javascript
try {
  const bellPair = await client.bridge.createBellPair({
    backend: 'ibm_brisbane',
    useRealHardware: true
  });
} catch (error) {
  if (error.message.includes('INVALID_API_KEY')) {
    console.error('Invalid API key. Please check your credentials.');
  } else if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    console.error('Rate limit exceeded. Please wait before retrying.');
  } else if (error.message.includes('BACKEND_UNAVAILABLE')) {
    console.error('Quantum backend is currently unavailable.');
  } else {
    console.error('Error:', error.message);
  }
}
```

---

## Rate Limits

Rate limits are enforced per API key and vary by subscription tier.

### Rate Limit Tiers

| Tier | Requests/Day | Requests/Hour | Requests/Minute |
|------|--------------|---------------|----------------|
| **Free** | 100 | 10 | 2 |
| **Pro** | 10,000 | 1,000 | 100 |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

### Rate Limit Headers

All API responses include rate limit information in headers:

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9950
X-RateLimit-Reset: 1640000000
```

### Handling Rate Limits

```javascript
try {
  const result = await client.bridge.createBellPair({...});
} catch (error) {
  if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    // Check rate limit headers from last response
    const resetTime = error.details?.resetTime;
    const waitSeconds = Math.ceil((resetTime - Date.now()) / 1000);
    console.log(`Rate limit exceeded. Retry after ${waitSeconds} seconds.`);
  }
}
```

---

## TypeScript Support

The library includes full TypeScript type definitions.

### Installation

TypeScript types are included automatically with the package.

### Usage

```typescript
import { 
  QuantumInternetClient,
  BellPairOptions,
  BellPairResult,
  BB84Options,
  BB84Result
} from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  apiKey: process.env.QUANTUM_INTERNET_API_KEY
});

async function createBellPair(): Promise<BellPairResult> {
  const options: BellPairOptions = {
    backend: 'ibm_brisbane',
    useRealHardware: true,
    fidelity: 0.95
  };
  
  return await client.bridge.createBellPair(options);
}
```

### Type Definitions

All types are exported from `@quantum-internet/foundation`. See `src/types/index.d.ts` for complete type definitions.

---

## Examples

### Complete Example: Quantum Key Distribution

```javascript
import { QuantumInternetClient } from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  apiKey: process.env.QUANTUM_INTERNET_API_KEY
});

async function quantumKeyDistribution() {
  try {
    // 1. Check API status
    const status = await client.status();
    console.log('API Status:', status);

    // 2. List available backends
    const backends = await client.bridge.listBackends();
    console.log('Available backends:', backends.backends);

    // 3. Execute BB84 QKD
    const bb84 = await client.protocols.bb84.execute({
      nQubits: 100,
      useRealHardware: true,
      backend: 'ibm_brisbane'
    });

    console.log(`Secure Key Length: ${bb84.secure_key_length} bits`);
    console.log(`Error Rate: ${bb84.error_rate}`);
    console.log(`Session ID: ${bb84.session_id}`);

    // 4. Validate security
    const validation = await client.protocols.bb84.validateSecurity(bb84.session_id);
    console.log(`Security Level: ${validation.security_level}`);
    console.log(`Secure: ${validation.secure}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

quantumKeyDistribution();
```

### Example: Quantum Ratchet Encryption

```javascript
async function quantumEncryption() {
  // 1. Initialize Quantum Ratchet session
  const session = await client.ratchet.initialize({
    peerId: 'alice',
    qkdProtocol: 'bb84',
    useRealHardware: true
  });

  // 2. Encrypt message
  const encrypted = await client.ratchet.encrypt(
    session.session_id,
    'Secret quantum message'
  );

  // 3. Decrypt message
  const decrypted = await client.ratchet.decrypt(
    session.session_id,
    encrypted.ciphertext
  );

  console.log('Original:', 'Secret quantum message');
  console.log('Decrypted:', decrypted.message);

  // 4. Rotate keys for forward security
  await client.ratchet.rotateKeys(session.session_id);
}
```

### Example: SSC Token Minting

```javascript
async function mintTokens() {
  // Perform quantum operation
  const bellPair = await client.bridge.createBellPair({
    useRealHardware: true
  });

  // Calculate energy savings (example)
  const energySaved = 0.5; // kWh
  const carbonReduced = 0.25; // kg CO₂

  // Mint SSC tokens
  const minted = await client.ssc.mint({
    amount: 50,
    energySaved,
    carbonReduced,
    operationType: 'quantum_entanglement'
  });

  console.log(`Minted ${minted.tokens} SSC tokens`);
  console.log(`Transaction ID: ${minted.tx_id}`);

  // Check balance
  const balance = await client.ssc.getBalance('your_address');
  console.log(`Total Balance: ${balance.ssc} SSC`);
  console.log(`Carbon Credits: ${balance.carbon_credits} kg CO₂`);
}
```

### Example: P2P Quantum Network

```javascript
async function p2pNetwork() {
  // 1. Connect to peer with QKD
  const connection = await client.p2p.connect({
    peerId: 'bob',
    enableQKD: true,
    protocol: 'bb84',
    useRealHardware: true
  });

  console.log(`Connected: ${connection.connection_id}`);

  // 2. Send encrypted message
  const sent = await client.p2p.send({
    destination: 'bob',
    payload: { message: 'Hello quantum world!' },
    useQKD: true,
    encrypt: true
  });

  console.log(`Message sent: ${sent.atom_id}`);

  // 3. Get connection metrics
  const metrics = await client.p2p.getConnectionMetrics(connection.connection_id);
  console.log(`Latency: ${metrics.latency}ms`);
  console.log(`QKD Sessions: ${metrics.qkd_sessions}`);
}
```

---

## Additional Resources

- **GitHub Repository:** https://github.com/sparse-supernova
- **Backend API Specification:** [BACKEND_API.md](./BACKEND_API.md)
- **Examples Directory:** [../examples/](../examples/)
- **TypeScript Types:** [../src/types/index.d.ts](../src/types/index.d.ts)
- **Website:** https://sparse-supernova.com
- **Support:** operations@sparse-supernova.com

---

**Last Updated:** 2025-12-18  
**API Version:** 1.0.0

