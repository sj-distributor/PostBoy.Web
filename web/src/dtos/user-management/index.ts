export interface IUserResponse {
  id: string;
  createdDate: string;
  modifiedDate: string;
  userName: string;
  isActive: boolean;
  roles: IUserDataRolesData[];
}
export interface IUserAllResponse {
  count: number;
  users: IUserListItem[];
}
export interface IUserListItem {
  id: string;
  createdDate: string;
  modifiedDate: string;
  userName: string;
  isActive: boolean;
  thirdPartyUserId: string;
  issuer: number;
  roles: IUserDataRolesData[];
  permissions: IPermissionsItem[];
}

export interface IPermissionsItem {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  displayName: string | null;
  description: string;
  isSystem: boolean;
}

export interface IUserDataRolesData {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
}

export interface IUserApikeysResponse {
  id: string;
  userAccountId: string;
  apiKey: string;
  description: string;
}

export interface IUserApikeyAddData {
  apiKey: string;
  description: string;
  userAccountId: string;
}

export interface IGetAllUserDto {
  Page: number;
  PageSize: number;
  UserName?: string;
}
