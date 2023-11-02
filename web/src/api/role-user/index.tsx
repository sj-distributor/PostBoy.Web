import { IEmailResonponse } from "../../dtos/email";
import {
  DeleteRoleUserRequest,
  PageDto,
  RoleUserItemDto,
  RoleUserResponse,
  RoleUsersDto,
} from "../../dtos/role";
import { Get, Post } from "../http-client";

export const GetRoleUser = async (data: PageDto) => {
  return await Get<RoleUserResponse>("/api/Security/role/users");
};

export const UpdateRoleUser = async (data: RoleUsersDto) => {
  return await Post<RoleUserItemDto>("/api/Security/role/users/update");
};

export const DeleteRoleUser = async (data: DeleteRoleUserRequest) => {
  return await Post("/api/Security/role/users/delete");
};

export const AddRoleUser = async (data: RoleUsersDto) => {
  return await Post<RoleUserItemDto>("/api/Security/role/users/create");
};
