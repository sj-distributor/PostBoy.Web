export interface PageDto {
  PageIndex: number;
  PageSize: number;
  RoleId: string;
  UserName?: string;
}

export interface RoleUserResponse {
  count: number;
  roleUsers: RoleUserItemDto[];
}

export interface RoleUserItemDto extends RoleUsersDto {
  createdDate: string;
  modifiedDate: string;
  roleName: string;
  userName: string;
}

export interface RoleUsersDto {
  id: string;
  roleId: string;
  userId: string;
}

export interface AddRoleUsersDto {
  roleUsers: RoleUsersDto[];
}

export interface DeleteRoleUserRequest {
  roleUserIds: string[];
}
