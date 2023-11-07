export interface IRoleUserPageDto {
  PageIndex: number;
  PageSize: number;
  RoleId: string;
  Keyword: string;
}

export interface IRoleUserResponse {
  count: number;
  roleUsers: IRoleUserItemDto[];
}

export interface IRoleUserItemDto extends IRoleUsersDto {
  createdDate: string;
  modifiedDate: string;
  roleName: string;
  userName: string;
}

export interface IRoleUsersDto {
  id?: string;
  roleId: string;
  userId: string;
}

export interface IAddRoleUsersDto {
  roleUsers: IRoleUsersDto[];
}

export interface IDeleteRoleUserRequest {
  roleUserIds: string[];
}

export interface IFoundationTreeDto {
  staffDepartmentHierarchy: IDepartmentTreeDto[];
}

export interface IDepartmentTreeDto {
  department: IDepartmentType;
  staffs: IUsersDto[] | [];
  childrens: IDepartmentTreeDto[];
}

export interface IDepartmentType {
  id: string;
  name: string;
  parentId: string;
}

export interface IUsersDto {
  id: string;
  userName: string;
}

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
