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
  Administrator = "Administrator",
  DefaultUser = "DefaultUser",
}

export const UserRoleType = {
  [UserRoleEnum.Administrator]: "超級管理員",
  [UserRoleEnum.DefaultUser]: "普通用戶",
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
  pageIndex: number;
  pageSize: number;
  roleId?: string;
}
