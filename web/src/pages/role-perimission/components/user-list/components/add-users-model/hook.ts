import { clone } from "ramda";
import { useMemo, useState } from "react";
import { TreeNode } from "./props";

export const useAction = () => {
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
          children: [
            {
              id: 15,
              idRoute: [3, 8, 15],
              title: "节点3-8-15",
              children: [
                {
                  id: 16,
                  idRoute: [3, 8, 15, 16],
                  title: "节点3-8-15-16",
                  children: [],
                },
                {
                  id: 17,
                  idRoute: [3, 8, 15, 17],
                  title: "节点3-8-15-17",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  //平铺树结构
  const flattenTreeTotalList = (
    tree: TreeNode[],
    parentIdRoute: number[] = []
  ): TreeNode[] => {
    let flattenedList: TreeNode[] = [];

    for (const node of tree) {
      const idRoute = [...parentIdRoute, node.id];

      flattenedList.push(node);

      node.children &&
        node.children.length > 0 &&
        flattenedList.push(...flattenTreeTotalList(node.children, idRoute));
    }

    return flattenedList;
  };

  const padding = 2;

  const flatTreeTotalListData = flattenTreeTotalList(treeData);

  const [expandedNodes, setExpandedNodes] = useState<{
    dispalayExpandedNodes: Set<number>;
    searchExpandedNodes: Set<number>;
  }>({ dispalayExpandedNodes: new Set(), searchExpandedNodes: new Set() });

  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set());

  const [indeterminateNodes, setIndeterminateNodes] = useState<Set<number>>(
    new Set()
  );

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState<
    TreeNode[]
  >(flatTreeTotalListData.filter((node) => node.idRoute.length === 1));

  const [searchDisplayTreeData, setSearchDisplayTreeData] = useState<
    TreeNode[]
  >([]);

  const alreadySelectData: string[] = useMemo(() => {
    return Array.from(selectedNodes).map(
      (node) =>
        flatTreeTotalListData.find((item) => item.id === node)?.title || ""
    );
  }, [selectedNodes]);

  const isSearch = useMemo(
    () => searchDisplayTreeData.length > 0,
    [searchDisplayTreeData]
  );

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

  //根据展开插入或删除节点
  const displayTreeList = (
    currentClickItem: TreeNode,
    nextLevelChildrenList: TreeNode[],
    isExpandingCurrentItem: boolean
  ): TreeNode[] => {
    if (isSearch) return searchDisplayTreeData;

    const displayList = clone(displayFlatUpdateTreeData);

    const parentRoute = currentClickItem.idRoute;

    const currentChildrenItem = nextLevelChildrenList;

    const currentTotalChildrenItem = getCurrentNodeListByCurrentIdRoute(
      displayList,
      parentRoute
    ).allChildrenIncludeParentList;

    const parentIndex = displayList.findIndex(
      (node) => currentClickItem.id === node.id
    );

    if (parentIndex !== -1) {
      if (isExpandingCurrentItem) {
        displayList.splice(parentIndex + 1, 0, ...currentChildrenItem);
      } else {
        displayList.splice(
          parentIndex + 1,
          currentTotalChildrenItem.length - 1
        );
      }
    }

    return displayList;
  };

  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    const targetSearchFilterList = flatTreeTotalListData.filter((item) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
    const idRouteList = [
      ...new Set(...targetSearchFilterList.map(({ idRoute }) => idRoute)),
    ];

    const displayData: TreeNode[] = idRouteList
      .map((nodeId) => flatTreeTotalListData.find(({ id }) => id === nodeId))
      .filter((item): item is TreeNode => !!item);

    if (value !== "") {
      setExpandedNodes((prevExpandedNodes) => ({
        ...prevExpandedNodes,
        searchExpandedNodes: new Set([
          ...prevExpandedNodes.searchExpandedNodes,
          ...idRouteList,
        ]),
      }));
      setSearchDisplayTreeData(displayData);
    } else {
      setExpandedNodes({
        dispalayExpandedNodes: expandedNodes.dispalayExpandedNodes,
        searchExpandedNodes: new Set(),
      });
      setSearchDisplayTreeData([]);
    }
  };

  const toggleNode = (currentClickItem: TreeNode) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes.dispalayExpandedNodes);

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

    if (!isSearch)
      newExpandedNodes.has(currentNodeId)
        ? expendChildrenNodeList.forEach(({ id: nodeId }) => {
            newExpandedNodes.delete(nodeId);
          })
        : newExpandedNodes.add(currentNodeId);

    const currentListData = displayTreeList(
      currentClickItem,
      expendNextLevelChildrenList,
      newExpandedNodes.has(currentClickItem.id)
    );

    setExpandedNodes({
      dispalayExpandedNodes: newExpandedNodes,
      searchExpandedNodes: new Set(),
    });

    isSearch
      ? setSearchDisplayTreeData(currentListData)
      : setDisplayFlatUpdateTreeData(currentListData);
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
      if (newIndeterminateNode.has(nodeId)) {
        newIndeterminateNode.delete(nodeId);
      }
    });

    parentItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newIndeterminateNode.delete(nodeId)
        : newIndeterminateNode.add(nodeId);
    });

    const parentIdRoute = currentRoute.slice(0, -1).reverse();

    parentIdRoute.forEach((parentId) => {
      const matchParentIdItem = flatTreeTotalListData.find(
        (item) => item.id === parentId
      );

      if (matchParentIdItem) {
        const { nextLevelChildrenList: expendNextLevelChildrenList } =
          getCurrentNodeListByCurrentIdRoute(
            flatTreeTotalListData,
            matchParentIdItem.idRoute
          );
        matchParentIdItem.childrenIdList = expendNextLevelChildrenList.map(
          ({ id }) => id
        );
      }

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
    isSearch,
    displayFlatUpdateTreeData,
    searchDisplayTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    padding,
    selectNode,
    toggleNode,
    handleSearchChange,
  };
};
