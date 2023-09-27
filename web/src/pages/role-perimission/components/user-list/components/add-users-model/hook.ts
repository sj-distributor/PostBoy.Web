import { useEffect, useState } from "react";
import { TreeNode } from "./props";

export const useAction = () => {
  const alreadySelectData: string[] = [
    "AAAAAAAAA.A",
    "AAAAAAAAA.A",
    "AAAAAAAAA.A",
    "AAAAAAAAA.A",
    "AAAAAAAAA.A",
  ];

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

  const padding = 2;

  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set());

  const [indeterminateNodes, setIndeterminateNodes] = useState<Set<number>>(
    new Set()
  );

  const flatTreeTotalListData = flattenTreeTotalList(treeData);

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState<
    TreeNode[]
  >(flatTreeTotalListData.filter((node) => node.idRoute.length === 1));

  const getCurrentNodeListByCurrentIdRoute = (
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

    const currentChildrenItem = getCurrentNodeListByCurrentIdRoute(
      flatTreeData,
      parentRoute
    ).nextLevelChildrenList;

    const currentTotalChildrenItem = getCurrentNodeListByCurrentIdRoute(
      displayFlatTreeData,
      parentRoute
    ).allChildrenIncludeParentList;

    const parentIndex = displayFlatTreeData.findIndex(
      (node: TreeNode) => currentClickItem.id === node.id
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

  const toggleNode = (currentClickItem: TreeNode) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes);

    const {
      allChildrenIncludeParentList: expendChildrenNodeList,
      nextLevelChildrenList: expendNextLevelChildrenList,
    } = getCurrentNodeListByCurrentIdRoute(
      flatTreeTotalListData,
      currentClickItem.idRoute
    );

    currentClickItem.childrenIdList = expendNextLevelChildrenList.map(
      ({ id }) => id
    );

    if (newExpandedNodes.has(currentNodeId)) {
      expendChildrenNodeList.forEach(({ id: nodeId }) => {
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
    } = getCurrentNodeListByCurrentIdRoute(flatTreeTotalListData, currentRoute);

    selectTotalItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newSelectedNodes.delete(nodeId)
        : newSelectedNodes.add(nodeId);
    });
    !conditioned && newIndeterminateNode.clear();
    parentItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newIndeterminateNode.delete(nodeId)
        : newIndeterminateNode.add(nodeId);
    });

    const parentIdRoute = currentRoute.slice(0, -1).reverse();

    parentIdRoute.forEach((parentId) => {
      const matchParentIdItem = displayFlatUpdateTreeData.find(
        (item) => item.id === parentId
      );

      if (matchParentIdItem?.childrenIdList) {
        const allChildrenSelected = matchParentIdItem?.childrenIdList.every(
          (childId) => newSelectedNodes.has(childId)
        );

        const allChildrenNotSelected = matchParentIdItem?.childrenIdList.every(
          (childId) =>
            !newSelectedNodes.has(childId) && !newIndeterminateNode.has(childId)
        );

        if (allChildrenSelected) {
          newIndeterminateNode.delete(matchParentIdItem.id);
          newSelectedNodes.add(matchParentIdItem.id);
        } else {
          newSelectedNodes.delete(matchParentIdItem.id);
          !allChildrenNotSelected &&
            newIndeterminateNode.add(matchParentIdItem.id);
        }
      }
    });

    setSelectedNodes(newSelectedNodes);
    setIndeterminateNodes(newIndeterminateNode);
  };

  return {
    alreadySelectData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    padding,
    selectNode,
    toggleNode,
  };
};
