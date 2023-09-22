import React, { useEffect, useState } from "react";

import Tree, {
  renderers as Renderers,
  selectors,
} from "react-virtualized-tree";
import {
  ClickType,
  IDepartmentAndUserListValue,
  WorkWeChatTreeStructureType,
} from "../../dtos/enterprise";
import { Checkbox, ListItemButton } from "@mui/material";
import "material-icons/css/material-icons.css";

const { getNodeRenderOptions } = selectors;
const { Expandable } = Renderers;
const FootballPlayerRenderer = (props: any) => {
  const { node, children, handleDeptOrUserClick } = props;
  const { id, name, selected, indeterminate } = node;

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

          node &&
            handleDeptOrUserClick(ClickType.Select, {
              ...node,
              state: { expanded: isExpanded },
            });
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
        <div
          onClick={() => handleDeptOrUserClick(ClickType.Collapse, node)}
          style={{ position: "relative", marginLeft: 20 }}
        >
          {children}
        </div>
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
  schemaType: WorkWeChatTreeStructureType;
}) => {
  const { data, handleDeptOrUserClick, foldMap, schemaType } = props;

  const [nodes, setNodes] = useState<any>(data);

  const handleChange = (nodes: any) => {
    // setNodes(nodes);
  };

  useEffect(() => {
    function array2Tree(
      arr: IDepartmentAndUserListValue[]
    ): IDepartmentAndUserListValue | null {
      const treeNode: Map<string, IDepartmentAndUserListValue> = new Map();

      let root: any = []; // 树根节点
      arr.forEach((item) => {
        const {
          id,
          name,
          parentid,
          selected,
          isCollapsed,
          indeterminate,
          idRoute,
        } = item; // 解构赋值
        // 定义树节点tree node，并使用Map维持id与节点之间的关系
        const node: any = {
          id,
          name,
          type: 1,
          state: { expanded: isCollapsed },
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
          node.id !== parentNode.id && parentNode.children.push(node);
        }
        //idRoute查找根节点
        if (node.idRoute?.length === 1) {
          schemaType
            ? root.push(node)
            : node.idRoute[0] !== node.parentid && root.push(node);
        }
      });

      return root;
    }
    const tree = array2Tree(Array.from(foldMap.values())); // 需要定义arrs

    tree && setNodes(Array.isArray(tree) ? tree : [tree]);
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
