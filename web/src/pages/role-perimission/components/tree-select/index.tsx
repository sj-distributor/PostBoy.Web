import React from "react";
import {
  Box,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { TreeNode } from "../user-list/components/add-users-model/props";
import { useRenderListItemAction } from "./components/hook";
import { ArrowDropDownIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "././components/index.module.scss";

export const TreeSelectList: React.FC<{
  isSearch: boolean;
  treeData: TreeNode[];
}> = ({ isSearch, treeData }) => {
  const {
    searchDisplayTreeData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    selectNode,
    toggleNode,
  } = useRenderListItemAction(isSearch, treeData);

  const renderListItem: React.FC<{
    index: number;
    style: React.CSSProperties;
  }> = ({ index, style }) => {
    const item = isSearch
      ? searchDisplayTreeData[index]
      : displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(item.id);

    const isExpanded = expandedNodes.displayExpandedNodes.has(item.id);

    const isIndeterminate = indeterminateNodes.has(item.id);

    const hasChildren = item.children.length > 0;

    return (
      <div style={style}>
        <ListItem
          key={item.idRoute.toString()}
          style={{ paddingLeft: `${2 * (item.idRoute.length - 1)}rem` }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              indeterminate={isIndeterminate}
              onChange={() => {
                selectNode(item);
              }}
            />
            {hasChildren && (
              <div onClick={() => toggleNode(item)}>
                {isExpanded ? (
                  <ArrowDropDownIcon className={styles.arrowIcon} />
                ) : (
                  <ArrowRightIcon className={styles.arrowIcon} />
                )}
                <FolderIcon className={styles.folder} />
              </div>
            )}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </div>
    );
  };

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <FixedSizeList
        height={500}
        itemCount={
          isSearch
            ? searchDisplayTreeData.length
            : displayFlatUpdateTreeData.length
        }
        itemSize={46}
        width={360}
      >
        {renderListItem}
      </FixedSizeList>
    </Box>
  );
};
