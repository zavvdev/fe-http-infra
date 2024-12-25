import * as yup from "yup";

export type ServerResponse<T = unknown> = {
  status: string;
  message: string;
  data?: T | null;
};

export const serverResponseSchema: yup.Schema<ServerResponse> = yup.object({
  status: yup.string().required(),
  message: yup.string().required(),
  data: yup.mixed().nullable(),
});
