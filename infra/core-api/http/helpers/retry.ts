import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import { AxiosError, AxiosInstance } from "axios";
import { SERVER_RESPONSE_MESSAGE } from "../../config";
import { ServerResponse } from "../../schema";
import { sessionToken } from "../../session";

const DENY_METHODS = new Set(["post", "put", "delete", "patch"]);

export function withRetry(
  instance: AxiosInstance,
  onRetry?: (error: AxiosError) => Promise<void>,
): void {
  axiosRetry(instance, {
    retries: 3,
    retryDelay: axiosRetry.linearDelay(1500),
    onRetry: (_, error) => {
      onRetry?.(error);
    },
    retryCondition: (error) => {
      if (!sessionToken.exists()) {
        return false;
      }

      const method = error.config?.method?.toLowerCase();

      if (!method) {
        return false;
      }

      const response = error.response?.data as ServerResponse;

      if (response?.message === SERVER_RESPONSE_MESSAGE.invalidToken) {
        return true;
      }

      if (DENY_METHODS.has(method)) {
        return false;
      }

      return isNetworkOrIdempotentRequestError(error);
    },
  });
}
