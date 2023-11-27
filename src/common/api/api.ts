import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "f6dfb876-0d96-4dd8-8917-b1444b0af626",
  },
});
