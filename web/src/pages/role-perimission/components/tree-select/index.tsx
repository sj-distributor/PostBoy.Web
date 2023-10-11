import React from "react";
import { Box } from "@mui/material";
import { FixedSizeList } from "react-window";
import { RenderListItem } from "./components/renderListItem";
import { TreeNode } from "../user-list/components/add-users-model/props";
import { useRenderListItemAction } from "./components/hook";

export const TreeSelectList: React.FC<{
  isSearch: boolean;
  treeData: TreeNode[];
}> = ({ isSearch, treeData }) => {
  const { itemCount } = useRenderListItemAction(isSearch, treeData);

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <FixedSizeList
        height={500}
        itemCount={itemCount}
        itemSize={46}
        width={360}
      >
        {({ index, style }) => (
          <RenderListItem
            index={index}
            style={style}
            isSearch={isSearch}
            treeData={treeData}
          />
        )}
      </FixedSizeList>
    </Box>
  );
};
