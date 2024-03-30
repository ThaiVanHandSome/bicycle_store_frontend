import axios from "axios";

const requset = axios.create({
  baseURL: "http://localhost:8989/api/v1/",
  timeout: 10000,
});

const get = async (path, options) => {
  const res = await requset.get(path, options);
  return res.data;
};

export default get;
