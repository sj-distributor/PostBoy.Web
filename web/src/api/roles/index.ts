import {
  IAddRoleData,
  IDeleteRoleResponse,
  IRoleData,
  IRolesListResponse,
} from "../../dtos/role";
import { Get, Post } from "../http-client";

export const GetRolesList = async (data: {
  PageIndex: number;
  PageSize: number;
}) => {
  return await Get<IRolesListResponse>(
    `/api/Security/roles?PageIndex=${data.PageIndex}&PageSize=${data.PageSize}`
  );
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
