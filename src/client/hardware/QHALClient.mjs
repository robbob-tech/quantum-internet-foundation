// src/client/hardware/QHALClient.mjs
// Client for Q-HAL (Quantum Hardware Abstraction Layer)

export class QHALClient {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Register a quantum device with YOUR Q-HAL system
   * @param {Object} deviceConfig - Device configuration
   * @param {string} deviceConfig.type - Device type (photonic, nv_center, superconducting, repeater)
   * @param {string} deviceConfig.id - Device identifier
   * @param {Object} deviceConfig.capabilities - Device capabilities
   * @returns {Promise<Object>} Registration result
   */
  async registerDevice(deviceConfig) {
    return this.client.request('/quantum/qhal/register', 'POST', deviceConfig);
  }
  
  /**
   * List available quantum devices in YOUR Q-HAL
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise<Object>} List of devices with status
   */
  async listDevices(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const endpoint = query ? `/quantum/qhal/devices?${query}` : '/quantum/qhal/devices';
    return this.client.request(endpoint, 'GET');
  }
  
  /**
   * Get specific device information
   * @param {string} deviceId - Device identifier
   * @returns {Promise<Object>} Device details, status, capabilities
   */
  async getDevice(deviceId) {
    return this.client.request(`/quantum/qhal/device/${deviceId}`, 'GET');
  }
  
  /**
   * Execute operation on device via YOUR Q-HAL
   * @param {string} deviceId - Device identifier
   * @param {string} operation - Operation name (e.g., 'create_bell_pair')
   * @param {Object} params - Operation parameters
   * @returns {Promise<Object>} Operation result
   */
  async executeOperation(deviceId, operation, params = {}) {
    return this.client.request(`/quantum/qhal/device/${deviceId}/execute`, 'POST', {
      operation,
      params
    });
  }
  
  /**
   * Get device metrics from YOUR Q-HAL
   * @param {string} deviceId - Device identifier
   * @param {Object} options - Metrics options
   * @returns {Promise<Object>} Device metrics (fidelity, uptime, operations)
   */
  async getDeviceMetrics(deviceId, options = {}) {
    const query = new URLSearchParams(options).toString();
    const endpoint = query 
      ? `/quantum/qhal/device/${deviceId}/metrics?${query}`
      : `/quantum/qhal/device/${deviceId}/metrics`;
    return this.client.request(endpoint, 'GET');
  }
  
  /**
   * Get device error log
   * @param {string} deviceId - Device identifier
   * @param {number} limit - Number of recent errors to retrieve
   * @returns {Promise<Object>} Error log entries
   */
  async getDeviceErrors(deviceId, limit = 10) {
    return this.client.request(
      `/quantum/qhal/device/${deviceId}/errors?limit=${limit}`,
      'GET'
    );
  }
  
  /**
   * Calibrate device via YOUR Q-HAL
   * @param {string} deviceId - Device identifier
   * @param {Object} calibrationParams - Calibration parameters
   * @returns {Promise<Object>} Calibration results
   */
  async calibrateDevice(deviceId, calibrationParams = {}) {
    return this.client.request(`/quantum/qhal/device/${deviceId}/calibrate`, 'POST', calibrationParams);
  }
  
  /**
   * Get Q-HAL system status
   * @returns {Promise<Object>} Q-HAL system status, registered devices count
   */
  async status() {
    return this.client.request('/quantum/qhal/status', 'GET');
  }
}
