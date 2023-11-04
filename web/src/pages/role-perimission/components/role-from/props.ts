import { StaffDepartmentHierarchyList } from "./hook";

export type DepartmentDto = {
  [key: string]: string | boolean | undefined | StaffDepartmentHierarchyList[];
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
  childrens?: StaffDepartmentHierarchyList[];
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};
