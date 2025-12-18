// src/client/protocols/BBM92Client.mjs
// Client for BBM92 Quantum Key Distribution protocol

export class BBM92Client {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Execute BBM92 QKD using YOUR implementation
   * Entanglement-based protocol simpler than E91
   * 
   * @param {Object} options - BBM92 configuration
   * @param {number} options.nPairs - Number of entangled pairs
   * @param {boolean} options.useRealHardware - Use real quantum hardware
   * @param {string} options.backend - Quantum backend name
   * @returns {Promise<Object>} BBM92 result with secure key
   */
  async execute(options = {}) {
    return this.client.request('/quantum/protocols/bbm92', 'POST', {
      n_pairs: options.nPairs || 100,
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      basis_reconciliation: options.basisReconciliation !== false,
      privacy_amplification: options.privacyAmplification !== false
    });
  }
  
  /**
   * Get BBM92 key statistics
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Key statistics
   */
  async getKeyStatistics(sessionId) {
    return this.client.request(`/quantum/protocols/bbm92/stats/${sessionId}`, 'GET');
  }
  
  /**
   * Validate BBM92 entanglement quality
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Entanglement quality metrics
   */
  async validateEntanglement(sessionId) {
    return this.client.request(`/quantum/protocols/bbm92/validate/${sessionId}`, 'GET');
  }
}
