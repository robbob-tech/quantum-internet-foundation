// src/client/network/P2PClient.mjs
// Client for P2P quantum network

export class P2PClient {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Establish P2P connection using YOUR infrastructure
   * 
   * @param {Object} options - Connection options
   * @param {string} options.peerId - Peer identifier to connect to
   * @param {boolean} options.enableQKD - Enable quantum key distribution
   * @param {string} options.protocol - QKD protocol (bb84, e91, sarg04, bbm92)
   * @param {boolean} options.useRealHardware - Use real quantum hardware
   * @param {string} options.backend - Quantum backend name
   * @returns {Promise<Object>} Connection result with connection_id
   */
  async connect(options = {}) {
    return this.client.request('/quantum/p2p/connect', 'POST', {
      peer_id: options.peerId,
      enable_qkd: options.enableQKD || false,
      protocol: options.protocol || 'bb84',
      use_real_hardware: options.useRealHardware || false,
      backend: options.backend || 'ibm_brisbane',
      encryption: options.encryption !== false
    });
  }
  
  /**
   * Send message via YOUR P2P network
   * 
   * @param {Object} options - Send options
   * @param {string} options.destination - Destination peer ID
   * @param {Object|string} options.payload - Message payload
   * @param {boolean} options.useQKD - Use QKD for this message
   * @param {boolean} options.encrypt - Encrypt message
   * @returns {Promise<Object>} Send result with atom_id
   */
  async send(options = {}) {
    return this.client.request('/quantum/p2p/send', 'POST', {
      destination: options.destination,
      payload: options.payload,
      use_qkd: options.useQKD || false,
      encrypt: options.encrypt !== false,
      priority: options.priority || 'normal'
    });
  }
  
  /**
   * Receive messages from P2P network
   * 
   * @param {string} nodeId - Your node ID
   * @param {Object} options - Receive options
   * @returns {Promise<Object>} Received messages
   */
  async receive(nodeId, options = {}) {
    const query = new URLSearchParams({
      limit: options.limit || 10,
      since: options.since || 0
    }).toString();
    return this.client.request(`/quantum/p2p/receive/${nodeId}?${query}`, 'GET');
  }
  
  /**
   * Get P2P network status from YOUR system
   * 
   * @param {string} nodeId - Node identifier (optional)
   * @returns {Promise<Object>} Network status, connected peers
   */
  async getStatus(nodeId = null) {
    const endpoint = nodeId 
      ? `/quantum/p2p/status/${nodeId}`
      : '/quantum/p2p/status';
    return this.client.request(endpoint, 'GET');
  }
  
  /**
   * List connected peers
   * 
   * @param {string} nodeId - Your node ID
   * @returns {Promise<Object>} List of connected peers
   */
  async listPeers(nodeId) {
    return this.client.request(`/quantum/p2p/node/${nodeId}/peers`, 'GET');
  }
  
  /**
   * Disconnect from peer
   * 
   * @param {string} connectionId - Connection identifier
   * @returns {Promise<Object>} Disconnection confirmation
   */
  async disconnect(connectionId) {
    return this.client.request(`/quantum/p2p/connection/${connectionId}/disconnect`, 'POST');
  }
  
  /**
   * Get connection metrics
   * 
   * @param {string} connectionId - Connection identifier
   * @returns {Promise<Object>} Connection metrics (latency, throughput, qkd usage)
   */
  async getConnectionMetrics(connectionId) {
    return this.client.request(`/quantum/p2p/connection/${connectionId}/metrics`, 'GET');
  }
  
  /**
   * Join P2P network swarm
   * 
   * @param {Object} options - Swarm join options
   * @param {string} options.nodeId - Your node identifier
   * @param {string} options.swarmId - Swarm to join
   * @param {boolean} options.enableQKD - Enable QKD for swarm
   * @returns {Promise<Object>} Swarm join result
   */
  async joinSwarm(options = {}) {
    return this.client.request('/quantum/p2p/swarm/join', 'POST', {
      node_id: options.nodeId,
      swarm_id: options.swarmId,
      enable_qkd: options.enableQKD || false,
      carbon_aware: options.carbonAware !== false
    });
  }
  
  /**
   * Leave P2P network swarm
   * 
   * @param {string} nodeId - Your node ID
   * @param {string} swarmId - Swarm to leave
   * @returns {Promise<Object>} Leave confirmation
   */
  async leaveSwarm(nodeId, swarmId) {
    return this.client.request('/quantum/p2p/swarm/leave', 'POST', {
      node_id: nodeId,
      swarm_id: swarmId
    });
  }
  
  /**
   * Get P2P network topology
   * 
   * @param {string} swarmId - Swarm identifier (optional)
   * @returns {Promise<Object>} Network topology graph
   */
  async getTopology(swarmId = null) {
    const endpoint = swarmId
      ? `/quantum/p2p/topology/${swarmId}`
      : '/quantum/p2p/topology';
    return this.client.request(endpoint, 'GET');
  }
}
