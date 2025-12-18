// src/client/security/QuantumRatchetClient.mjs
// Client for Quantum Ratchet encryption

export class QuantumRatchetClient {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Initialize Quantum Ratchet session using YOUR implementation
   * 
   * @param {Object} options - Ratchet initialization options
   * @param {string} options.peerId - Peer identifier
   * @param {string} options.qkdProtocol - QKD protocol to use (bb84, e91, sarg04, bbm92)
   * @param {boolean} options.useRealHardware - Use real quantum hardware for QKD
   * @param {string} options.backend - Quantum backend name
   * @returns {Promise<Object>} Session details with session_id
   */
  async initialize(options = {}) {
    return this.client.request('/quantum/ratchet/init', 'POST', {
      peer_id: options.peerId,
      qkd_protocol: options.qkdProtocol || 'bb84',
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      key_refresh_interval: options.keyRefreshInterval || 100
    });
  }
  
  /**
   * Encrypt message using YOUR Quantum Ratchet
   * 
   * @param {string} sessionId - Ratchet session identifier
   * @param {string|Object} message - Message to encrypt
   * @returns {Promise<Object>} Encrypted message with ciphertext
   */
  async encrypt(sessionId, message) {
    return this.client.request('/quantum/ratchet/encrypt', 'POST', {
      session_id: sessionId,
      message: typeof message === 'string' ? message : JSON.stringify(message)
    });
  }
  
  /**
   * Decrypt message using YOUR Quantum Ratchet
   * 
   * @param {string} sessionId - Ratchet session identifier
   * @param {string} ciphertext - Encrypted message
   * @returns {Promise<Object>} Decrypted message
   */
  async decrypt(sessionId, ciphertext) {
    return this.client.request('/quantum/ratchet/decrypt', 'POST', {
      session_id: sessionId,
      ciphertext
    });
  }
  
  /**
   * Rotate encryption keys using YOUR Quantum Ratchet logic
   * 
   * @param {string} sessionId - Ratchet session identifier
   * @param {Object} options - Rotation options
   * @returns {Promise<Object>} Rotation result
   */
  async rotateKeys(sessionId, options = {}) {
    return this.client.request('/quantum/ratchet/rotate', 'POST', {
      session_id: sessionId,
      force_qkd: options.forceQKD || false
    });
  }
  
  /**
   * Get ratchet session status
   * 
   * @param {string} sessionId - Ratchet session identifier
   * @returns {Promise<Object>} Session status, key age, messages encrypted
   */
  async getSessionStatus(sessionId) {
    return this.client.request(`/quantum/ratchet/session/${sessionId}/status`, 'GET');
  }
  
  /**
   * Terminate ratchet session
   * 
   * @param {string} sessionId - Ratchet session identifier
   * @returns {Promise<Object>} Termination confirmation
   */
  async terminate(sessionId) {
    return this.client.request(`/quantum/ratchet/session/${sessionId}/terminate`, 'POST');
  }
  
  /**
   * List active ratchet sessions
   * 
   * @returns {Promise<Object>} List of active sessions
   */
  async listSessions() {
    return this.client.request('/quantum/ratchet/sessions', 'GET');
  }
}
