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

  return (
    <Tree
      nodes={nodes}
      onChange={handleChange}
      extensions={{
        updateTypeHandlers: {
          [SELECT]: nodeSelectionHandler,
        },
      }}
    >
      {({ style, node, ...p }) => (
        <div style={style}>
          <FootballPlayerRenderer
            node={node}
            {...p}
            handleDeptOrUserClick={handleDeptOrUserClick}
            nodes={nodes}
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
