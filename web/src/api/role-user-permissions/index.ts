import { IPageDto, IRolePermissionDto } from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

export const GetRolesByPermissions = async (data: IPageDto) => {
  return await Get<IRolePermissionDto>(
    `/api/Security/roles/by/permissions?PageIndex=${data.pageIndex}&PageSize=${data.pageSize}`
  );
};
