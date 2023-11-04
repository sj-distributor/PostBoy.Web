import { StaffFoundationHierarchyList } from "./hook";

export type DepartmentDto = {
  [key: string]: string | boolean | undefined | StaffFoundationHierarchyList[];
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
  childrens?: StaffFoundationHierarchyList[];
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};
