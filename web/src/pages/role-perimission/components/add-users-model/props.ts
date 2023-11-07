export interface TreeNode {
  id: string;
  idRoute: string[];
  title: string;
  childrenIdList?: string[];
  children: TreeNode[];
  isDepartment?: boolean;
}
