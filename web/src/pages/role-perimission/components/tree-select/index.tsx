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
import { useAction } from "./hook";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "./index.module.scss";

import { TreeSelectRef } from "./props";
import { IDepartmentAndUserListValue } from "../../../../dtos/enterprise";

export const TreeSelectList: React.FC<{
  treeData: IDepartmentAndUserListValue[];
  searchValue: string;
  ref: React.Ref<TreeSelectRef>;
  setSelectedData: (data: IDepartmentAndUserListValue[]) => void;
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
  } = useAction(treeData, searchValue, setSelectedData);

  useImperativeHandle(ref, () => ({ selectNode }), [selectedNodes]);

  const renderListItem: React.FC<{
    index: number;
    style: React.CSSProperties;
  }> = ({ index, style }) => {
    const item = isSearch
      ? searchDisplayTreeData[index]
      : displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(Number(item.id));

    const isExpanded = isSearch
      ? expandedNodes.searchExpandedNodes.has(Number(item.id))
      : expandedNodes.displayExpandedNodes.has(Number(item.id));

    const isIndeterminate = indeterminateNodes.has(Number(item.id));

    const hasChildren = item.children.length > 0;

    return (
      <div style={style}>
        <ListItem
          key={index}
          style={{
            paddingLeft: `${
              2 * (item.idRoute ? item.idRoute.length - 1 : 0)
            }rem`,
          }}
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
          <ListItemText primary={item.name} />
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
