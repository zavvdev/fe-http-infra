import * as yup from "yup";
import { ServerResponse } from "./schema";
import { SERVER_RESPONSE_STATUS } from "./config";
import { errorReporterService } from "../services/error-reporter-service";

export function validateServerSuccessResponseData<
  S extends yup.InferType<yup.Schema>,
>(response: ServerResponse<S>, schema: yup.Schema): ServerResponse<S> {
  if (response?.status === SERVER_RESPONSE_STATUS.success) {
    try {
      return {
        ...response,
        data: schema.validateSync(response.data, { strict: true }),
      };
    } catch (error) {
      errorReporterService.report({
        location: "core-api/utilities@validateServerSuccessResponseData",
        error,
      });
      throw error;
    }
  }

  return response;
}
