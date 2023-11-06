import {
  IPermissionsDto,
  IRolePermission,
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
