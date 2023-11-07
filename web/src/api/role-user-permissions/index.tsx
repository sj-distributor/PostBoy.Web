import {
  PageDto,
  RoleUserItemDto,
  RoleUserResponse,
  AddRoleUsersDto,
  DeleteRoleUserRequest,
  IFoundationTreeDto,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

// 获取用户list
export const GetRoleUser = async (data: PageDto) => {
  return await Get<RoleUserResponse>(
    `/api/Security/role/users?PageIndex=${data.PageIndex + 1}&PageSize=${
      data.PageSize
    }&RoleId=${data.RoleId}&Keyword=${data.Keyword}`
  );
};

// 移除用户
export const DeleteRoleUser = async (data: DeleteRoleUserRequest) => {
  return await Post("/api/Security/role/users/delete", data);
};

// 添加用户
export const AddRoleUser = async (data: AddRoleUsersDto) => {
  return await Post<RoleUserItemDto>("/api/Security/role/users/create", data);
};

export const GetTreeList = async () => {
  return await Get<IFoundationTreeDto>(
    "/api/Foundation/department/staff/hierarchy/tree"
  );
};
