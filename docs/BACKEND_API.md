# Backend API Specification

This document specifies the API endpoints that YOUR backend must implement to support the Quantum Internet Foundation client library.

**Base URL:** `https://quantum-internet-api.sparsesupernova.workers.dev/v`

**Note:** This API is deployed on Cloudflare Workers. You can use a custom domain by configuring it in Cloudflare.

**Authentication:** All requests require `X-API-Key` header.

---

## General Endpoints

### GET /ping
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "0--8T0:0:00Z"
}
```

### GET /status
API status and version information.

**Response:**
```json
{
  "status": "operational",
  "version": ".0.0",
  "uptime": "7h m",
  "backends_connected": ,
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
  "fidelity_target": 0.9,
  "use_real_hardware": false,
  "shots": 0
}
```

**Response:**
```json
{
  "fidelity": 0.9,
  "measurements": {
    "00": 0,
    "": 
  },
  "backend": "ibm_brisbane",
  "hardware": false,
  "timestamp": "0--8T0:0:00Z",
  "queue_time": 0
}
```

### POST /quantum/bridge/chsh
Perform CHSH test (Bell inequality).

**Request:**
```json
{
  "n_measurements": 000,
  "backend": "ibm_brisbane",
  "use_real_hardware": false
}
```

**Response:**
```json
{
  "chsh_value": .88,
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
      "qubits": 7,
      "status": "online",
      "queue_length": ,
      "quantum_volume": 
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
  "qubits": 7,
  "quantum_volume": ,
  "clops": 000,
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
  "backends_connected": ,
  "uptime": "7h",
  "requests_today": 
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
  "id": "photonic-lab-0",
  "capabilities": ["bell_pair", "qkd"]
}
```

**Response:**
```json
{
  "device_id": "photonic-lab-0",
  "registered": true,
  "timestamp": "0--8T0:0:00Z"
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
      "qubits": 7
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
    "fidelity_target": 0.9
  }
}
```

**Response:**
```json
{
  "result": {
    "fidelity": 0.9
  },
  "device_id": "ibm_brisbane",
  "execution_time": 0.
}
```

---

## QKD Protocol Endpoints

### POST /quantum/protocols/bb8
Execute BB8 protocol.

**Request:**
```json
{
  "n_qubits": 00,
  "error_rate_threshold": 0.,
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "secure_key_length": 8,
  "raw_key_length": 00,
  "error_rate": 0.0,
  "session_id": "bb8-session-",
  "backend": "ibm_brisbane",
  "timestamp": "0--8T0:0:00Z"
}
```

### POST /quantum/protocols/e9
Execute E9 protocol.

**Request:**
```json
{
  "n_pairs": 00,
  "chsh_threshold": .0,
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "secure_key_length": 8,
  "chsh_value": .88,
  "error_rate": 0.0,
  "session_id": "e9-session-7890",
  "entanglement_verified": true
}
```

### POST /quantum/protocols/sarg0
Execute SARG0 protocol.

### POST /quantum/protocols/bbm9
Execute BBM9 protocol.

---

## Quantum Ratchet Endpoints

### POST /quantum/ratchet/init
Initialize Quantum Ratchet session.

**Request:**
```json
{
  "peer_id": "alice",
  "qkd_protocol": "bb8",
  "use_real_hardware": false,
  "backend": "ibm_brisbane"
}
```

**Response:**
```json
{
  "session_id": "ratchet-abc",
  "peer_id": "alice",
  "protocol": "bb8",
  "created_at": "0--8T0:0:00Z"
}
```

### POST /quantum/ratchet/encrypt
Encrypt message.

**Request:**
```json
{
  "session_id": "ratchet-abc",
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
  "amount": 00,
  "energy_saved": .,
  "carbon_reduced": 0.7,
  "operation_type": "quantum_entanglement"
}
```

**Response:**
```json
{
  "tokens": 00,
  "tx_id": "tx-",
  "timestamp": "0--8T0:0:00Z"
}
```

### GET /quantum/ssc/balance/{address}
Get SSC balance.

**Response:**
```json
{
  "ssc": 00,
  "carbon_credits": 7.,
  "energy_saved": .0
}
```

### POST /quantum/ssc/transfer
Transfer SSC tokens.

---

## PP Network Endpoints

### POST /quantum/pp/connect
Establish PP connection.

**Request:**
```json
{
  "peer_id": "bob",
  "enable_qkd": true,
  "protocol": "bb8",
  "use_real_hardware": false
}
```

**Response:**
```json
{
  "connection_id": "conn-abc",
  "status": "connected",
  "qkd_enabled": true
}
```

### POST /quantum/pp/send
Send message via PP.

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

- **Free Tier:** 00 requests/day
- **Pro Tier:** 0,000 requests/day
- **Enterprise:** Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 0000
X-RateLimit-Remaining: 990
X-RateLimit-Reset: 0000000
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
