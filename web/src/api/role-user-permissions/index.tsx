import {
  IRoleUserPageDto,
  IRoleUserItemDto,
  IRoleUserResponse,
  IAddRoleUsersDto,
  IDeleteRoleUserRequest,
  IFoundationTreeDto,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

// 获取用户list
export const GetRoleUser = async (data: IRoleUserPageDto) => {
  return await Get<IRoleUserResponse>(
    `/api/Security/role/users?PageIndex=${data.PageIndex + 1}&PageSize=${
      data.PageSize
    }&RoleId=${data.RoleId}&Keyword=${data.Keyword}`
  );
};

// 移除用户
export const DeleteRoleUser = async (data: IDeleteRoleUserRequest) => {
  return await Post("/api/Security/role/users/delete", data);
};

// 添加用户
export const AddRoleUser = async (data: IAddRoleUsersDto) => {
  return await Post<IRoleUserItemDto>("/api/Security/role/users/create", data);
};

//人员层级tree
export const GetTreeList = async () => {
  return await Get<IFoundationTreeDto>(
    "/api/Foundation/department/staff/hierarchy/tree"
  );
};

//获取全部角色用户列表
export const GetRoleUserList = async () => {
  return await Get<IRoleUserResponse>(`/api/Security/role/users`);
};
