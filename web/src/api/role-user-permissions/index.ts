import { IPageDto, IRolePermissionDto } from "../../dtos/role-user-permissions";
import { Get } from "../http-client";

export const GetRolesByPermissions = async (data: IPageDto) => {
  return await Get<IRolePermissionDto>(
    `/api/Security/roles/by/permissions?PageIndex=${data.pageIndex}&PageSize=${data.pageSize}&Keyword=${data.keyword}`
  );
};

export const GetCurrentRolesByPermissions = async () => {
  return await Get<IRolePermissionDto>(`/api/Security/roles/by/permissions`);
};
