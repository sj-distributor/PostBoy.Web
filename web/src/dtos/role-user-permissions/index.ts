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
  staffs: IUsersDto[];
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

export interface IPermissionsDto {
  count: number;
  permissions: IPermissionItem[];
}

export interface IPermissionItem {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  description: string;
  isSystem: boolean;
  displayName: string;
}

export interface IRolePermission {
  role: IRole;
  rolePermissions: IRolePermissionItem[];
  permissions?: IPermissionItem[];
  rolePermissionUnits?: IRolePermissionUnitItem[] | [];
}

export interface IRolePermissionUnitItem {
  id: string;
  roleId: string;
  permissionId: string;
  unitId: string;
  createdDate: string;
  modifiedDate: string;
}

export interface IRole {
  name: string;
  description: string;
  displayName?: string;
  id?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IRolePermissionItem {
  permissionId: string;
  unitIds?: string[];
  id?: string;
}

export interface IPageDto {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
}

export interface IRolePermissionsItem {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  roleId: string;
  permissionId: string;
  permissionName: string | null;
  roleName: string | null;
  description: string | null;
}

export interface IRolePermissionDto {
  count: number;
  rolePermissionData: IRolePermissionDataItem[];
}

export interface IRolePermissionDataItem {
  role: IRole;
  permissions: IPermissionItem[];
}

export interface IDeleteRole {
  roleIds: string[];
}

export enum UserRoleEnum {
  Administrator = "Administrator",
  DefaultUser = "StandardUser",
}

export const UserRoleType = {
  [UserRoleEnum.Administrator]: "超級管理員",
  [UserRoleEnum.DefaultUser]: "普通用戶",
};

export enum FunctionalPermissionsEnum {
  CanGetPermissionsByRoles = "CanGetPermissionsByRoles",
  CanGetMessage = "CanGetMessage",
  CanCreateWorkWeChatGroup = "CanCreateWorkWeChatGroup",
  CanUpdateWorkWeChatGroup = "CanUpdateWorkWeChatGroup",
  CanCreateRoleUser = "CanCreateRoleUser",
  CanDeleteRoles = "CanDeleteRoles",
  CanUpdatePermissionsOfRole = "CanUpdatePermissionsOfRole",
  CanSendWorkWeChatAppNotification = "CanSendWorkWeChatAppNotification",
  CanGrantPermissionsIntoRole = "CanGrantPermissionsIntoRole",
  CanSendMessage = "CanSendMessage",
}

export const FunctionalPermissions = {
  [FunctionalPermissionsEnum.CanGetPermissionsByRoles]: "角色權限",
  [FunctionalPermissionsEnum.CanSendMessage]: "信息發送",
  [FunctionalPermissionsEnum.CanGetMessage]: "發送記錄",
  [FunctionalPermissionsEnum.CanCreateWorkWeChatGroup]: "創建群組",
  [FunctionalPermissionsEnum.CanUpdateWorkWeChatGroup]: "添加群組成員",
  [FunctionalPermissionsEnum.CanCreateRoleUser]: "新增角色",
  [FunctionalPermissionsEnum.CanDeleteRoles]: "刪除",
  [FunctionalPermissionsEnum.CanUpdatePermissionsOfRole]: "編輯",
  [FunctionalPermissionsEnum.CanSendWorkWeChatAppNotification]: "發送通知",
  [FunctionalPermissionsEnum.CanGrantPermissionsIntoRole]: "分配",
};
