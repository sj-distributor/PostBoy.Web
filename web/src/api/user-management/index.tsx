import { ILoginRequest } from "../../dtos/login"
import {
  IUserApikeyAddData,
  IUserApikeysResponse,
  IUserResponse,
} from "../../dtos/user-management"
import { Get, Post } from "../http-client"

export const GetAuthUser = async () => {
  return await Get<IUserResponse>("/auth/user")
}

export const PostAuthRegister = async (data: ILoginRequest) => {
  return await Post("/auth/register", data)
}

export const GetAllUsers = async () => {
  return await Get<IUserResponse[]>("/auth/allUsers")
}

export const GetUserApikeys = async () => {
  return await Get<IUserApikeysResponse[]>("/auth/user/apikeys")
}

export const PostUserApikeysAdd = async (data: IUserApikeyAddData) => {
  return await Post("/auth/user/apikey/add", data)
}
