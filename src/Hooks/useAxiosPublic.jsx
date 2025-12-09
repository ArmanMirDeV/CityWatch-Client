import axios from "axios";
import { BASE_URL } from "../Utils/constants";

const axiosSecure = axios.create({
  baseURL: BASE_URL,
});

const useaxiosSecure = () => {
  return axiosSecure;
};

export default useaxiosSecure;
