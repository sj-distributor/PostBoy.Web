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
                  id: 9,
                  idRoute: [1, 4, 5, 9],
                  title: "节点1-4-5-9",
                  children: [
                    {
                      id: 10,
                      idRoute: [1, 4, 5, 9, 10],
                      title: "节点1-4-5-10",
                      children: [],
                    },
                    {
                      id: 11,
                      idRoute: [1, 4, 5, 9, 11],
                      title: "节点1-4-5-11",
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

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState(
    flatTreeTotalListData.filter((node) => node.idRoute.length === 1)
  );

  const getChildrenNodeByParentId = (
    currentList: TreeNode[],
    parentIdRoute: number[]
  ) => {
    return {
      allChildrenIncludeParentList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          nodeRoute.toString().includes(parentIdRoute.toString())
      ),
      nextLevelChildrenList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          nodeRoute.toString().includes(parentIdRoute.toString()) &&
          nodeRoute.length === parentIdRoute.length + 1
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

    const currentChildrenItem = getChildrenNodeByParentId(
      flatTreeData,
      parentRoute
    ).nextLevelChildrenList;

    const currentTotalChildrenItem = getChildrenNodeByParentId(
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

  const toggleNode = (currentClickItem: TreeNode) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes);

    const expendChildrenList = getChildrenNodeByParentId(
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

    const conditioned = newSelectedNodes.has(currentClickItem.id);

    const parentRoute = currentClickItem.idRoute;

    const selectTotalItemList = getChildrenNodeByParentId(
      flatTreeTotalListData,
      parentRoute
    ).allChildrenIncludeParentList;

    selectTotalItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newSelectedNodes.delete(nodeId)
        : newSelectedNodes.add(nodeId);
    });

    setSelectedNodes(newSelectedNodes);
  };

  const renderListItem: React.FC<{
    index: number;
  }> = ({ index }) => {
    const item = displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(item.id);

    const isExpanded = expandedNodes.has(item.id);

    const hasChildren = item.children.length > 0;

    const paddingLeft = padding * (item.idRoute.length - 1);

    return (
      <div>
        <ListItem
          key={item.idRoute.toString()}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              onChange={(e) => {
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
