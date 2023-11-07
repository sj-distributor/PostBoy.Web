export interface PageDto {
  PageIndex: number;
  PageSize: number;
  RoleId: string;
  Keyword: string;
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
  id?: string;
  roleId: string;
  userId: string;
}

export interface AddRoleUsersDto {
  roleUsers: RoleUsersDto[];
}

export interface DeleteRoleUserRequest {
  roleUserIds: string[];
}

export interface StaffsData {
  id: string;
  userName: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  parentId: string;
}

export interface StaffDepartmentHierarchyListProps {
  childrens: StaffDepartmentHierarchyListProps[];
  department: DepartmentData;
  staffs: StaffsData[];
}

export interface StaffFoundationHierarchyDataRequest {
  staffDepartmentHierarchy: StaffDepartmentHierarchyListProps[];
}

export interface IFoundationTreeDto {
  staffDepartmentHierarchy: DepartmentTreeDto[];
}

export interface DepartmentTreeDto {
  department: DepartmentType;
  staffs: UsersDto[] | [];
  childrens: DepartmentTreeDto[];
}

export interface DepartmentType {
  id: string;
  name: string;
  parentId: string;
}

export interface UsersDto {
  id: string;
  userName: string;
}
