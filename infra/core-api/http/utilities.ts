import { AxiosRequestConfig } from "axios";
import { API_URL } from "../config";

export const tokenHeader = (token: string) => `Bearer ${token}`;

export type InstanceConfig = Pick<AxiosRequestConfig, "withCredentials">;

export const createInstanceConfig = (
  config: InstanceConfig = {},
): AxiosRequestConfig => ({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  ...config,
});
