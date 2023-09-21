import React, { Component, useEffect, useState } from "react";

import Tree, {
  renderers as Renderers,
  selectors,
} from "react-virtualized-tree";
import { ClickType, IDepartmentAndUserListValue } from "../../dtos/enterprise";
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import "material-icons/css/material-icons.css";
import { Box, Button, List, TextField } from "@mui/material";
import styles from "./index.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { RefObject } from "react";
import { FixedSizeList } from "react-window";

const { getNodeRenderOptions } = selectors;
const { Expandable } = Renderers;
const SELECT = 2;
const FootballPlayerRenderer = (props: any) => {
  const { node, children, handleDeptOrUserClick, onChange, nodes, foldMap } =
    props;
  const { id, name, state: { selected } = false, indeterminate } = node;

  const { isExpanded } = getNodeRenderOptions(node);

  useEffect(() => {
    props.measure();
  }, []);

  const setIndeterminate = (node: any, indeterminate: boolean) => {
    console.log(nodes);
    const a = (data: any[]) => {
      data.map((item: any) => {
        // console.log(item);
        if (
          node.parents
            ?.slice(
              0,
              node.parents.name !== node.id
                ? node.parents.length - 1
                : node.parents.length
            )
            .find((rItem: any) => rItem === item.id)
        ) {
          console.log(item);
        }
        item.children.length && a(item.children);
      });
    };

    a(nodes);
  };

  // useEffect(() => {
  //   foldMap.forEach((element: any) => {});

  //   const a = (data: any[]) => {
  //     data.map((item: any) => {
  //       console.log(item);

  //       item.children.length && a(item.children);
  //     });

  //     return data;
  //   };
  //   console.log(a(nodes));
  // }, [foldMap]);

  return (
    <ListItemButton key={id + name}>
      <Checkbox
        edge="start"
        checked={selected}
        tabIndex={-1}
        disableRipple
        indeterminate={indeterminate}
        onClick={(e) => {
          e.stopPropagation();

          onChange({
            node: {
              ...node,
              state: {
                ...(node.state || {}),
                selected: !selected,
              },
              selected: !selected,
              indeterminate: indeterminate,
            },
            type: SELECT,
          });
          setIndeterminate(node, indeterminate);

          handleDeptOrUserClick(ClickType.Select, node);
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
        }}
      >
        <b>{name}</b>
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </ListItemButton>
  );
};

