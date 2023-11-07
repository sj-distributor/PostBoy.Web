import {
  IDeleteRole,
  IFoundationTreeDto,
  IPageDto,
  IPermissionsDto,
  IRolePermission,
  IRolePermissionDto,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

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

export const GetTreeList = async () => {
  return await Get<IFoundationTreeDto>(
    "/api/Foundation/department/staff/hierarchy/tree"
  );
};
