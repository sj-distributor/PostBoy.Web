export interface IPermissionsDto {
  count: number;
  rolePermissions: IPermissionItem[];
}

export interface IPermissionItem {
  id: string,
  createdDate: string,
  lastModifiedDate: string,
  roleId: string,
  roleName: string,
  permissionId: string,
  permissionName: string,
  description: string,
}

export interface IRolePermission {
  role: IRole;
  rolePermissions: IRolePermissionItem[];
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IRolePermissionItem {
  id: string,
  roleId: string,
  permissionId: string,
  unitIds?: string[]
}

export interface IGetPermissionsDto {
  PageIndex: number,
  PageSize: number,
  Keyword: string
}