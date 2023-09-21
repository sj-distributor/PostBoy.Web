import React, { Component, useEffect, useState } from "react";

import Tree, {
  renderers as Renderers,
  selectors,
} from "react-virtualized-tree";
import { ClickType, IDepartmentAndUserListValue } from "../../dtos/enterprise";
import { Checkbox, ListItemButton } from "@mui/material";
import { ExpandLess } from "@mui/icons-material";
import "material-icons/css/material-icons.css";

const { getNodeRenderOptions } = selectors;
const { Expandable } = Renderers;
const SELECT = 2;
const FootballPlayerRenderer = (props: any) => {
  const { node, children, handleDeptOrUserClick, onChange, setNodes, foldMap } =
    props;
  const { id, name,selected, indeterminate } = node;

  const { isExpanded } = getNodeRenderOptions(node);

  useEffect(() => {
    props.measure();
  }, []);

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

          // onChange({
          //   node: {
          //     ...node,
          //     state: {
          //       ...(node.state || {}),
          //       selected: !selected,
          //     },
          //     selected: !selected,
          //     indeterminate: indeterminate,
          //   },
          //   type: SELECT,
          // });

          node&&  handleDeptOrUserClick(ClickType.Select, node);
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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

  // const selectNodes = (nodes: any, selected: any) =>
  //   nodes.map((n: any) => ({
  //     ...n,
  //     children: n.children ? selectNodes(n.children, selected) : [],
  //     state: {
  //       ...n.state,
  //       selected,
  //     },
  //   }));

  // const nodeSelectionHandler = (nodes: any, updatedNode: any) =>
  //   nodes.map((node: any) => {
  //     if (node.name === updatedNode.name) {
  //       return {
  //         ...updatedNode,
  //         children: node.children
  //           ? selectNodes(node.children, updatedNode.state.selected)
  //           : [],
  //       };
  //     }

  //     if (node.children) {
  //       return {
  //         ...node,
  //         children: nodeSelectionHandler(node.children, updatedNode),
  //       };
  //     }

  //     return node;
  //   });

  useEffect(() => {
    function array2Tree(
      arr: IDepartmentAndUserListValue[]
    ): IDepartmentAndUserListValue | null {
      // 用于id和TreeNode的映射，map<key, value>，可通过id快速查找到树节点，时间复杂度为O(1)
      const treeNode: Map<string, IDepartmentAndUserListValue> = new Map();
      let root = null; // 树根节点
      arr.forEach((item) => {
        const { id, name, parentid, selected, isCollapsed, indeterminate,idRoute } =
          item; // 解构赋值
        // 定义树节点tree node，并使用Map维持id与节点之间的关系
        const node: IDepartmentAndUserListValue = {
          id,
          name,
          type: 1,
          parentid,
          idRoute,
          selected,
          isCollapsed,
          indeterminate,
          children: [],
          department_leader: [],
        };
        treeNode.set(id + "", node);
        // 使用parentId找出parentNode
        const parentNode = treeNode.get(parentid + "");
        if (parentNode) {
          if (parentNode.children == null) {
            parentNode.children = [];
          }
          // 找到父节点后，将当前数组项转换的节点添加到子节点列表中
          parentNode.children.push(node);
        }
        // 在第一次循环中找到根节点，我们假定id=0的表示根节点
        if (parentid + "" === "0") {
          root = node;
        }
      });
      return root;
    }

    const tree = array2Tree(
      foldMap as unknown as IDepartmentAndUserListValue[]
    ); // 需要定义arrs
    console.log(tree);
    tree && setNodes([tree]);
  }, [foldMap]);

  return (
    <Tree
      nodes={nodes}
      onChange={handleChange}
      // extensions={{
      //   updateTypeHandlers: {
      //     [SELECT]: nodeSelectionHandler,
      //   },
      // }}
    >
      {({ style, node, ...p }) => (
        <div style={style}>
          <FootballPlayerRenderer
            node={node}
            {...p}
            handleDeptOrUserClick={handleDeptOrUserClick}
            setNodes={setNodes}
            foldMap={foldMap}
          >
            <Expandable node={node} {...p} />
          </FootballPlayerRenderer>
        </div>
      )}
    </Tree>
  );
};

export default NodeMeasure;
