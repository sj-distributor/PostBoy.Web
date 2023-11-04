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

export interface StaffFoundationHierarchyList {
  companies: StaffDepartmentHierarchyListProps;
  departments: StaffDepartmentHierarchyListProps[];
}

export interface StaffFoundationHierarchyDataRequest {
  staffDepartmentHierarchy: StaffFoundationHierarchyList[];
}
