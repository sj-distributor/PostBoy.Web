export interface TreeNode {
  id: number;
  idRoute: number[];
  title: string;
  childrenIdList?: number[];
  children: TreeNode[];
}

export interface TreeSelectRef {
  selectNode: (item: TreeNode) => void;
}