const NodeMeasure = (props: {
  data: IDepartmentAndUserListValue[];
  handleDeptOrUserClick: (
    type: ClickType,
    clickedList: IDepartmentAndUserListValue | IDepartmentAndUserListValue[],
    toSelect?: boolean | undefined
  ) => void;
  foldMap: Map<string | number, IDepartmentAndUserListValue>;
}) => {
  const { data, handleDeptOrUserClick, foldMap } = props;
  const [nodes, setNodes] = useState<any>(data);

  const handleChange = (nodes: any) => {
    setNodes(nodes);
  };

  const selectNodes = (nodes: any, selected: any) =>
    nodes.map((n: any) => ({
      ...n,
      children: n.children ? selectNodes(n.children, selected) : [],
      state: {
        ...n.state,
        selected,
      },
    }));

  const nodeSelectionHandler = (nodes: any, updatedNode: any) =>
    nodes.map((node: any) => {
      if (node.name === updatedNode.name) {
        return {
          ...updatedNode,
          children: node.children
            ? selectNodes(node.children, updatedNode.state.selected)
            : [],
        };
      }

      if (node.children) {
        return {
          ...node,
          children: nodeSelectionHandler(node.children, updatedNode),
        };
      }

      return node;
    });

  interface TreeNode {
    id: number;
    idRoute: number[];
    title: string;
    children?: TreeNode[];
  }

  const treeData: IDepartmentAndUserListValue[] = data;
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeRoute: number[]) => {
    const nodeRouteStr = nodeRoute.toString();
    console.log(nodeRoute, "nodeRoute");
    console.log(nodeRouteStr, "nodeRouteStr");

    const expandSet = new Set(expandedNodes);
    const selectSet = new Set(selectedNodes);
    const isSelected = selectedNodes.has(nodeRouteStr);
    if (isSelected) {
      selectSet.delete(nodeRouteStr);
    } else {
      selectSet.add(nodeRouteStr);
    }
    if (expandSet.has(nodeRouteStr)) {
      expandSet.delete(nodeRouteStr);
    } else {
      expandSet.add(nodeRouteStr);
    }
    setExpandedNodes(expandSet);
    setSelectedNodes(selectSet);
  };

  const handleCheckboxChange = (nodeRoute: number[], isChecked: boolean) => {
    const updatedSelectedNodes = new Set(selectedNodes);
    const updatedExpandedNodes = new Set(expandedNodes);
    const nodeRouteStr = nodeRoute.toString();

    if (isChecked) {
      // updatedSelectedNodes.add(nodeRouteStr);
      // updatedExpandedNodes.add(nodeRouteStr);
      // // 选中所有以当前节点的开头的节点
      // flatData.forEach((node) => {
      //   const currentNodeRouteStr = node.idRoute.toString();
      //   if (currentNodeRouteStr.startsWith(nodeRouteStr)) {
      //     updatedSelectedNodes.add(currentNodeRouteStr);
      //   }
      // });
    } else {
      updatedSelectedNodes.delete(nodeRouteStr);
      updatedExpandedNodes.delete(nodeRouteStr);

      // 取消选中所有以当前节点的 idRoute 开头的节点
      flatData.forEach((node) => {
        const currentNodeRouteStr = (node.idRoute ?? []).toString();
        if (currentNodeRouteStr.startsWith(nodeRouteStr)) {
          updatedSelectedNodes.delete(currentNodeRouteStr);
        }
      });
    }

    setSelectedNodes(updatedSelectedNodes);
    setExpandedNodes(updatedExpandedNodes);
  };

  const flattenTree = (
    tree: IDepartmentAndUserListValue[],
    expandedNodes: Set<string>
  ): IDepartmentAndUserListValue[] => {
    const sortedTree: IDepartmentAndUserListValue[] = [];

    const sortAndFlatten = (
      node: IDepartmentAndUserListValue,
      parentRoute: number[] = []
    ): void => {
      const nodeRoute = [...parentRoute, ...(node.idRoute ?? [])];
      sortedTree.push({
        ...node,
        idRoute: nodeRoute,
      });

      if (expandedNodes.has(nodeRoute.toString()) && node.children) {
        node.children.forEach((child) => {
          sortAndFlatten(child, nodeRoute);
        });
      }
    };

    tree.forEach((node) => {
      sortAndFlatten(node);
    });

    return sortedTree;
  };

  const flatData = flattenTree(treeData, expandedNodes);
  console.log(flatData, "flatData");

  const renderListItem: React.FC<{
    index: number;
  }> = ({ index }) => {
    const item = flatData[index];
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedNodes.has((item.idRoute ?? []).toString());
    const isExpanded = expandedNodes.has((item.idRoute ?? []).toString());
    const padding = 2;
    const paddingLeft = padding * ((item.idRoute ?? []).length - 1);

    return (
      <div>
        <ListItem
          key={(item.idRoute ?? []).toString()}
          onClick={() => toggleNode(item.idRoute ?? [])}
          style={{
            paddingLeft: `${paddingLeft}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ListItemIcon>
              <Checkbox
                checked={item.selected}
                indeterminate={item.indeterminate}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(item.idRoute ?? [], !item.isCollapsed);
                }}
              />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </div>
          {item.children.length > 0 &&
            (!!item.isCollapsed ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
      </div>
    );
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <FixedSizeList
        height={500}
        itemCount={flatData.length}
        itemSize={46}
        width={360}
      >
        {renderListItem}
      </FixedSizeList>
    </Box>
  );
};

export default NodeMeasure;
