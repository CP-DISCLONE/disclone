import axios, { AxiosInstance } from "axios";

/**
 * @description An AxiosInstance configured with the base server url for requests
 */
export const api: AxiosInstance = axios.create({
  baseURL: "http://18.222.254.79:8001/api/v1/",
});
