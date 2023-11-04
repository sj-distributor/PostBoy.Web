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
