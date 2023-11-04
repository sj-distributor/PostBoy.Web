import { StaffDepartmentHierarchyList } from "./hook";

export type DepartmentDto = {
  [key: string]:
    | string
    | boolean
    | undefined
    | StaffDepartmentHierarchyList[]
    | string[];
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
  childrens?: StaffDepartmentHierarchyList[];
  idRoute?: string[];
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};
