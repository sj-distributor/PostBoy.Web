import { ILoginRequest } from "../../dtos/login";
import { Get, Post } from "../http-client";

export const AuthAccont = async (data: ILoginRequest) => {
  return await Post<string>("/auth/login", data);
};
