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
import { forEach } from "ramda";

interface TreeNode {
  id: number;
  idRoute: number[];
  title: string;
  children: TreeNode[];
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
                  id: 12,
                  idRoute: [1, 4, 5, 12],
                  title: "节点1-4-5-12",
                  children: [],
                },
                {
                  id: 9,
                  idRoute: [1, 4, 5, 9],
                  title: "节点1-4-5-9",
                  children: [
                    {
                      id: 10,
                      idRoute: [1, 4, 5, 9, 10],
                      title: "节点1-4-5-9-10",
                      children: [],
                    },
                    {
                      id: 11,
                      idRoute: [1, 4, 5, 9, 11],
                      title: "节点1-4-5--9-11",
                      children: [],
                    },
                  ],
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
    {
      id: 15,
      idRoute: [15],
      title: "节点15",
      children: [
        {
          id: 16,
          idRoute: [15, 16],
          title: "节点15-16",
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

      flattenedList.push(node);

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

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState<
    TreeNode[]
  >(flatTreeTotalListData.filter((node) => node.idRoute.length === 1));

  const getChildrenNodeByParentIdRoute = (
    currentList: TreeNode[],
    currentIdRoute: number[]
  ) => {
    return {
      allChildrenIncludeParentList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          currentIdRoute.every(
            (parentIdRoute, index) => parentIdRoute === nodeRoute[index]
          )
      ),
      nextLevelChildrenList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          currentIdRoute.every(
            (parentIdRoute, index) => parentIdRoute === nodeRoute[index]
          ) && nodeRoute.length === currentIdRoute.length + 1
      ),
      allParentList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          nodeRoute.length < currentIdRoute.length &&
          nodeRoute.every(
            (childIdRoute, index) => childIdRoute === currentIdRoute[index]
          )
      ),
    };
  };

  const displayTreeList = (
    flatTreeData: TreeNode[],
    currentClickItem: TreeNode,
    isExistCurrentItem: boolean
  ): TreeNode[] => {
    const displayFlatTreeData = displayFlatUpdateTreeData;

    const parentRoute = currentClickItem.idRoute;

    const currentChildrenItem = getChildrenNodeByParentIdRoute(
      flatTreeData,
      parentRoute
    ).nextLevelChildrenList;

    const currentTotalChildrenItem = getChildrenNodeByParentIdRoute(
      displayFlatTreeData,
      parentRoute
    ).allChildrenIncludeParentList;

    const parentIndex = displayFlatTreeData.findIndex(
      (node) => currentClickItem.id === node.id
    );

    if (parentIndex !== -1) {
      if (isExistCurrentItem) {
        displayFlatTreeData.splice(parentIndex + 1, 0, ...currentChildrenItem);
      } else {
        displayFlatTreeData.splice(
          parentIndex + 1,
          currentTotalChildrenItem.length - 1
        );
      }
    }

    return displayFlatTreeData;
  };

  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set());
  const [indeterminateNodes, setIndeterminateNodes] = useState<Set<number>>(
    new Set()
  );

  const toggleNode = (currentClickItem: TreeNode) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes);

    const expendChildrenList = getChildrenNodeByParentIdRoute(
      flatTreeTotalListData,
      currentClickItem.idRoute
    ).allChildrenIncludeParentList;

    if (newExpandedNodes.has(currentNodeId)) {
      expendChildrenList.forEach(({ id: nodeId }) => {
        newExpandedNodes.delete(nodeId);
      });
    } else {
      newExpandedNodes.add(currentNodeId);
    }

    const currentListData = displayTreeList(
      flatTreeTotalListData,
      currentClickItem,
      newExpandedNodes.has(currentClickItem.id)
    );

    setExpandedNodes(newExpandedNodes);

    setDisplayFlatUpdateTreeData(currentListData);
  };

  const selectNode = (currentClickItem: TreeNode) => {
    const newSelectedNodes = new Set(selectedNodes);

    const newIndeterminateNode = new Set(indeterminateNodes);

    const conditioned = newSelectedNodes.has(currentClickItem.id);

    const currentRoute = currentClickItem.idRoute;

    const {
      allChildrenIncludeParentList: selectTotalItemList,
      allParentList: parentItemList,
    } = getChildrenNodeByParentIdRoute(flatTreeTotalListData, currentRoute);

    const parentNextLevelChildrenList = parentItemList.map((node) => {
      return getChildrenNodeByParentIdRoute(flatTreeTotalListData, node.idRoute)
        .nextLevelChildrenList;
    });

    const nextLevelChildrenlist = parentNextLevelChildrenList.map(
      (nextLevelChildren) => {
        return nextLevelChildren;
      }
    );
    console.log(nextLevelChildrenlist, "nextLevelChildrenlist");

    selectTotalItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newSelectedNodes.delete(nodeId)
        : newSelectedNodes.add(nodeId);
    });

    parentItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newIndeterminateNode.delete(nodeId)
        : newIndeterminateNode.add(nodeId);
    });

    const resultList = nextLevelChildrenlist.map((subList) => {
      return subList.every((item) => newSelectedNodes.has(item.id));
    });

    // const optionList = resultList.map((subList) => {
    //   if(subList){

    //   }
    // });

    setSelectedNodes(newSelectedNodes);
    setIndeterminateNodes(newIndeterminateNode);
  };

  const renderListItem: React.FC<{
    index: number;
    style: React.CSSProperties;
  }> = ({ index, style }) => {
    const item = displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(item.id);

    const isExpanded = expandedNodes.has(item.id);

    const isIndeterminate = indeterminateNodes.has(item.id);

    const hasChildren = item.children.length > 0;

    const paddingLeft = padding * (item.idRoute.length - 1);

    return (
      <div style={style}>
        <ListItem
          key={item.idRoute.toString()}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              indeterminate={isIndeterminate}
              onChange={() => {
                selectNode(item);
              }}
            />
            {hasChildren ? (
              <div onClick={() => toggleNode(item)}>
                {isExpanded ? (
                  <>
                    <ArrowDropDownIcon className={styles.arrowRight} />
                    <FolderIcon className={styles.folder} />
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className={styles.arrowRight} />
                    <FolderIcon className={styles.folder} />
                  </>
                )}
              </div>
            ) : (
              <></>
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
          <Box sx={{ width: "100%", height: 500 }}>
            <FixedSizeList
              height={500}
              itemCount={displayFlatUpdateTreeData.length}
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
