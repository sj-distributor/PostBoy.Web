export interface IPermissionsDto {
  count: number;
  permissions: IPermissionItem[];
}

export interface IPermissionItem {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  permissionDescription: string;
  isSystem: boolean;
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
  id: string;
  roleId: string;
  permissionId: string;
  createdDate?: string;
  lastModifiedDate?: string;
  permissionName?: string;
  roleName?: string;
  description?: string;
}
