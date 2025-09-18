
const API_BASE_URL = import.meta.env.VITE_BACKEND_HOST ? `${import.meta.env.VITE_BACKEND_HOST}/api/v1` : 'http://localhost:5000/api/v1';

class ApiService {
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

  // News Search API
  async searchNews(query, generateAnswer = true) {
    try {
      const params = new URLSearchParams({
        q: query,
        generateAnswer: generateAnswer.toString()
      });

      const response = await this.request(`/news/search?${params}`, {
        method: 'GET'
      });

      return response;
    } catch (error) {
      console.error('News search failed:', error);
      throw error;
    }
  }

  // Chat Session Management APIs
  async getAllSessions(limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });
      const response = await this.request(`/chat/sessions?${params}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Get all sessions failed:', error);
      throw error;
    }
  }

  async createSession() {
    try {
      const response = await this.request('/chat/sessions', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Create session failed:', error);
      throw error;
    }
  }

  async getChatHistory(sessionId, limit = 50) {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      const response = await this.request(`/chat/sessions/${sessionId}/history?${params}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Get chat history failed:', error);
      throw error;
    }
  }

  async clearSessionCache(sessionId) {
    try {
      const response = await this.request(`/chat/sessions/${sessionId}/cache`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Clear session cache failed:', error);
      throw error;
    }
  }

  async deleteSession(sessionId) {
    try {
      const response = await this.request(`/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Delete session failed:', error);
      throw error;
    }
  }

  async backupSession(sessionId) {
    try {
      const response = await this.request(`/chat/sessions/${sessionId}/backup`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Backup session failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ApiService();

// Legacy functions for backward compatibility
export const sendToRAGPipeline = async (message, sessionId) => {
  try {
    return await apiService.searchNews(message);
  } catch (error) {
    // Fallback to mock response if API fails
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: `Based on my search through the news corpus, here's what I found about "${message}": [This would be the actual RAG response with retrieved news articles and Gemini AI generated answer]`,
          sources: [
            { title: "Reuters - Tech News", url: "#" },
            { title: "BBC - Current Affairs", url: "#" }
          ]
        });
      }, 2000);
    });
  }
};

export const loadChatHistory = async (sessionId) => {
  try {
    const response = await apiService.getChatHistory(sessionId);
    return response.history || [];
  } catch (error) {
    console.error('Load chat history failed:', error);
    return [];
  }
};

export const loadAllSessions = async () => {
  try {
    const response = await apiService.getAllSessions();
    return response.sessions || [];
  } catch (error) {
    console.error('Load all sessions failed:', error);
    return [];
  }
};

export const createNewSession = async () => {
  try {
    const response = await apiService.createSession();
    return response.sessionId;
  } catch (error) {
    console.error('Create new session failed:', error);
    throw error;
  }
};

export const clearChatSession = async (sessionId) => {
  try {
    await apiService.clearSessionCache(sessionId);
  } catch (error) {
    console.error('Clear chat session failed:', error);
  }
};

export const deleteSession = async (sessionId) => {
  try {
    await apiService.deleteSession(sessionId);
  } catch (error) {
    console.error('Delete session failed:', error);
    throw error;
  }
};

const apiService = new ApiService();
export { apiService };