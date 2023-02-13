export interface IUserDto {
  id: string
  createdDate: string
  modifiedDate: string
  userName: string
  isActive: boolean
  roles: IUserDataRolesDto[]
}

export interface IUserDataRolesDto {
  id: string
  createdDate: string
  modifiedDate: string
  name: string
}
