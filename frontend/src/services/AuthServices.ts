import { api, privateApi } from "../infra/api";
import { ILogin } from "../interfaces/ILogin";
import { IRefreshToken } from "../interfaces/IAuth";
import { IRegister } from "../interfaces/IRegister";
import { IResponse } from "../interfaces/IResponse";

class AuthService {
  async register(user: IRegister): Promise<IResponse<IRegister>> {
    const response = await api.post("/account/register/", user);
    return response.data;
  }

  async login(user: ILogin) {
    const response = await api.post("/account/token/", user);
    return response.data;
  }

  async getRefreshToken(refresh: IRefreshToken) {
    const response = await privateApi.post("/account/token/refresh/", refresh);
    return response.data;
  }

  async getUser() {
    const response = await privateApi.get("/user/me/");
    return response.data;
  }
}

export default new AuthService();
