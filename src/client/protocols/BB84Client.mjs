// src/client/protocols/BB84Client.mjs
// Client for BB84 Quantum Key Distribution protocol

export class BB84Client {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Execute BB84 QKD using YOUR optimized implementation
   * 
   * @param {Object} options - BB84 configuration
   * @param {number} options.nQubits - Number of qubits to transmit
   * @param {number} options.errorThreshold - Error rate threshold for security (default: 0.11)
   * @param {boolean} options.useRealHardware - Use real quantum hardware
   * @param {string} options.backend - Quantum backend name
   * @param {boolean} options.privacyAmplification - Apply privacy amplification (default: true)
   * @param {boolean} options.errorCorrection - Apply error correction (default: true)
   * @returns {Promise<Object>} BB84 result with secure key, statistics
   */
  async execute(options = {}) {
    return this.client.request('/quantum/protocols/bb84', 'POST', {
      n_qubits: options.nQubits || 100,
      error_rate_threshold: options.errorThreshold || 0.11,
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      privacy_amplification: options.privacyAmplification !== false,
      error_correction: options.errorCorrection !== false,
      authenticated_channel: options.authenticatedChannel !== false
    });
  }
  
  /**
   * Get BB84 key statistics from YOUR backend
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Key statistics
   */
  async getKeyStatistics(sessionId) {
    return this.client.request(`/quantum/protocols/bb84/stats/${sessionId}`, 'GET');
  }
  
  /**
   * Validate BB84 session security
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Security validation results
   */
  async validateSecurity(sessionId) {
    return this.client.request(`/quantum/protocols/bb84/validate/${sessionId}`, 'GET');
  }
}
