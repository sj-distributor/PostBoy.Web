export interface IUserTableDto {
  id: number;
  name: string;
  date: string;
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

export interface IRoleData {
  createdDate: string;
  id: string;
  modifiedDate: string;
  name: string;
}

export interface IRolesListResponse {
  count: number;
  roles: IRoleData[];
}

export interface IDeleteRoleResponse {}

export interface IRoleAddData {
  id: string;
  name: string;
}

export interface IAddRoleData {
  roles: IRoleAddData[];
}

export interface IGetRolesDto {
  PageIndex: number;
  PageSize: number;
  RoleId?: string;
}
