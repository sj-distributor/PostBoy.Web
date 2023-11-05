export type DepartmentDto = {
  [key: string]: string | boolean | undefined;
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};

export interface DepartmentType {
  id: string,
  name: string,
  parentId: string
}

export interface UsersDto {
  id: string,
  userName: string
}

export interface DepartmentTreeDto {
  department: DepartmentType,
  staffs: UsersDto[] | [],
  childrens: DepartmentTreeDto[]
}

export interface RolePermissionsDto {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  description: string;
  isSystem: boolean;
  checked?: boolean
}