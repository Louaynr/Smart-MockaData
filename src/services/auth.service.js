import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(API_URL + 'signin', {
        username,
        password
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await axios.post(API_URL + 'signup', {
        username,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    const user = this.getCurrentUser();
    return user ? user.accessToken : null;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return user && user.accessToken;
  }

  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }
}

export default new AuthService(); 