// src/client/QuantumInternetClient.mjs
// Main client for Quantum Internet Foundation API

import { QuantumBridgeClient } from './hardware/QuantumBridgeClient.mjs';
import { QHALClient } from './hardware/QHALClient.mjs';
import { BB84Client } from './protocols/BB84Client.mjs';
import { E91Client } from './protocols/E91Client.mjs';
import { SARG04Client } from './protocols/SARG04Client.mjs';
import { BBM92Client } from './protocols/BBM92Client.mjs';
import { QuantumRatchetClient } from './security/QuantumRatchetClient.mjs';
import { SSCClient } from './economics/SSCClient.mjs';
import { P2PClient } from './network/P2PClient.mjs';

export class QuantumInternetClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.QUANTUM_INTERNET_API_KEY;
    this.baseUrl = config.baseUrl || 'https://quantum-internet-api.sparsesupernova.workers.dev/v1';
    this.timeout = config.timeout || 30000;
    this.debug = config.debug || false;
    
    if (!this.apiKey && !config.skipAuth) {
      console.warn('Warning: No API key provided. Set QUANTUM_INTERNET_API_KEY or pass apiKey in config.');
      console.warn('   Get your API key: operations@sparse-supernova.com');
    }
    
    // Initialize feature clients
    this.bridge = new QuantumBridgeClient(this);
    this.qhal = new QHALClient(this);
    this.protocols = {
      bb84: new BB84Client(this),
      e91: new E91Client(this),
      sarg04: new SARG04Client(this),
      bbm92: new BBM92Client(this)
    };
    this.ratchet = new QuantumRatchetClient(this);
    this.ssc = new SSCClient(this);
    this.p2p = new P2PClient(this);
  }
  
  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint path
   * @param {string} method - HTTP method
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, method = 'POST', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey || '',
      'X-Client-Version': '1.0.0',
      'User-Agent': 'quantum-internet-client/1.0.0'
    };
    
    const options = {
      method,
      headers,
      timeout: this.timeout
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    if (this.debug) {
      console.log(`[QI-Client] ${method} ${url}`);
      if (data) console.log('[QI-Client] Request:', JSON.stringify(data, null, 2));
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(
          `Quantum Internet API Error [${response.status}]: ${errorData.message || errorData.error || 'Unknown error'}`
        );
      }
      
      const result = await response.json();
      
      if (this.debug) {
        console.log('[QI-Client] Response:', JSON.stringify(result, null, 2));
      }
      
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Quantum Internet API request timed out after ${this.timeout}ms`);
      }
      throw error;
    }
  }
  
  /**
   * Test API connection
   * @returns {Promise<Object>} Connection status
   */
  async ping() {
    return this.request('/ping', 'GET');
  }
  
  /**
   * Get API status and version
   * @returns {Promise<Object>} API status information
   */
  async status() {
    return this.request('/status', 'GET');
  }
}
