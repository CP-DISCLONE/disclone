import axios, { AxiosInstance } from "axios";

/**
 * @description An AxiosInstance configured with the base server url for requests
 */
export const api: AxiosInstance = axios.create({
  baseURL: "http://ec2-18-222-254-79.us-east-2.compute.amazonaws.com/api/v1/",
});
