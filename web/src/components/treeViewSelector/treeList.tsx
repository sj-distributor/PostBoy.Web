import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";
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
  const { name, selected, indeterminate } = node;

  const { isExpanded } = getNodeRenderOptions(node);

  useEffect(() => {
    props.measure();
  }, []);

  return (
    <ListItemButton
      key={String(uuidv4())}
      className={`${!indeterminate || styles.mask}`}
      alignItems={"center"}
      sx={{ height: "2.2rem" }}
    >
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
        <span>{name}</span>
        <div
          onClick={() => handleDeptOrUserClick(ClickType.Collapse, node)}
          style={{ position: "relative", marginLeft: 20, height: 24 }}
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
    const arrayToTree = (
      arr: IDepartmentAndUserListValue[]
    ): IDepartmentAndUserListValue | null => {
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
    };
    const tree = arrayToTree(Array.from(foldMap.values()));

    tree && setNodes(Array.isArray(tree) ? tree : [tree]);
  }, [foldMap]);

  return (
    <Tree nodes={nodes} onChange={handleChange}>
      {({ style, node, ...p }) => (
        <div style={{ ...style, width: "auto" }}>
          <FootballPlayerRenderer
            node={node}
            {...p}
            handleDeptOrUserClick={handleDeptOrUserClick}
          >
            <Expandable node={node} {...p} />
          </FootballPlayerRenderer>
        </div>
      )}
    </Tree>
  );
};

export default NodeMeasure;
