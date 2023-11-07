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
import { TreeNode } from "../add-users-model/props";
import { TreeSelectRef } from "./props";
import { IRoleUserItemDto } from "../../../../dtos/role-user-permissions";

export const TreeSelectList: React.FC<{
  treeData: TreeNode[];
  roleUserList: IRoleUserItemDto[];
  searchValue: string;
  ref: React.Ref<TreeSelectRef>;
  setSelectedData: (data: TreeNode[]) => void;
}> = React.forwardRef(
  ({ treeData, searchValue, setSelectedData, roleUserList }, ref) => {
    const {
      isSearch,
      searchDisplayTreeData,
      displayFlatUpdateTreeData,
      selectedNodes,
      expandedNodes,
      indeterminateNodes,
      selectNode,
      toggleNode,
      disabledNodes,
    } = useAction(treeData, searchValue, setSelectedData, roleUserList);

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

      const isDisabled = disabledNodes.has(item.id);

      return (
        <div style={style}>
          <ListItem
            key={item.idRoute.toString()}
            style={{ paddingLeft: `${1.6 * (item.idRoute.length - 1)}rem` }}
          >
            <ListItemIcon>
              <Checkbox
                checked={isSelected}
                indeterminate={isIndeterminate}
                disabled={isDisabled}
                onChange={() => {
                  selectNode(item);
                }}
              />
              {item.isDepartment && (
                <div
                  onClick={() => toggleNode(item)}
                  className={styles.iconWrap}
                >
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
            <ListItemText primary={item.title} className={styles.text} />
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
          itemSize={45}
          width={420}
        >
          {renderListItem}
        </FixedSizeList>
      </Box>
    );
  }
);
