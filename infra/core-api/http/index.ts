import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { serverResponseSchema } from "../schema";
import { errorReporterService } from "../../services/error-reporter-service";
import { Http } from "./base";
import { sessionToken, terminateSession } from "../session";
import { SERVER_RESPONSE_MESSAGE } from "../config";
import { withRetry } from "./helpers/retry";
import { createInstanceConfig, InstanceConfig, tokenHeader } from "./utilities";
import { refreshToken } from "./helpers/refresh-token";

function requestInterceptor(config: InternalAxiosRequestConfig) {
  const token = sessionToken.get();

  if (token && config.headers) {
    config.headers.Authorization = tokenHeader(token as string);
  }

  return config;
}

function responseSuccessInterceptor<T, K>(response: AxiosResponse<T, K>) {
  try {
    const data = serverResponseSchema.validateSync(response?.data, {
      strict: true,
    });

    return {
      ...response,
      data,
    };
  } catch (error) {
    errorReporterService.report({
      location: "core-api/http@responseSuccessInterceptor",
      error,
    });
    throw new Error("Invalid Server Success Response");
  }
}

async function responseErrorInterceptor(error: AxiosError) {
  try {
    const serverResponse = serverResponseSchema.validateSync(
      error?.response?.data,
      {
        strict: true,
      },
    );

    if (serverResponse.message === SERVER_RESPONSE_MESSAGE.invalidToken) {
      terminateSession();
    }

    throw serverResponse;
  } catch (error: any) {
    const data = error?.response?.data || error;

    errorReporterService.report({
      location: "core-api/http@responseErrorInterceptor",
      error: data,
    });

    throw data;
  }
}

async function refreshTokenOnRetry(error: AxiosError) {
  const serverResponse = serverResponseSchema.validateSync(
    error?.response?.data,
    {
      strict: true,
    },
  );

  if (serverResponse.message === SERVER_RESPONSE_MESSAGE.invalidToken) {
    await refreshToken();
  }
}

export const createHttp = (config: InstanceConfig = {}) => {
  const client = axios.create(createInstanceConfig(config));

  withRetry(client, refreshTokenOnRetry);

  client.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor,
  );

  client.interceptors.request.use(requestInterceptor);

  return new Http(client);
};

export const http = createHttp();
