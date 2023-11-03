import { IDepartmentAndUserListValue } from "../../../../dtos/enterprise";
import { TreeNode } from "../add-users-model/props";

export interface TreeSelectRef {
  selectNode: (item: IDepartmentAndUserListValue) => void;
}
