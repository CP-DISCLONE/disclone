import axios, { AxiosInstance } from "axios";

/**
 * @description An AxiosInstance configured with the base server url for requests
 */
export const api: AxiosInstance = axios.create({
  baseURL: "http://disclone.duckdns.org/api/v1/",
});
