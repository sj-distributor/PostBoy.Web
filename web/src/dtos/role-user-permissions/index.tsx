export interface IPageDto {
  pageIndex: number;
  pageSize: number;
}

export interface IRolePermissionDto {
  count: number;
  rolePermissionData: IRolePermissionItem[];
}

export interface IRolePermissionItem {
  role: IRole;
  permissions: IPermissionItem[];
}

export interface IRole {
  name: string;
  description: string;
  id?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IPermissionItem {
  name: string;
  description: string;
  id?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  isSystem: boolean;
}
