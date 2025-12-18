// src/client/economics/SSCClient.mjs
// Client for SSC (Smart Savings Coin) economics

export class SSCClient {
  constructor(parent) {
    this.client = parent;
  }
  
  /**
   * Mint SSC tokens using YOUR economics logic
   * 
   * @param {Object} options - Minting options
   * @param {number} options.amount - Amount of SSC to mint
   * @param {number} options.energySaved - Energy saved in kWh
   * @param {number} options.carbonReduced - Carbon reduced in kg CO2
   * @param {string} options.operationType - Type of operation (quantum_entanglement, qkd, etc.)
   * @param {string} options.recipient - Recipient address (optional)
   * @returns {Promise<Object>} Minting result with tx_id and tokens
   */
  async mint(options = {}) {
    return this.client.request('/quantum/ssc/mint', 'POST', {
      amount: options.amount,
      energy_saved: options.energySaved,
      carbon_reduced: options.carbonReduced,
      operation_type: options.operationType,
      recipient: options.recipient,
      metadata: options.metadata || {}
    });
  }
  
  /**
   * Get SSC balance from YOUR system
   * 
   * @param {string} address - Wallet address
   * @returns {Promise<Object>} Balance information
   */
  async getBalance(address) {
    return this.client.request(`/quantum/ssc/balance/${address}`, 'GET');
  }
  
  /**
   * Transfer SSC using YOUR economics system
   * 
   * @param {Object} options - Transfer options
   * @param {string} options.from - Sender address
   * @param {string} options.to - Recipient address
   * @param {number} options.amount - Amount to transfer
   * @param {string} options.memo - Optional memo
   * @returns {Promise<Object>} Transfer result with tx_id
   */
  async transfer(options = {}) {
    return this.client.request('/quantum/ssc/transfer', 'POST', {
      from: options.from,
      to: options.to,
      amount: options.amount,
      memo: options.memo || ''
    });
  }
  
  /**
   * Get SSC transaction history
   * 
   * @param {string} address - Wallet address
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of transactions to return
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Object>} Transaction history
   */
  async getTransactionHistory(address, options = {}) {
    const query = new URLSearchParams({
      limit: options.limit || 10,
      offset: options.offset || 0
    }).toString();
    return this.client.request(`/quantum/ssc/history/${address}?${query}`, 'GET');
  }
  
  /**
   * Get carbon credit statistics
   * 
   * @param {string} address - Wallet address (optional)
   * @returns {Promise<Object>} Carbon credit statistics
   */
  async getCarbonStats(address = null) {
    const endpoint = address 
      ? `/quantum/ssc/carbon/${address}`
      : '/quantum/ssc/carbon';
    return this.client.request(endpoint, 'GET');
  }
  
  /**
   * Get SSC exchange rate
   * 
   * @param {string} currency - Target currency (USD, EUR, etc.)
   * @returns {Promise<Object>} Exchange rate information
   */
  async getExchangeRate(currency = 'USD') {
    return this.client.request(`/quantum/ssc/rate/${currency}`, 'GET');
  }
  
  /**
   * Stake SSC tokens
   * 
   * @param {Object} options - Staking options
   * @param {string} options.address - Staker address
   * @param {number} options.amount - Amount to stake
   * @param {number} options.duration - Staking duration in days
   * @returns {Promise<Object>} Staking result
   */
  async stake(options = {}) {
    return this.client.request('/quantum/ssc/stake', 'POST', {
      address: options.address,
      amount: options.amount,
      duration: options.duration || 30
    });
  }
  
  /**
   * Get SSC system statistics
   * 
   * @returns {Promise<Object>} Total supply, circulating supply, market stats
   */
  async getSystemStats() {
    return this.client.request('/quantum/ssc/stats', 'GET');
  }
}
