import axios from 'axios';
import { GATEWAY_URL } from '../utils/constants';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      validateStatus: () => true // don't throw on 403, 500, etc.
    });
  }

  async callApi(path, userId, role) {
    try {
      const response = await this.client.get(`/fw${path}`, {
        headers: {
          "x-user-id": userId || "anonymous",
          "x-user-role": role || "guest",
        }
      });
      return {
        success: true,
        status: response.status,
        data: response.data,
        path
      };
    } catch (error) {
      return {
        success: false,
        status: "ERROR",
        data: { error: error.message },
        path
      };
    }
  }
}

export default new ApiService();