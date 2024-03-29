import queryString from "query-string";
import {
  IAddRoleUsersDto,
  IDeleteRole,
  IDeleteRoleUserRequest,
  IFoundationTreeDto,
  IGetPermissionsRequest,
  IPageDto,
  IPermissionsDto,
  IRolePermission,
  IRolePermissionDto,
  IRoleUserItemDto,
  IRoleUserPageDto,
  IRoleUserResponse,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

export const GetCurrentRolesByPermissions = async () => {
  return await Get<IRolePermissionDto>(`/api/Security/mine/roles`);
};

// 获取用户list
export const GetRoleUser = async (data: IRoleUserPageDto) => {
  const newQueryString = queryString.stringify(data);

  return await Get<IRoleUserResponse>(
    `/api/Security/role/users?${newQueryString}`
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

// 获取功能权限
export const GetPermissions = async (data: IGetPermissionsRequest) => {
  const newQueryString = queryString.stringify(data);
  return await Get<IPermissionsDto>(
    `/api/Security/permissions?${newQueryString}`
  );
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
export const GetRolesByPermissions = async (data: IPageDto) => {
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
