import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://react-auth-vlhs.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance };
