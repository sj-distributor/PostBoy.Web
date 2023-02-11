import { ILoginRequest } from "../../dtos/login"
import { IUserDto } from "../../dtos/user-management"
import { Get, Post } from "../http-client"

export const GetAuthUser = async () => {
  return await Get<IUserDto>("/auth/user")
}

export const PostAuthRegister = async (data: ILoginRequest) => {
  return await Post("/auth/register", data)
}
