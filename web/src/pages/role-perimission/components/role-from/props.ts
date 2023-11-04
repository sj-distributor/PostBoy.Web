import { StaffDepartmentHierarchyList } from "./hook";

export type DepartmentDto = {
  [key: string]: string | boolean | undefined | DepartmentDto[] | string[];
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
  childrens?: DepartmentDto[];
  idRoute?: string[];
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};
