import {
  DeleteRoleUserRequest,
  PageDto,
  RoleUserItemDto,
  RoleUserResponse,
  AddRoleUsersDto,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

// 获取用户list
export const GetRoleUser = async (data: PageDto) => {
  return await Get<RoleUserResponse>("/api/Security/role/users");
};

// 移除用户
export const DeleteRoleUser = async (data: DeleteRoleUserRequest) => {
  return await Post("/api/Security/role/users/delete");
};

// 添加用户
export const AddRoleUser = async (data: AddRoleUsersDto) => {
  return await Post<RoleUserItemDto>("/api/Security/role/users/create");
};
