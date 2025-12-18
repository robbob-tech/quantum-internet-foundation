// src/client/hardware/QuantumBridgeClient.mjs
// Client for Quantum Bridge - connects to real IBM Quantum hardware

export class QuantumBridgeClient {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Create a Bell pair using quantum bridge backend
   * Calls YOUR quantum-bridge-server.py implementation
   * 
   * @param {Object} options - Bell pair configuration
   * @param {string} options.backend - Quantum backend (e.g., 'ibm_brisbane')
   * @param {boolean} options.useRealHardware - Use real IBM Quantum hardware
   * @param {number} options.fidelity - Target fidelity (0-1)
   * @returns {Promise<Object>} Bell pair result with fidelity, measurements, backend info
   */
  async createBellPair(options = {}) {
    return this.client.request('/quantum/bridge/bell-pair', 'POST', {
      backend: options.backend || 'ibm_brisbane',
      fidelity_target: options.fidelity || 0.95,
      use_real_hardware: options.useRealHardware || false,
      shots: options.shots || 1024
    });
  }
  
  /**
   * Perform CHSH test (Bell inequality violation)
   * Calls YOUR quantum bridge implementation
   * 
   * @param {Object} options - CHSH test configuration
   * @param {number} options.measurements - Number of measurements
   * @param {string} options.backend - Quantum backend
   * @returns {Promise<Object>} CHSH result with value, correlations
   */
  async performCHSH(options = {}) {
    return this.client.request('/quantum/bridge/chsh', 'POST', {
      n_measurements: options.measurements || 1000,
      backend: options.backend || 'ibm_brisbane',
      use_real_hardware: options.useRealHardware || false
    });
  }
  
  /**
   * Execute arbitrary quantum circuit on backend
   * Calls YOUR quantum bridge for circuit execution
   * 
   * @param {Object} options - Circuit execution options
   * @param {Array} options.circuit - Quantum circuit definition
   * @param {string} options.backend - Quantum backend
   * @param {number} options.shots - Number of shots
   * @returns {Promise<Object>} Execution results
   */
  async executeCircuit(options = {}) {
    return this.client.request('/quantum/bridge/execute', 'POST', {
      circuit: options.circuit,
      backend: options.backend || 'ibm_brisbane',
      shots: options.shots || 1024,
      use_real_hardware: options.useRealHardware || false
    });
  }
  
  /**
   * Get available quantum backends from YOUR system
   * @returns {Promise<Object>} List of available backends with status
   */
  async listBackends() {
    return this.client.request('/quantum/bridge/backends', 'GET');
  }
  
  /**
   * Get backend information and capabilities
   * @param {string} backendName - Name of backend
   * @returns {Promise<Object>} Backend details, qubits, capabilities
   */
  async getBackendInfo(backendName) {
    return this.client.request(`/quantum/bridge/backends/${backendName}`, 'GET');
  }
  
  /**
   * Check status of YOUR quantum bridge
   * @returns {Promise<Object>} Bridge status, connected backends
   */
  async status() {
    return this.client.request('/quantum/bridge/status', 'GET');
  }
  
  /**
   * Get quantum bridge health metrics
   * @returns {Promise<Object>} Health metrics, uptime, queue status
   */
  async health() {
    return this.client.request('/quantum/bridge/health', 'GET');
  }
}
