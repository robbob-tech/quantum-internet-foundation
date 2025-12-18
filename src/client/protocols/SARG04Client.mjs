// src/client/protocols/SARG04Client.mjs
// Client for SARG04 Quantum Key Distribution protocol

export class SARG04Client {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Execute SARG04 QKD using YOUR implementation
   * Improved security against PNS attacks compared to BB84
   * 
   * @param {Object} options - SARG04 configuration
   * @param {number} options.nQubits - Number of qubits to transmit
   * @param {boolean} options.useRealHardware - Use real quantum hardware
   * @param {string} options.backend - Quantum backend name
   * @returns {Promise<Object>} SARG04 result with secure key
   */
  async execute(options = {}) {
    return this.client.request('/quantum/protocols/sarg04', 'POST', {
      n_qubits: options.nQubits || 100,
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      privacy_amplification: options.privacyAmplification !== false,
      error_correction: options.errorCorrection !== false
    });
  }
  
  /**
   * Get SARG04 key statistics
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Key statistics
   */
  async getKeyStatistics(sessionId) {
    return this.client.request(`/quantum/protocols/sarg04/stats/${sessionId}`, 'GET');
  }
}
