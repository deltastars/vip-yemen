/**
 * VipYemen API Client
 * Client for connecting to the VipYemen backend API
 */

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Listings
  async getListings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/listings${queryString ? `?${queryString}` : ''}`);
  }

  async getListing(id) {
    return this.request(`/listings/${id}`);
  }

  async createListing(data) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id, data) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Statistics
  async getStatistics() {
    return this.request('/statistics');
  }

  // Search
  async searchListings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/search${queryString ? `?${queryString}` : ''}`);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  healthCheck,
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getCategories,
  getStatistics,
  searchListings,
} = apiClient;

