export interface IPageDto {
  pageIndex: number;
  pageSize: number;
  keyword: string;
}

export interface IRoleDto {
  count: number;
  roles: IRoleItem[];
}

export interface IRoleItem {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  description: string;
}

export interface IDeleteRole {
  roleIds: string[];
}
