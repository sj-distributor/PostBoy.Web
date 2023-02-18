export interface IUserResponse {
  id: string
  createdDate: string
  modifiedDate: string
  userName: string
  isActive: boolean
  roles: IUserDataRolesData[]
}

export interface IUserDataRolesData {
  id: string
  createdDate: string
  modifiedDate: string
  name: string
}

export interface IUserApikeysResponse {
  id: string
  userAccountId: string
  apiKey: string
  description: string
}

export interface IUserApikeyAddData {
  apiKey: string
  description: string
  userAccountId: string
}
