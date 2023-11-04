import {
  IDeleteRole,
  IPageDto,
  IRoleDto,
} from "../../dtos/role-user-permissions";
import { Get, Post } from "../http-client";

// 获取角色
export const GetRolesList = async (data: IPageDto) => {
  return await Get<IRoleDto>(
    `/api/Security/roles?PageIndex=${data.pageIndex + 1}&PageSize=${
      data.pageSize
    }&Keyword=${data.keyword}`
  );
};

// 删除角色
export const DeleteRoles = async (data: IDeleteRole) => {
  return await Post("/api/Security/roles/delete", data);
};
