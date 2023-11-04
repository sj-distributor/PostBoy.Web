export interface TreeNode {
  id: number;
  idRoute: number[];
  title: string;
  childrenIdList?: number[];
  children: TreeNode[];
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

export interface StaffDepartmentHierarchyList {
  companies: StaffDepartmentHierarchyListProps;
  departments: StaffDepartmentHierarchyListProps[];
}
