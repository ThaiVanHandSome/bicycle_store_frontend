import axios from "axios";
import { decodeJwtPayload } from "./jwt";

const request = axios.create({
  baseURL: "http://localhost:8989/api/v1/",
  timeout: 10000,
});

const isTokenExpired = (token) => {
  const decodedToken = decodeJwtPayload(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

request.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const get = async (path, params, customHeaders, options) => {
  const headers = {
    ...customHeaders,
    'Content-Type': 'application/json'
  };
  const config = {
    params,
    headers,
    ...options
  };
  const res = await request.get(path, config);
  return res.data;
};

const post = async (path, options, customHeaders) => {
  try {
    let headers = {
      ...customHeaders,
    };
    if (!customHeaders) {
      headers = {
        'Content-Type': 'application/json'
      }
    }
    const res = await request.post(path, options, {
      headers
    });
    return res.data;
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error;
  }
};

const patch = async (path, options, customHeaders) => {
  try {
    let headers = {
      ...customHeaders,
    };
    if (!customHeaders) {
      headers = {
        'Content-Type': 'application/json'
      }
    }
    const res = await request.patch(path, options, {
      headers
    });
    return res.data;
  } catch (error) {
    console.error("Error during PATCH request:", error);
    throw error;
  }
};


const deleteReq = async (path, body, customHeaders, options = {}) => {
  const headers = {
    ...customHeaders,
    'Content-Type': 'application/json'
  };
  try {
    const res = await request.delete(path, {
      ...options,
      data: body,
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error during DELETE request:", error);
    throw error; 
  }
};


export { get, post, patch, deleteReq };
