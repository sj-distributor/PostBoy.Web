import { ILoginRequest } from "../../dtos/login";
import {
  IGetAllUserDto,
  IUserAllResponse,
  IUserApikeyAddData,
  IUserApikeysResponse,
  IUserResponse,
} from "../../dtos/user-management";
import { Get, Post } from "../http-client";

export const GetAuthUser = async () => {
  return await Get<IUserResponse>("/auth/user");
};

export const PostAuthRegister = async (data: ILoginRequest) => {
  return await Post("/auth/register", data);
};

export const GetAllUsers = async (data: IGetAllUserDto) => {
  return await Get<IUserAllResponse>(
    `/auth/allUsers?Page=${data.Page}&PageSize=${data.PageSize}${
      data.UserName ? "&UserName=" + data.UserName : ""
    }`
  );
};

export const GetUserApikeys = async (userId: string) => {
  return await Get<IUserApikeysResponse[]>(
    `/auth/user/apikeys?UserId=${userId}`
  );
};

export const PostUserApikeysAdd = async (data: IUserApikeyAddData) => {
  return await Post("/auth/user/apikey/add", data);
};
