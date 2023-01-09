import { ILogin } from "../../dtos/login";
import { Get, Post } from "../http-client";

export const AuthAccont = async (data: ILogin): Promise<string | null | undefined> => {
  return await Post("/auth/login", data);
};
