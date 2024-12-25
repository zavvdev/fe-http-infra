import { Http } from "../../http/base";
import { createHttp } from "../../http";
import { validateServerSuccessResponseData as validateResponse } from "../../utilities";
import {
  LoginRequest,
  LoginResponse,
  loginSchema,
  RegisterRequest,
  registerSchema,
} from "./schemas";

class AuthApi {
  private readonly http: Http;

  constructor(httpRepo: Http) {
    this.http = httpRepo;
  }

  public async login(dto: LoginRequest) {
    const response = await this.http.post<LoginResponse>("/auth/login", {
      ...loginSchema.request.validateSync(dto, { strict: true }),
    });

    return validateResponse(response, loginSchema.response);
  }

  public async register(dto: RegisterRequest) {
    return await this.http.post("/auth/signup", {
      ...registerSchema.request.validateSync(dto, { strict: true }),
    });
  }

  public async logout() {
    return await this.http.post("/auth/logout");
  }
}

export const authApi = new AuthApi(
  createHttp({
    // If you need to send cookies with your requests and accept cookies in responses
    withCredentials: true,
  }),
);
