import { ILogin } from "../../dtos/login";
import { Get, Post } from "../http-client";

export const AuthAccont = async (data: ILogin) => {
  return await Post<string>("/auth/login", data);
};
