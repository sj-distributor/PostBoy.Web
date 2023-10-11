import React from "react";
import { ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./index.module.scss";
import { TreeNode } from "../../user-list/components/add-users-model/props";
import { useRenderListItemAction } from "./hook";

export const RenderListItem: React.FC<{
  index: number;
  style: React.CSSProperties;
  isSearch: boolean;
  treeData: TreeNode[];
}> = ({ index, style, isSearch, treeData }) => {
  const {
    searchDisplayTreeData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    selectNode,
    toggleNode,
  } = useRenderListItemAction(isSearch, treeData);

  const displayListData = isSearch
    ? searchDisplayTreeData[index]
    : displayFlatUpdateTreeData[index];

  const isSelected = selectedNodes.has(displayListData.id);

  const isExpanded = expandedNodes.displayExpandedNodes.has(displayListData.id);

  const isIndeterminate = indeterminateNodes.has(displayListData.id);

  const hasChildren = displayListData.children.length > 0;

  return (
    <div style={style}>
      <ListItem
        key={displayListData.idRoute.toString()}
        style={{
          paddingLeft: `${2 * (displayListData.idRoute.length - 1)}rem`,
        }}
      >
        <ListItemIcon>
          <Checkbox
            checked={isSelected}
            indeterminate={isIndeterminate}
            onChange={() => {
              selectNode(displayListData);
            }}
          />
          {hasChildren && (
            <div onClick={() => toggleNode(displayListData)}>
              {isExpanded ? (
                <ArrowDropDownIcon className={styles.arrowIcon} />
              ) : (
                <ArrowRightIcon className={styles.arrowIcon} />
              )}
              <FolderIcon className={styles.folder} />
            </div>
          )}
        </ListItemIcon>
        <ListItemText primary={displayListData.title} />
      </ListItem>
    </div>
  );
};
