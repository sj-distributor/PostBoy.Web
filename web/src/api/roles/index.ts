import {
  IAddRoleData,
  IDeleteRoleResponse,
  IGetRolesDto,
  IRoleData,
  IRolesListResponse,
} from "../../dtos/role";
import { Get, Post } from "../http-client";

export const GetRolesList = async (data: IGetRolesDto) => {
  return await Get<IRolesListResponse>(
    `/api/Security/roles?PageIndex=${data.PageIndex}&PageSize=${data.PageSize}${
      data.RoleId ? "&RoleId=" + data.RoleId : ""
    }`
  );
};

export const GetRole = async (id: string) => {
  return await Get<IRoleData>(`/api/Security/role?Id=${id}`);
};

export const PostDeleteRole = async (data: { roleIds: string[] }) => {
  return await Post<IDeleteRoleResponse>(`/api/Security/roles/delete`, data);
};

export const PostCreateRole = async (data: IAddRoleData) => {
  return await Post<IRoleData>(`/api/Security/roles/create`, data);
};

export const PostUpdateRole = async (data: IAddRoleData) => {
  return await Post<IRoleData>(`/api/Security/roles/update`, data);
};
