# API Access Tiers

The Quantum Internet Foundation API uses a tiered access system to provide different levels of service based on your needs.

## How It Works

### API Key Format

API keys are prefixed to indicate their tier:

- **Free Tier:** Keys starting with `free_` (e.g., `free_abc123...`)
- **Pro Tier:** Keys starting with `pro_` (e.g., `pro_xyz789...`)
- **Enterprise Tier:** Keys starting with `ent_` (e.g., `ent_enterprise123...`)

### Rate Limiting

Rate limits are enforced per API key and tracked across:
- **Per Minute:** Short-term burst protection
- **Per Hour:** Medium-term usage limits
- **Per Day:** Daily quota limits

Rate limit information is returned in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
X-API-Tier: Free
```

---

## Free Tier

**Key Prefix:** `free_`

**Limits:**
- 100 requests/day
- 10 requests/hour
- 2 requests/minute

**Features:**
- Simulation mode only (no real quantum hardware)
- All QKD protocols available (BB84, E91, SARG04, BBM92)
- All API endpoints accessible
- Educational use

**Restrictions:**
- `use_real_hardware: true` requests will be rejected with `HARDWARE_ACCESS_DENIED` error
- Real hardware operations automatically fall back to simulation

**Use Cases:**
- Learning quantum networking concepts
- Testing API integration
- Educational projects
- Prototyping applications

**Get Free Tier Key:**
Email: operations@sparse-supernova.com

---

## Pro Tier

**Key Prefix:** `pro_`

**Cost:** $99/month

**Limits:**
- 10,000 requests/day
- 1,000 requests/hour
- 100 requests/minute

**Features:**
- **Real quantum hardware access** (IBM Quantum)
- All QKD protocols
- All API endpoints
- Priority support via email

**Use Cases:**
- Production applications
- Research projects
- Commercial quantum networking
- Real quantum experiments

**Get Pro Tier:**
Email: operations@sparse-supernova.com

---

## Enterprise Tier

**Key Prefix:** `ent_`

**Cost:** Custom pricing

**Limits:**
- Unlimited requests
- No rate limits

**Features:**
- Unlimited real quantum hardware access
- Dedicated hardware allocation
- Custom integration support
- 24/7 support
- SLA guarantees
- Custom endpoints (if needed)

**Use Cases:**
- Large-scale deployments
- Mission-critical applications
- High-volume quantum operations
- Custom requirements

**Get Enterprise Tier:**
Email: operations@sparse-supernova.com

---

## How to Use Your API Key

### Setting the API Key

**Option 1: Environment Variable**
```bash
export QUANTUM_INTERNET_API_KEY="free_your_key_here"
```

**Option 2: In Code**
```javascript
import { QuantumInternetClient } from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  apiKey: 'free_your_key_here'
});
```

### Free Tier Example

```javascript
// Free tier automatically uses simulation mode
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: false  // Required for Free tier
});

// This will work - simulation mode
console.log('Fidelity:', bellPair.fidelity);

// This will fail on Free tier
try {
  const realBellPair = await client.bridge.createBellPair({
    backend: 'ibm_brisbane',
    useRealHardware: true  // Will be rejected for Free tier
  });
} catch (error) {
  // Error: HARDWARE_ACCESS_DENIED
  // "Real hardware access requires Pro or Enterprise tier"
}
```

### Pro Tier Example

```javascript
// Pro tier can use real hardware
const client = new QuantumInternetClient({
  apiKey: 'pro_your_pro_key_here'
});

// This will work - real hardware access
const bellPair = await client.bridge.createBellPair({
  backend: 'ibm_brisbane',
  useRealHardware: true  // Allowed for Pro tier
});

console.log('Hardware:', bellPair.hardware); // true
```

---

## Rate Limit Handling

### Checking Rate Limits

Rate limit information is included in every response:

```javascript
const response = await fetch('https://quantum-internet-api.sparsesupernova.workers.dev/v1/quantum/bridge/bell-pair', {
  method: 'POST',
  headers: {
    'X-API-Key': 'free_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ backend: 'ibm_brisbane' })
});

const limit = response.headers.get('X-RateLimit-Limit');
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');
const tier = response.headers.get('X-API-Tier');

console.log(`Tier: ${tier}`);
console.log(`Remaining: ${remaining}/${limit}`);
```

### Handling Rate Limit Errors

When rate limits are exceeded, the API returns a `429` status with details:

```javascript
try {
  const result = await client.bridge.createBellPair({...});
} catch (error) {
  if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    // Check response for reset time
    console.log('Rate limit exceeded. Please wait before retrying.');
    // Wait until reset time before retrying
  }
}
```

**Error Response:**
```json
{
  "error": "Rate limit exceeded: Daily rate limit exceeded. Limit: 100 requests. Reset at: 2025-12-19T00:00:00.000Z",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Tier Comparison

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| **Requests/Day** | 100 | 10,000 | Unlimited |
| **Requests/Hour** | 10 | 1,000 | Unlimited |
| **Real Hardware** | No | Yes | Yes |
| **All Protocols** | Yes | Yes | Yes |
| **Support** | Community | Email | 24/7 + SLA |
| **Cost** | Free | $99/month | Custom |

---

## Upgrading Your Tier

To upgrade from Free to Pro or Enterprise:

1. Email: operations@sparse-supernova.com
2. Specify your current API key
3. Request tier upgrade
4. Receive new API key with upgraded tier prefix

**Note:** Your rate limit counters reset when you upgrade.

---

## Free Tier Restrictions

### What Works on Free Tier

- All QKD protocols (BB84, E91, SARG04, BBM92) in simulation mode
- Quantum Ratchet encryption (simulation)
- P2P network connections (simulation)
- SSC token operations
- All read-only endpoints (status, backends list, etc.)

### What Doesn't Work on Free Tier

- `use_real_hardware: true` - Will return `HARDWARE_ACCESS_DENIED` error
- Real IBM Quantum hardware access
- Hardware-accelerated operations

### Automatic Fallback

The API automatically handles Free tier restrictions:

```javascript
// Free tier key
const client = new QuantumInternetClient({
  apiKey: 'free_your_key'
});

// Even if you request real hardware, it will use simulation
const result = await client.bridge.createBellPair({
  useRealHardware: true  // Ignored for Free tier, uses simulation
});

// result.hardware will be false (simulation mode)
```

---

## Getting Your API Key

**All Tiers:**
Email: operations@sparse-supernova.com

Include in your request:
- Desired tier (Free, Pro, or Enterprise)
- Intended use case
- Contact information

Free tier keys are typically issued immediately. Pro and Enterprise tiers may require payment setup.

---

## Testing Without API Key

For local testing and development, you can use the client library's simulation mode:

```javascript
// No API key needed for local simulations
import { QuantumInternetClient } from '@quantum-internet/foundation';

const client = new QuantumInternetClient({
  skipAuth: true  // For local testing only
});

// Use local simulation examples
// See examples/06-local-simulation.mjs
```

---

## FAQ

**Q: Can I use Free tier for production?**  
A: Free tier is designed for educational use and testing. For production, use Pro or Enterprise tier.

**Q: What happens when I exceed my rate limit?**  
A: You'll receive a `429` error with reset time. Wait until the reset time or upgrade your tier.

**Q: Can I switch between tiers?**  
A: Yes, contact operations@sparse-supernova.com to upgrade or downgrade.

**Q: Are rate limits shared across all my API keys?**  
A: No, each API key has its own independent rate limit counters.

**Q: How are rate limits calculated?**  
A: Limits are tracked per API key across three time windows: per minute, per hour, and per day.

---

**Last Updated:** 2025-12-18

