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

export interface RolePermissionsDto {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  description: string;
  isSystem: boolean;
  checked?: boolean;
}

export const groupPermissionsNames = ["创建群组", "发送群聊信息"];
export const informationPermissionsNames = ["信息发送", "发送通知"];
