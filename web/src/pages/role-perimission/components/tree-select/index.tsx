import React from "react";
import {
  Box,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { FixedSizeList } from "react-window";

import { useRenderListItemAction } from "./hook";
import { ArrowDropDownIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "./index.module.scss";
import { TreeNode } from "../add-users-model/props";

export const TreeSelectList: React.FC<{
  treeData: TreeNode[];
  searchValue: string;
}> = ({ treeData, searchValue }) => {
  const {
    isSearch,
    searchDisplayTreeData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    selectNode,
    toggleNode,
  } = useRenderListItemAction(treeData, searchValue);

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
    <>
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
    </>
  );
};
