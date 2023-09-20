import React, { Component, useEffect, useState } from "react";
import "material-icons/css/material-icons.css";

import Tree, {
  renderers as Renderers,
  selectors,
} from "react-virtualized-tree";
import { ClickType, IDepartmentAndUserListValue } from "../../dtos/enterprise";
import { Checkbox, ListItemButton } from "@mui/material";
import { ExpandLess } from "@mui/icons-material";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
const { getNodeRenderOptions } = selectors;
const { Expandable } = Renderers;

const FootballPlayerRenderer = (props: any) => {
  const { node, children, handleDeptOrUserClick } = props;
  const { id, name, selected, indeterminate } = node;
  const { isExpanded } = getNodeRenderOptions(node);

  useEffect(() => {
    props.measure();
    console.log(isExpanded);
  }, []);

  return (
    <ListItemButton>
      <Checkbox
        edge="start"
        checked={selected}
        tabIndex={-1}
        disableRipple
        indeterminate={indeterminate}
        onClick={(e) => {
          e.stopPropagation();
          handleDeptOrUserClick(ClickType.Select, node);
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <b>{name}</b>
        <div style={{ position: "relative" }}>
          <ExpandLess style={{ position: "absolute", right: "0" }}></ExpandLess>
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
}) => {
  const { data, handleDeptOrUserClick } = props;
  const [nodes, setNodes] = useState<any>(data);

  const handleChange = (nodes: any) => {
    setNodes(nodes);
    console.log(nodes);
  };

  return (
    <Tree nodes={nodes} onChange={handleChange}>
      {({ style, ...p }) => (
        <div style={style}>
          <FootballPlayerRenderer
            {...p}
            handleDeptOrUserClick={handleDeptOrUserClick}
          >
            <Expandable {...p} />
          </FootballPlayerRenderer>
        </div>
      )}
    </Tree>
  );
};

export default NodeMeasure;
