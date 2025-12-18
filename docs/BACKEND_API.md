# Backend API Specification

This document specifies the API endpoints that YOUR backend must implement to support the Quantum Internet Foundation client library.

**Base URL:** `https://api.quantuminternet.dev/v1`

**Authentication:** All requests require `X-API-Key` header.

---

## General Endpoints

### GET /ping
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T10:30:00Z"
}
```

### GET /status
API status and version information.

**Response:**
```json
{
  "status": "operational",
  "version": "1.0.0",
  "uptime": "72h 15m",
  "backends_connected": 5,
  "real_hardware_available": true
}
```

---

## Quantum Bridge Endpoints

### POST /quantum/bridge/bell-pair
Create an entangled Bell pair.

**Request:**
```json
{
  "backend": "ibm_brisbane",
  "fidelity_target": 0.95,
  "use_real_hardware": false,
  "shots": 1024
}
```

**Response:**
```json
{
  "fidelity": 0.96,
  "measurements": {
    "00": 510,
    "11": 514
  },
  "backend": "ibm_brisbane",
  "hardware": false,
  "timestamp": "2025-12-18T10:30:00Z",
  "queue_time": 0
}
```

### POST /quantum/bridge/chsh
Perform CHSH test (Bell inequality).

**Request:**
```json
{
  "n_measurements": 1000,
  "backend": "ibm_brisbane",
  "use_real_hardware": false
}
```

**Response:**
```json
{
  "chsh_value": 2.828,
  "violates_classical": true,
  "correlations": {
    "E_ab": 0.707,
    "E_ab_prime": 0.707,
    "E_a_prime_b": 0.707,
    "E_a_prime_b_prime": -0.707
  },
  "backend": "ibm_brisbane"
}
```

### GET /quantum/bridge/backends
List available quantum backends.

**Response:**
```json
{
  "backends": [
    {
      "name": "ibm_brisbane",
      "qubits": 127,
      "status": "online",
      "queue_length": 5,
      "quantum_volume": 64
    }
  ]
}
```

### GET /quantum/bridge/backends/{backend_name}
Get specific backend information.

**Response:**
```json
{
  "name": "ibm_brisbane",
  "qubits": 127,
  "quantum_volume": 64,
  "clops": 15000,
  "status": "online",
  "capabilities": ["bell_pair", "qkd", "chsh"]
}
```

### GET /quantum/bridge/status
Get bridge status.

**Response:**
```json
{
  "status": "operational",
  "backends_connected": 5,
  "uptime": "72h",
  "requests_today": 1523
}
```

---

## Q-HAL Endpoints

### POST /quantum/qhal/register
Register a quantum device.

**Request:**
```json
{
  "type": "photonic",
  "id": "photonic-lab-01",
  "capabilities": ["bell_pair", "qkd"]
}
```

**Response:**
```json
{
  "device_id": "photonic-lab-01",
  "registered": true,
  "timestamp": "2025-12-18T10:30:00Z"
}
```

### GET /quantum/qhal/devices
List available devices.

**Response:**
```json
{
  "devices": [
    {
      "id": "ibm_brisbane",
      "type": "superconducting",
      "status": "online",
      "qubits": 127
    }
  ]
}
```

### POST /quantum/qhal/device/{device_id}/execute
Execute operation on device.

**Request:**
```json
{
  "operation": "create_bell_pair",
  "params": {
    "fidelity_target": 0.95
  }
}
```

**Response:**
```json
{
  "result": {
    "fidelity": 0.96
  },
  "device_id": "ibm_brisbane",
  "execution_time": 0.5
}
```

---

## QKD Protocol Endpoints

### POST /quantum/protocols/bb84
Execute BB84 protocol.

**Request:**
```json
{
  "n_qubits": 100,
  "error_rate_threshold": 0.11,
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "secure_key_length": 85,
  "raw_key_length": 100,
  "error_rate": 0.05,
  "session_id": "bb84-session-12345",
  "backend": "ibm_brisbane",
  "timestamp": "2025-12-18T10:30:00Z"
}
```

### POST /quantum/protocols/e91
Execute E91 protocol.

**Request:**
```json
{
  "n_pairs": 100,
  "chsh_threshold": 2.0,
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "secure_key_length": 82,
  "chsh_value": 2.828,
  "error_rate": 0.04,
  "session_id": "e91-session-67890",
  "entanglement_verified": true
}
```

### POST /quantum/protocols/sarg04
Execute SARG04 protocol.

### POST /quantum/protocols/bbm92
Execute BBM92 protocol.

---

## Quantum Ratchet Endpoints

### POST /quantum/ratchet/init
Initialize Quantum Ratchet session.

**Request:**
```json
{
  "peer_id": "alice",
  "qkd_protocol": "bb84",
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "session_id": "ratchet-abc123",
  "peer_id": "alice",
  "protocol": "bb84",
  "created_at": "2025-12-18T10:30:00Z"
}
```

### POST /quantum/ratchet/encrypt
Encrypt message.

**Request:**
```json
{
  "session_id": "ratchet-abc123",
  "message": "Secret message"
}
```

**Response:**
```json
{
  "ciphertext": "encrypted_data_here...",
  "key_id": "key-xyz789"
}
```

### POST /quantum/ratchet/decrypt
Decrypt message.

### POST /quantum/ratchet/rotate
Rotate encryption keys.

---

## SSC Economics Endpoints

### POST /quantum/ssc/mint
Mint SSC tokens.

**Request:**
```json
{
  "amount": 100,
  "energy_saved": 1.5,
  "carbon_reduced": 0.75,
  "operation_type": "quantum_entanglement"
}
```

**Response:**
```json
{
  "tokens": 100,
  "tx_id": "tx-123456",
  "timestamp": "2025-12-18T10:30:00Z"
}
```

### GET /quantum/ssc/balance/{address}
Get SSC balance.

**Response:**
```json
{
  "ssc": 1500,
  "carbon_credits": 7.5,
  "energy_saved": 15.0
}
```

### POST /quantum/ssc/transfer
Transfer SSC tokens.

---

## P2P Network Endpoints

### POST /quantum/p2p/connect
Establish P2P connection.

**Request:**
```json
{
  "peer_id": "bob",
  "enable_qkd": true,
  "protocol": "bb84",
  "use_real_hardware": false
}
```

**Response:**
```json
{
  "connection_id": "conn-abc123",
  "status": "connected",
  "qkd_enabled": true
}
```

### POST /quantum/p2p/send
Send message via P2P.

**Request:**
```json
{
  "destination": "bob",
  "payload": "Hello quantum world!",
  "use_qkd": true,
  "encrypt": true
}
```

**Response:**
```json
{
  "atom_id": "atom-xyz789",
  "status": "delivered"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `INVALID_API_KEY` - API key invalid or missing
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `BACKEND_UNAVAILABLE` - Quantum backend offline
- `INVALID_PARAMETERS` - Invalid request parameters
- `HARDWARE_ACCESS_DENIED` - Real hardware not available for your plan

---

## Rate Limits

- **Free Tier:** 100 requests/day
- **Pro Tier:** 10,000 requests/day
- **Enterprise:** Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9950
X-RateLimit-Reset: 1640000000
```

---

## Implementation Notes

YOUR backend (quantum-bridge-server.py and related) must implement all these endpoints to support the client library functionality.

The client library handles:
- API key management
- Request formatting
- Error handling
- TypeScript types

YOUR backend handles:
- Actual quantum operations
- Hardware integration
- Protocol implementations
- Economics logic
- Network infrastructure
