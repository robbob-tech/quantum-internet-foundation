// src/client/protocols/E91Client.mjs
// Client for E91 Quantum Key Distribution protocol (with fixed CHSH)

export class E91Client {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Execute E91 QKD with YOUR fixed CHSH implementation
   * Returns correct CHSH value ~2.828 for perfect Bell states
   * 
   * @param {Object} options - E91 configuration
   * @param {number} options.nPairs - Number of entangled pairs
   * @param {number} options.chshThreshold - CHSH threshold (classical limit is 2.0)
   * @param {boolean} options.useRealHardware - Use real quantum hardware
   * @param {string} options.backend - Quantum backend name
   * @returns {Promise<Object>} E91 result with secure key, CHSH value
   */
  async execute(options = {}) {
    return this.client.request('/quantum/protocols/e91', 'POST', {
      n_pairs: options.nPairs || 100,
      chsh_threshold: options.chshThreshold || 2.0,
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      eavesdropper_detection: options.eavesdropperDetection !== false
    });
  }
  
  /**
   * Get E91 CHSH statistics
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} CHSH statistics and correlations
   */
  async getCHSHStatistics(sessionId) {
    return this.client.request(`/quantum/protocols/e91/chsh/${sessionId}`, 'GET');
  }
  
  /**
   * Validate E91 session entanglement quality
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Entanglement quality metrics
   */
  async validateEntanglement(sessionId) {
    return this.client.request(`/quantum/protocols/e91/validate/${sessionId}`, 'GET');
  }
}
