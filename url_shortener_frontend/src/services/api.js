import axios from 'axios';

const BASE_URL = 'http://localhost:5001';  

export const shortenUrl = async (originalUrl) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/urls/shorten`, { originalUrl });
    return response.data.data.shortUrl; 
  } catch (error) {
    console.error(error)
    if(error.code ==="ERR_BAD_REQUEST")
    alert("invalid url");
    return null;
  }
};

export const getOriginalUrl = async (shortId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/urls/${shortId}`);
    return response.data.data?.originalUrl;
  } catch (error) {
    console.error('Error retrieving original URL:', error);
    return null;
  }
};
