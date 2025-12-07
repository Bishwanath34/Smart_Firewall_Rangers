import { useState } from 'react';
import apiService from '../services/apiService';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);

  const callApi = async (path, userId, role) => {
    setLoading(true);
    setLastRequest(null);

    const result = await apiService.callApi(path, userId, role);
    
    setLastRequest(result);
    setLoading(false);
    
    return result;
  };

  return {
    loading,
    lastRequest,
    callApi,
    setLastRequest
  };
};

export default useApi;