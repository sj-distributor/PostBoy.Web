import { ILoginRequest } from "../../dtos/login";
import { Post } from "../http-client";

export const AuthAccont = async (data: ILoginRequest) => {
  return await Post<string>("/auth/login", data);
};
