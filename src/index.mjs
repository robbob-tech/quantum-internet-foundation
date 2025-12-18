// src/index.mjs
// Main entry point for Quantum Internet Foundation client library

export { QuantumInternetClient } from './client/QuantumInternetClient.mjs';

// Hardware clients
export { QuantumBridgeClient } from './client/hardware/QuantumBridgeClient.mjs';
export { QHALClient } from './client/hardware/QHALClient.mjs';

// Protocol clients
export { BB84Client } from './client/protocols/BB84Client.mjs';
export { E91Client } from './client/protocols/E91Client.mjs';
export { SARG04Client } from './client/protocols/SARG04Client.mjs';
export { BBM92Client } from './client/protocols/BBM92Client.mjs';

// Security clients
export { QuantumRatchetClient } from './client/security/QuantumRatchetClient.mjs';

// Economics clients
export { SSCClient } from './client/economics/SSCClient.mjs';

// Network clients
export { P2PClient } from './client/network/P2PClient.mjs';

// Convenience exports
export const createClient = (config) => new QuantumInternetClient(config);
