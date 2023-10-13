import React, { useEffect, useImperativeHandle } from "react";
import {
  Box,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useRenderListItemAction } from "./hook";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "./index.module.scss";
import { TreeNode } from "../add-users-model/props";
import { TreeSelectRef } from "./props";

export const TreeSelectList: React.FC<{
  treeData: TreeNode[];
  searchValue: string;
  ref: React.Ref<TreeSelectRef>;
  setSelectedData: (data: TreeNode[]) => void;
}> = React.forwardRef(({ treeData, searchValue, setSelectedData }, ref) => {
  const {
    isSearch,
    searchDisplayTreeData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    selectNode,
    toggleNode,
  } = useRenderListItemAction(treeData, searchValue, setSelectedData);

  useImperativeHandle(ref, () => ({ selectNode }), [selectedNodes]);

  const renderListItem: React.FC<{
    index: number;
    style: React.CSSProperties;
  }> = ({ index, style }) => {
    const item = isSearch
      ? searchDisplayTreeData[index]
      : displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(item.id);

    const isExpanded = isSearch
      ? expandedNodes.searchExpandedNodes.has(item.id)
      : expandedNodes.displayExpandedNodes.has(item.id);

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
              <div onClick={() => toggleNode(item)} className={styles.iconWrap}>
                <div>
                  {isExpanded ? (
                    <ArrowDropDownIcon className={styles.arrowIcon} />
                  ) : (
                    <ArrowRightIcon className={styles.arrowIcon} />
                  )}
                </div>
                <div>
                  <FolderIcon className={styles.folder} />
                </div>
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
});
