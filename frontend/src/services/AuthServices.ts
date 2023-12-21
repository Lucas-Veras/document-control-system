import { api } from "../infra/api";
import { ILogin } from "../interfaces/ILogin";
import { IRegister } from "../interfaces/IRegister";
import { IResponse } from "../interfaces/IResponse";

class AuthService {
  async register(User: IRegister): Promise<IResponse<IRegister>> {
    const response = await api.post("/account/register/", User);
    return response.data;
  }

  async login(User: ILogin) {
    const response = await api.post("/account/token/", User);
    return response.data;
  }
}

export default new AuthService();
