import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import styles from "./index.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAction } from "./hook";
import { ModalBoxRef } from "../../../../../../dtos/modal";
import { RefObject, useState } from "react";
import { FixedSizeList } from "react-window";

interface TreeNode {
  id: number;
  idRoute: number[];
  title: string;
  children?: TreeNode[];
}

export const AddUsersModel = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
}) => {
  const { addUsersRef } = props;

  const { alreadySelectData } = useAction();

  const treeData: TreeNode[] = [
    {
      id: 1,
      idRoute: [1],
      title: "节点1",
      children: [
        {
          id: 4,
          idRoute: [1, 4],
          title: "节点1-4",
          children: [
            {
              id: 5,
              idRoute: [1, 4, 5],
              title: "节点1-4-5",
              children: [
                {
                  id: 6,
                  idRoute: [1, 4, 5, 6],
                  title: "节点1-4-5-6",
                  children: [],
                },
                {
                  id: 9,
                  idRoute: [1, 4, 5, 9],
                  title: "节点1-4-5-9",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      idRoute: [2],
      title: "节点2",
      children: [
        {
          id: 7,
          idRoute: [2, 7],
          title: "节点2-7",
          children: [],
        },
      ],
    },
    {
      id: 3,
      idRoute: [3],
      title: "节点3",
      children: [
        {
          id: 8,
          idRoute: [3, 8],
          title: "节点3-8",
          children: [],
        },
      ],
    },
  ];

  const padding = 2;

  const flattenTreeTotalList = (
    tree: TreeNode[],
    parentIdRoute: number[] = []
  ): TreeNode[] => {
    let flattenedList: TreeNode[] = [];

    for (const node of tree) {
      const idRoute = [...parentIdRoute, node.id];

      flattenedList.push({
        id: node.id,
        idRoute: node.idRoute,
        title: node.title,
      });

      if (node.children && node.children.length > 0) {
        flattenedList = [
          ...flattenedList,
          ...flattenTreeTotalList(node.children, idRoute),
        ];
      }
    }

    return flattenedList;
  };

  const flatTreeTotalListData = flattenTreeTotalList(treeData);

  // 打印平铺结构数据
  console.log(flatTreeTotalListData, "flatTreeTotalListData");

  const flattenTree = (
    tree: TreeNode[],
    expandedNodes: Set<string>
  ): TreeNode[] => {
    const sortedTree: TreeNode[] = [];

    const sortAndFlatten = (
      node: TreeNode,
      parentRoute: number[] = []
    ): void => {
      const nodeRoute = [...parentRoute, ...node.idRoute];
      sortedTree.push({ ...node, idRoute: nodeRoute });

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

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeRoute: number[]) => {
    const nodeRouteStr = nodeRoute.toString();
    console.log(nodeRoute, "nodeRoute");
    console.log(nodeRouteStr, "nodeRouteStr");
    const isSelected = selectedNodes.has(nodeRouteStr);
    if (isSelected) {
      selectedNodes.delete(nodeRouteStr);
    } else {
      selectedNodes.add(nodeRouteStr);
    }
    if (expandedNodes.has(nodeRouteStr)) {
      expandedNodes.delete(nodeRouteStr);
    } else {
      expandedNodes.add(nodeRouteStr);
    }
    setExpandedNodes(new Set(expandedNodes));
    setSelectedNodes(new Set(selectedNodes));
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
        const currentNodeRouteStr = node.idRoute.toString();
        if (currentNodeRouteStr.startsWith(nodeRouteStr)) {
          updatedSelectedNodes.delete(currentNodeRouteStr);
        }
      });
    }

    setSelectedNodes(updatedSelectedNodes);
    setExpandedNodes(updatedExpandedNodes);
  };

  const flatData = flattenTree(treeData, expandedNodes);
  console.log(flatData, "flatData");

  const renderListItem: React.FC<{
    index: number;
  }> = ({ index }) => {
    const item = flatData[index];
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedNodes.has(item.idRoute.toString());
    const isExpanded = expandedNodes.has(item.idRoute.toString());

    const paddingLeft = padding * (item.idRoute.length - 1);

    return (
      <div>
        <ListItem
          key={item.idRoute.toString()}
          onClick={() => toggleNode(item.idRoute)}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(item.idRoute, !isSelected);
              }}
            />
            {hasChildren ? (
              isExpanded ? (
                <>
                  <ArrowDropDownIcon
                    className={styles.arrowRight}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FolderIcon className={styles.folder} />
                </>
              ) : (
                <>
                  <ArrowRightIcon
                    className={styles.arrowRight}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FolderIcon className={styles.folder} />
                </>
              )
            ) : (
              <>
                <FolderIcon className={styles.folder} />
              </>
            )}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </div>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.leftGroupBox}>
        <TextField
          sx={{
            input: {
              height: "1.5rem",
              paddingX: ".5rem",
              paddingY: ".15rem",
              borderColor: "grey.500",
              fontSize: "0.6rem",
              lineHeight: "0.625rem",
            },
          }}
          type="search"
          className={styles.search}
          placeholder="搜索"
          size="small"
        />
        <div>
          <div className={styles.listTitle}>OPERATION INC.</div>
          {/* <List>
            <ListItem>
              <Checkbox defaultChecked />
              <ListItemIcon>
                <ArrowRightIcon className={styles.arrowRight} />
                <FolderIcon className={styles.folder} />
              </ListItemIcon>
              <ListItemText primary="Single-line item" />
            </ListItem>
          </List> */}
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
        </div>
      </div>
      <div className={styles.rightGroupBox}>
        <div className={styles.countBox}>
          <div className={styles.selectTitleWrap}>
            <div>已選{alreadySelectData.length}個用戶</div>
            <CloseIcon
              className={styles.cancel}
              onClick={() => addUsersRef.current?.close()}
            />
          </div>
          <div>
            {alreadySelectData.map((selectItems: string, index: number) => {
              return (
                <div className={styles.selectListWrap} key={index}>
                  <div>{selectItems}</div>
                  <CloseIcon className={styles.delete} />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.buttonBox}>
          <Button variant="contained" className={styles.button}>
            確認
          </Button>
          <Button
            variant="outlined"
            className={styles.button}
            onClick={() => addUsersRef.current?.close()}
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  );
};
