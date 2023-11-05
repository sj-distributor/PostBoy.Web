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
}

export interface IRolePermission {
  role: IRole;
  rolePermissions: IRolePermissionItem[];
  rolePermissionUnits?: IRolePermissionUnitItem[] | []
}

export interface IRolePermissionUnitItem {
  id: string,
  roleId: string,
  permissionId: string,
  unitId: string,
  createdDate: string,
  modifiedDate: string
}

export interface IRole {
  name: string;
  description: string;
  id?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IRolePermissionItem {
  permissionId: string,
  unitIds?: string[]
  id?: string,
}

export interface IGetPermissionsDto {
  PageIndex: number,
  PageSize: number,
  Keyword: string
}