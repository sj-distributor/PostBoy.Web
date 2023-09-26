import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";
import Tree, { renderers as Renderers } from "react-virtualized-tree";
import {
  ClickType,
  IDepartmentAndUserListValue,
  WorkWeChatTreeStructureType,
} from "../../dtos/enterprise";
import { Checkbox, ListItemButton } from "@mui/material";
import "material-icons/css/material-icons.css";

const { Expandable } = Renderers;

const expandData = new Map();

const FootballPlayerRenderer = (props: any) => {
  const { node, children, handleDeptOrUserClick, onChange } = props;
  const { name, selected, indeterminate, idRoute, id } = node;

  useEffect(() => {
    props.measure();
  }, []);

  return (
    <ListItemButton
      key={String(uuidv4())}
      className={`${!indeterminate || styles.mask}`}
      alignItems={"center"}
      sx={{
        height: "2.2rem",
        marginLeft: 2 * (name !== id ? idRoute.length - 1 : idRoute.length),
      }}
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
          width: "100%",
        }}
        onClick={() => {
          if (node.children.length) {
            expandData.set(node.name, !node.state.expanded);
            onChange({
              node: {
                ...node,
                state: {
                  ...(node.state || {}),
                  expanded: !node.state.expanded,
                },
              },
              type: 2,
            });
          }
        }}
      >
        <span>{name}</span>
        <div style={{ position: "relative", marginLeft: 20, height: 24 }}>
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
    setNodes(nodes);
  };

  useEffect(() => {
    const expandArr = Array.from(expandData);

    const arrayToTree = (
      oneDimensionArray: IDepartmentAndUserListValue[]
    ): IDepartmentAndUserListValue | null => {
      const treeNode: Map<string, IDepartmentAndUserListValue> = new Map();

      let root: any = []; // 树根节点
      oneDimensionArray.forEach((item) => {
        const {
          id,
          name,
          parentid,
          selected,
          isCollapsed,
          indeterminate,
          idRoute,
        } = item;

        const isExpanded = expandArr.find((item) => item[0] === name);
        // 定义树节点tree node，并使用Map维持id与节点之间的关系
        const node: any = {
          id,
          name,
          type: 1,
          state: { expanded: isExpanded ? isExpanded[1] : isCollapsed },
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
        <div style={{ ...style, marginLeft: 0 }}>
          <FootballPlayerRenderer
            node={node}
            {...p}
            handleDeptOrUserClick={handleDeptOrUserClick}
            setNodes={setNodes}
          >
            <Expandable node={node} {...p} />
          </FootballPlayerRenderer>
        </div>
      )}
    </Tree>
  );
};

export default NodeMeasure;
