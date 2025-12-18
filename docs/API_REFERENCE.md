# Quantum Internet Foundation - API Reference

Complete API documentation for the Quantum Internet Foundation client library.

**Version:** .0.0  
**Base URL:** `https://quantum-internet-api.sparsesupernova.workers.dev/v`

---

## Table of Contents

. [Getting Started](#getting-started)
. [Authentication](#authentication)
. [Client Configuration](#client-configuration)
. [Quantum Bridge API](#quantum-bridge-api)
. [Q-HAL API](#q-hal-api)
. [QKD Protocols API](#qkd-protocols-api)
7. [Quantum Ratchet API](#quantum-ratchet-api)
8. [SSC Economics API](#ssc-economics-api)
9. [PP Network API](#pp-network-api)
0. [Error Handling](#error-handling)
. [Rate Limits](#rate-limits)
. [TypeScript Support](#typescript-support)
. [Examples](#examples)

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

**Option : Environment Variable (Recommended)**
```bash
export QUANTUM_INTERNET_API_KEY="sk_your_api_key_here"
```

**Option : Constructor Parameter**
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
  baseUrl?: string;          // Base API URL (default: https://quantum-internet-api.sparsesupernova.workers.dev/v)
  timeout?: number;          // Request timeout in ms (default: 0000)
  debug?: boolean;           // Enable debug logging (default: false)
  skipAuth?: boolean;        // Skip authentication (for testing only)
}
```

### Example Configuration

```javascript
const client = new QuantumInternetClient({
  apiKey: 'sk_...',
    baseUrl: 'https://quantum-internet-api.sparsesupernova.workers.dev/v',
  timeout: 0000,  // 0 seconds
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
  fidelity?: number;         // Target fidelity 0- (default: 0.9)
  shots?: number;           // Number of measurement shots (default: 0)
}
```

**Returns:**
```typescript
interface BellPairResult {
  fidelity: number;                    // Achieved fidelity
  measurements: Record<string, number>; // Measurement counts (e.g., {"00": 0, "": })
  backend: string;                     // Backend used
  hardware: boolean;                    // true if real hardware was used
  timestamp: string;                    // ISO 80 timestamp
  queue_time?: number;                  // Queue wait time in seconds
}
```

**Example:**
```javascript
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true,
  fidelity: 0.9,
  shots: 0
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
  measurements?: number;     // Number of measurements (default: 000)
  backend?: string;          // Quantum backend name
  useRealHardware?: boolean; // Use real hardware
}
```

**Returns:**
```typescript
interface CHSHResult {
  chsh_value: number;              // CHSH value (classical  , quantum    .88)
  violates_classical: boolean;     // true if CHSH > .0
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
  measurements: 000,
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
  shots?: number;            // Number of shots (default: 0)
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
  uptime: string;            // e.g., "7h m"
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
  { fidelity_target: 0.9 }
);
```

---

### `client.qhal.getDeviceMetrics(deviceId, options)`

Get device performance metrics.

**Parameters:**
- `deviceId` (string): Device identifier
- `options` (object): Optional query parameters
  - `timeframe?: string` - 'h' | 'h' | '7d' | '0d'
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
- `limit` (number): Number of recent errors to retrieve (default: 0)

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

### BB8 Protocol

#### `client.protocols.bb8.execute(options)`

Execute BB8 QKD protocol.

**Parameters:**
```typescript
interface BB8Options {
  nQubits?: number;              // Number of qubits (default: 00)
  errorThreshold?: number;        // Error rate threshold (default: 0.)
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;               // Quantum backend name
  privacyAmplification?: boolean; // Apply privacy amplification (default: true)
  errorCorrection?: boolean;      // Apply error correction (default: true)
  authenticatedChannel?: boolean; // Use authenticated channel (default: true)
}
```

**Returns:**
```typescript
interface BB8Result {
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
const bb8 = await client.protocols.bb8.execute({
  nQubits: 00,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});

console.log(`Secure Key: ${bb8.secure_key_length} bits`);
console.log(`Error Rate: ${bb8.error_rate}`);
```

---

#### `client.protocols.bb8.getKeyStatistics(sessionId)`

Get BB8 session key statistics.

**Parameters:**
- `sessionId` (string): BB8 session identifier

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

#### `client.protocols.bb8.validateSecurity(sessionId)`

Validate BB8 session security.

**Parameters:**
- `sessionId` (string): BB8 session identifier

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

### E9 Protocol

#### `client.protocols.e9.execute(options)`

Execute E9 QKD protocol (entanglement-based with CHSH test).

**Parameters:**
```typescript
interface E9Options {
  nPairs?: number;                // Number of entangled pairs (default: 00)
  chshThreshold?: number;          // CHSH threshold (default: .0)
  useRealHardware?: boolean;      // Use real hardware
  backend?: string;                // Quantum backend name
  eavesdropperDetection?: boolean; // Enable eavesdropper detection (default: true)
}
```

**Returns:**
```typescript
interface E9Result {
  secure_key_length: number;      // Final secure key length
  chsh_value: number;              // CHSH test value
  error_rate: number;
  session_id: string;
  entanglement_verified: boolean; // true if CHSH > threshold
}
```

**Example:**
```javascript
const e9 = await client.protocols.e9.execute({
  nPairs: 00,
  useRealHardware: true,
  backend: 'ibm_brisbane'
});

console.log(`CHSH Value: ${e9.chsh_value}`);
console.log(`Entanglement Verified: ${e9.entanglement_verified}`);
console.log(`Secure Key: ${e9.secure_key_length} bits`);
```

---

#### `client.protocols.e9.getCHSHStatistics(sessionId)`

Get E9 CHSH test statistics.

**Parameters:**
- `sessionId` (string): E9 session identifier

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

#### `client.protocols.e9.validateEntanglement(sessionId)`

Validate entanglement in E9 session.

**Parameters:**
- `sessionId` (string): E9 session identifier

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

### SARG0 Protocol

#### `client.protocols.sarg0.execute(options)`

Execute SARG0 QKD protocol (PNS attack resistant).

**Parameters:**
```typescript
interface SARG0Options {
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

#### `client.protocols.sarg0.getKeyStatistics(sessionId)`

Get SARG0 session statistics.

**Parameters:**
- `sessionId` (string): SARG0 session identifier

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

### BBM9 Protocol

#### `client.protocols.bbm9.execute(options)`

Execute BBM9 QKD protocol (entanglement-based).

**Parameters:**
```typescript
interface BBM9Options {
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

#### `client.protocols.bbm9.getKeyStatistics(sessionId)`

Get BBM9 session statistics.

**Parameters:**
- `sessionId` (string): BBM9 session identifier

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

#### `client.protocols.bbm9.validateEntanglement(sessionId)`

Validate entanglement in BBM9 session.

**Parameters:**
- `sessionId` (string): BBM9 session identifier

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
  qkdProtocol?: string;           // QKD protocol: 'bb8' | 'e9' | 'sarg0' | 'bbm9' (default: 'bb8')
  useRealHardware?: boolean;      // Use real quantum hardware for QKD
  backend?: string;                // Quantum backend name
  keyRefreshInterval?: number;    // Key refresh interval in messages (default: 00)
}
```

**Returns:**
```typescript
interface QuantumRatchetSession {
  session_id: string;             // Session identifier
  peer_id: string;
  protocol: string;                // QKD protocol used
  created_at: string;              // ISO 80 timestamp
  key_refresh_interval: number;
}
```

**Example:**
```javascript
const session = await client.ratchet.initialize({
  peerId: 'alice',
  qkdProtocol: 'bb8',
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
  carbonReduced: number;          // Carbon reduced in kg CO‚‚ (required)
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
  amount: 00,
  energySaved: .,      // kWh
  carbonReduced: 0.7,    // kg CO‚‚
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
  carbon_credits: number;         // Carbon credits (kg CO‚‚)
  energy_saved: number;           // Total energy saved (kWh)
  staked: number;                 // Staked SSC tokens
  available: number;              // Available SSC tokens
}
```

**Example:**
```javascript
const balance = await client.ssc.getBalance('wallet_address_here');
console.log(`Balance: ${balance.ssc} SSC`);
console.log(`Carbon Credits: ${balance.carbon_credits} kg CO‚‚`);
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
  amount: 0,
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
  - `limit?: number` - Number of transactions (default: 0)
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
  carbon_credits: number;         // Total carbon credits (kg CO‚‚)
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
  duration: number;                 // Staking duration in days (default: 0)
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
  unlock_date: string;             // ISO 80 timestamp
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
  total_carbon_credits: number;   // Total carbon credits (kg CO‚‚)
  total_energy_saved: number;      // Total energy saved (kWh)
  active_addresses: number;       // Number of active addresses
  transactions_count: number;     // Total transactions
  market_stats?: {
    price: number;
    volume_h: number;
    market_cap: number;
  };
}
```

---

## PP Network API

PP quantum-secured mesh networking.

### `client.pp.connect(options)`

Establish PP connection with quantum security.

**Parameters:**
```typescript
interface PPConnectOptions {
  peerId: string;                  // Peer identifier to connect to (required)
  enableQKD?: boolean;            // Enable quantum key distribution (default: false)
  protocol?: string;               // QKD protocol: 'bb8' | 'e9' | 'sarg0' | 'bbm9' (default: 'bb8')
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
const connection = await client.pp.connect({
  peerId: 'bob',
  enableQKD: true,
  protocol: 'bb8',
  useRealHardware: true
});

console.log(`Connected: ${connection.connection_id}`);
```

---

### `client.pp.send(options)`

Send message via PP network.

**Parameters:**
```typescript
interface PPSendOptions {
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
const result = await client.pp.send({
  destination: 'bob',
  payload: { message: 'Hello quantum world!' },
  useQKD: true,
  encrypt: true
});

console.log(`Message ID: ${result.atom_id}`);
```

---

### `client.pp.receive(nodeId, options)`

Receive messages from PP network.

**Parameters:**
- `nodeId` (string): Your node identifier
- `options` (object): Receive options
  - `limit?: number` - Number of messages (default: 0)
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

### `client.pp.getStatus(nodeId?)`

Get PP network status.

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

### `client.pp.listPeers(nodeId)`

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

### `client.pp.disconnect(connectionId)`

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

### `client.pp.getConnectionMetrics(connectionId)`

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
  error_rate: number;              // Error rate (0-)
  uptime: number;                  // Connection uptime in seconds
}
```

---

### `client.pp.joinSwarm(options)`

Join a PP network swarm.

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

### `client.pp.leaveSwarm(nodeId, swarmId)`

Leave a PP network swarm.

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

### `client.pp.getTopology(swarmId?)`

Get PP network topology.

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
| `INVALID_API_KEY` | API key invalid or missing | 0 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 9 |
| `BACKEND_UNAVAILABLE` | Quantum backend offline | 0 |
| `INVALID_PARAMETERS` | Invalid request parameters | 00 |
| `HARDWARE_ACCESS_DENIED` | Real hardware not available for your plan | 0 |
| `SESSION_NOT_FOUND` | Session identifier not found | 0 |
| `OPERATION_FAILED` | Quantum operation failed | 00 |
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
| **Free** | 00 | 0 |  |
| **Pro** | 0,000 | ,000 | 00 |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

### Rate Limit Headers

All API responses include rate limit information in headers:

```
X-RateLimit-Limit: 0000
X-RateLimit-Remaining: 990
X-RateLimit-Reset: 0000000
```

### Handling Rate Limits

```javascript
try {
  const result = await client.bridge.createBellPair({...});
} catch (error) {
  if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    // Check rate limit headers from last response
    const resetTime = error.details?.resetTime;
    const waitSeconds = Math.ceil((resetTime - Date.now()) / 000);
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
  BB8Options,
  BB8Result
} from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  apiKey: process.env.QUANTUM_INTERNET_API_KEY
});

async function createBellPair(): Promise<BellPairResult> {
  const options: BellPairOptions = {
    backend: 'ibm_brisbane',
    useRealHardware: true,
    fidelity: 0.9
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
    // . Check API status
    const status = await client.status();
    console.log('API Status:', status);

    // . List available backends
    const backends = await client.bridge.listBackends();
    console.log('Available backends:', backends.backends);

    // . Execute BB8 QKD
    const bb8 = await client.protocols.bb8.execute({
      nQubits: 00,
      useRealHardware: true,
      backend: 'ibm_brisbane'
    });

    console.log(`Secure Key Length: ${bb8.secure_key_length} bits`);
    console.log(`Error Rate: ${bb8.error_rate}`);
    console.log(`Session ID: ${bb8.session_id}`);

    // . Validate security
    const validation = await client.protocols.bb8.validateSecurity(bb8.session_id);
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
  // . Initialize Quantum Ratchet session
  const session = await client.ratchet.initialize({
    peerId: 'alice',
    qkdProtocol: 'bb8',
    useRealHardware: true
  });

  // . Encrypt message
  const encrypted = await client.ratchet.encrypt(
    session.session_id,
    'Secret quantum message'
  );

  // . Decrypt message
  const decrypted = await client.ratchet.decrypt(
    session.session_id,
    encrypted.ciphertext
  );

  console.log('Original:', 'Secret quantum message');
  console.log('Decrypted:', decrypted.message);

  // . Rotate keys for forward security
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
  const energySaved = 0.; // kWh
  const carbonReduced = 0.; // kg CO‚‚

  // Mint SSC tokens
  const minted = await client.ssc.mint({
    amount: 0,
    energySaved,
    carbonReduced,
    operationType: 'quantum_entanglement'
  });

  console.log(`Minted ${minted.tokens} SSC tokens`);
  console.log(`Transaction ID: ${minted.tx_id}`);

  // Check balance
  const balance = await client.ssc.getBalance('your_address');
  console.log(`Total Balance: ${balance.ssc} SSC`);
  console.log(`Carbon Credits: ${balance.carbon_credits} kg CO‚‚`);
}
```

### Example: PP Quantum Network

```javascript
async function ppNetwork() {
  // . Connect to peer with QKD
  const connection = await client.pp.connect({
    peerId: 'bob',
    enableQKD: true,
    protocol: 'bb8',
    useRealHardware: true
  });

  console.log(`Connected: ${connection.connection_id}`);

  // . Send encrypted message
  const sent = await client.pp.send({
    destination: 'bob',
    payload: { message: 'Hello quantum world!' },
    useQKD: true,
    encrypt: true
  });

  console.log(`Message sent: ${sent.atom_id}`);

  // . Get connection metrics
  const metrics = await client.pp.getConnectionMetrics(connection.connection_id);
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

**Last Updated:** 0--8  
**API Version:** .0.0

