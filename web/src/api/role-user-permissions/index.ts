import {
  IAddRoleUsersDto,
  IDeleteRole,
  IDeleteRoleUserRequest,
  IFoundationTreeDto,
  IPageDto,
  IPermissionsDto,
  IRolePermission,
  IRolePermissionDto,
  IRoleUserItemDto,
  IRoleUserPageDto,
  IRoleUserResponse,
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

// 获取功能权限
export const GetPermissions = async () => {
  return await Get<IPermissionsDto>("/api/Security/permissions");
};

// 查询角色
export const GetRolePermission = async (roleId: string) => {
  return await Get<IRolePermission>(`/api/Security/role/${roleId}/permissions`);
};

// 添加角色
export const AddRolePermission = async (data: IRolePermission) => {
  return await Post<IRolePermission>(
    "/api/Security/role/permissions/assign",
    data
  );
};

// 更新角色
export const UpdateRolePermission = async (data: IRolePermission) => {
  return await Post<IRolePermission>(
    "/api/Security/role/permissions/edit",
    data
  );
};

// 获取角色list
export const GetRolesList = async (data: IPageDto) => {
  return await Get<IRolePermissionDto>(
    `/api/Security/roles/by/permissions?PageIndex=${
      data.pageIndex + 1
    }&PageSize=${data.pageSize}${
      data.keyword ? "&Keyword=" + data.keyword : ""
    }`
  );
};

//删除角色
export const DeleteRoles = async (data: IDeleteRole) => {
  return await Post("/api/Security/roles/delete", data);
};
