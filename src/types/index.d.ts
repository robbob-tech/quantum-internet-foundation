// src/types/index.d.ts
// TypeScript definitions for Quantum Internet Foundation

export interface QuantumInternetClientConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  debug?: boolean;
  skipAuth?: boolean;
}

export interface BellPairOptions {
  backend?: string;
  useRealHardware?: boolean;
  fidelity?: number;
  shots?: number;
}

export interface BellPairResult {
  fidelity: number;
  measurements: Record<string, number>;
  backend: string;
  hardware: boolean;
  timestamp: string;
}

export interface CHSHOptions {
  measurements?: number;
  backend?: string;
  useRealHardware?: boolean;
}

export interface CHSHResult {
  chsh_value: number;
  violates_classical: boolean;
  correlations: Record<string, number>;
  backend: string;
}

export interface BB84Options {
  nQubits?: number;
  errorThreshold?: number;
  useRealHardware?: boolean;
  backend?: string;
  privacyAmplification?: boolean;
  errorCorrection?: boolean;
  authenticatedChannel?: boolean;
}

export interface BB84Result {
  secure_key_length: number;
  raw_key_length: number;
  error_rate: number;
  session_id: string;
  backend: string;
  timestamp: string;
}

export interface E91Options {
  nPairs?: number;
  chshThreshold?: number;
  useRealHardware?: boolean;
  backend?: string;
  eavesdropperDetection?: boolean;
}

export interface E91Result {
  secure_key_length: number;
  chsh_value: number;
  error_rate: number;
  session_id: string;
  entanglement_verified: boolean;
}

export interface SARG04Options {
  nQubits?: number;
  useRealHardware?: boolean;
  backend?: string;
  privacyAmplification?: boolean;
  errorCorrection?: boolean;
}

export interface BBM92Options {
  nPairs?: number;
  useRealHardware?: boolean;
  backend?: string;
  basisReconciliation?: boolean;
  privacyAmplification?: boolean;
}

export interface QuantumRatchetInitOptions {
  peerId: string;
  qkdProtocol?: string;
  useRealHardware?: boolean;
  backend?: string;
  keyRefreshInterval?: number;
}

export interface QuantumRatchetSession {
  session_id: string;
  peer_id: string;
  protocol: string;
  created_at: string;
}

export interface SSCMintOptions {
  amount: number;
  energySaved: number;
  carbonReduced: number;
  operationType: string;
  recipient?: string;
  metadata?: Record<string, any>;
}

export interface SSCMintResult {
  tokens: number;
  tx_id: string;
  timestamp: string;
}

export interface SSCTransferOptions {
  from: string;
  to: string;
  amount: number;
  memo?: string;
}

export interface P2PConnectOptions {
  peerId: string;
  enableQKD?: boolean;
  protocol?: string;
  useRealHardware?: boolean;
  backend?: string;
  encryption?: boolean;
}

export interface P2PSendOptions {
  destination: string;
  payload: any;
  useQKD?: boolean;
  encrypt?: boolean;
  priority?: string;
}

export class QuantumBridgeClient {
  constructor(parent: QuantumInternetClient);
  createBellPair(options?: BellPairOptions): Promise<BellPairResult>;
  performCHSH(options?: CHSHOptions): Promise<CHSHResult>;
  executeCircuit(options: any): Promise<any>;
  listBackends(): Promise<any>;
  getBackendInfo(backendName: string): Promise<any>;
  status(): Promise<any>;
  health(): Promise<any>;
}

export class QHALClient {
  constructor(parent: QuantumInternetClient);
  registerDevice(deviceConfig: any): Promise<any>;
  listDevices(filter?: any): Promise<any>;
  getDevice(deviceId: string): Promise<any>;
  executeOperation(deviceId: string, operation: string, params?: any): Promise<any>;
  getDeviceMetrics(deviceId: string, options?: any): Promise<any>;
  getDeviceErrors(deviceId: string, limit?: number): Promise<any>;
  calibrateDevice(deviceId: string, calibrationParams?: any): Promise<any>;
  status(): Promise<any>;
}

export class BB84Client {
  constructor(parent: QuantumInternetClient);
  execute(options?: BB84Options): Promise<BB84Result>;
  getKeyStatistics(sessionId: string): Promise<any>;
  validateSecurity(sessionId: string): Promise<any>;
}

export class E91Client {
  constructor(parent: QuantumInternetClient);
  execute(options?: E91Options): Promise<E91Result>;
  getCHSHStatistics(sessionId: string): Promise<any>;
  validateEntanglement(sessionId: string): Promise<any>;
}

export class SARG04Client {
  constructor(parent: QuantumInternetClient);
  execute(options?: SARG04Options): Promise<any>;
  getKeyStatistics(sessionId: string): Promise<any>;
}

export class BBM92Client {
  constructor(parent: QuantumInternetClient);
  execute(options?: BBM92Options): Promise<any>;
  getKeyStatistics(sessionId: string): Promise<any>;
  validateEntanglement(sessionId: string): Promise<any>;
}

export class QuantumRatchetClient {
  constructor(parent: QuantumInternetClient);
  initialize(options: QuantumRatchetInitOptions): Promise<QuantumRatchetSession>;
  encrypt(sessionId: string, message: string | object): Promise<any>;
  decrypt(sessionId: string, ciphertext: string): Promise<any>;
  rotateKeys(sessionId: string, options?: any): Promise<any>;
  getSessionStatus(sessionId: string): Promise<any>;
  terminate(sessionId: string): Promise<any>;
  listSessions(): Promise<any>;
}

export class SSCClient {
  constructor(parent: QuantumInternetClient);
  mint(options: SSCMintOptions): Promise<SSCMintResult>;
  getBalance(address: string): Promise<any>;
  transfer(options: SSCTransferOptions): Promise<any>;
  getTransactionHistory(address: string, options?: any): Promise<any>;
  getCarbonStats(address?: string): Promise<any>;
  getExchangeRate(currency?: string): Promise<any>;
  stake(options: any): Promise<any>;
  getSystemStats(): Promise<any>;
}

export class P2PClient {
  constructor(parent: QuantumInternetClient);
  connect(options: P2PConnectOptions): Promise<any>;
  send(options: P2PSendOptions): Promise<any>;
  receive(nodeId: string, options?: any): Promise<any>;
  getStatus(nodeId?: string): Promise<any>;
  listPeers(nodeId: string): Promise<any>;
  disconnect(connectionId: string): Promise<any>;
  getConnectionMetrics(connectionId: string): Promise<any>;
  joinSwarm(options: any): Promise<any>;
  leaveSwarm(nodeId: string, swarmId: string): Promise<any>;
  getTopology(swarmId?: string): Promise<any>;
}

export class QuantumInternetClient {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  debug: boolean;
  
  bridge: QuantumBridgeClient;
  qhal: QHALClient;
  protocols: {
    bb84: BB84Client;
    e91: E91Client;
    sarg04: SARG04Client;
    bbm92: BBM92Client;
  };
  ratchet: QuantumRatchetClient;
  ssc: SSCClient;
  p2p: P2PClient;
  
  constructor(config?: QuantumInternetClientConfig);
  request(endpoint: string, method?: string, data?: any): Promise<any>;
  ping(): Promise<any>;
  status(): Promise<any>;
}

export function createClient(config?: QuantumInternetClientConfig): QuantumInternetClient;
