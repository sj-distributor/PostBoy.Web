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
  id?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IRolePermissionItem {
  permissionId: string;
  unitIds?: string[];
  id?: string;
}

export interface IGetPermissionsDto {
  PageIndex: number;
  PageSize: number;
  Keyword?: string;
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

export interface IRoleDto {
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
