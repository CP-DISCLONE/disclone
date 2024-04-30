import { User } from "../types/usertypes";
import { api } from "./axiosInstance";
import { AxiosResponse } from "axios";

export const userConfirmation = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    console.log("Set token to header: ", token);
    const response: AxiosResponse = await api.get("users/info/");
    if (response.status === 200) {
      console.log(response.data);
      return {
        email: response.data.email,
        displayName: response.data.display_name,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
      };
    } else {
      console.log("error userConfirmation", response);
      return null;
    }
  } else {
    console.log("userConfirmation: no token in localStorage");
    return null;
  }
};
