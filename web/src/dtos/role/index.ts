export interface IRoleTabltDto {
  id: number;
  name: string;
  details: string;
  role: UserRoleEnum;
}

export interface IDepartmentDto {
  allDepartment: IDepartmentListDto[];
}

export interface IDepartmentListDto {
  higherDepartment: {
    name: string;
    id: string;
    childrenDepartment?: IDepartmentDetailsListDto[];
  };
}

export interface IDepartmentDetailsListDto {
  name: string;
  id: string;
  childrenDepartment?: IDepartmentDetailsListDto[];
}

export enum UserRoleEnum {
  SuperAdmin,
  Admin,
  User,
}

export const UserRoleType = {
  [UserRoleEnum.SuperAdmin]: "超級管理員",
  [UserRoleEnum.Admin]: "管理員",
  [UserRoleEnum.User]: "用戶",
};

export interface PageDto {
  PageIndex: number;
  PageSize: number;
}

export interface RoleUserResponse {
  count: 0;
  roleUsers: RoleUserItemDto[];
}

export interface RoleUserItemDto extends RoleUsersDto {
  createdDate: string;
  modifiedDate: string;
}

export interface RoleUsersDto {
  id: string;
  roleId: string;
  userId: string;
}

export interface DeleteRoleUserRequest {
  roleUserIds: string[];
}
