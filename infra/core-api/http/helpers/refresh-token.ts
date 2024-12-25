import axios from "axios";
import { createInstanceConfig } from "../utilities";
import { ServerResponse } from "../../schema";
import { sessionToken, terminateSession } from "../../session";

const REFRESH_RATE = 5 * 1000;

let lastRefreshed = Date.now();
let isRefreshing = false;
let isRefreshedAtLeastOnce = false;

const refreshTokenHttp = axios.create(
  createInstanceConfig({
    withCredentials: true,
  }),
);

export async function refreshToken() {
  try {
    if (
      (Date.now() - lastRefreshed < REFRESH_RATE && isRefreshedAtLeastOnce) ||
      isRefreshing
    ) {
      return;
    }

    isRefreshing = true;

    const response =
      await refreshTokenHttp.post<ServerResponse<{ access_token: string }>>(
        "/auth/refresh",
      );

    lastRefreshed = Date.now();
    isRefreshedAtLeastOnce = true;
    isRefreshing = false;

    const token = response.data.data?.access_token;

    if (token) {
      sessionToken.set(token);
    }
  } catch {
    terminateSession();
    isRefreshing = false;
  }
}
