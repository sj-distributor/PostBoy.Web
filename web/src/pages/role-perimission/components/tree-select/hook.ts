import { clone, set } from "ramda";
import { useEffect, useMemo, useState } from "react";
import { TreeNode } from "../add-users-model/props";
import { IRoleUserItemDto } from "../../../../dtos/role-user-permissions";

export const useAction = (
  treeData: TreeNode[],
  searchValue: string,
  setSelectedData: (data: TreeNode[]) => void,
  roleUserList: IRoleUserItemDto[]
) => {
  const flatTreeTotalListData = treeData;

  const [expandedNodes, setExpandedNodes] = useState<{
    displayExpandedNodes: Set<string>;
    searchExpandedNodes: Set<string>;
  }>({ displayExpandedNodes: new Set(), searchExpandedNodes: new Set() });

  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  const [indeterminateNodes, setIndeterminateNodes] = useState<Set<string>>(
    new Set()
  );

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState<
    TreeNode[]
  >([]);

  const [searchDisplayTreeData, setSearchDisplayTreeData] = useState<
    TreeNode[]
  >([]);

  const [disabledNodes, setDisabledNodes] = useState<Set<string>>(new Set());

  const isSearch = useMemo(
    () => searchDisplayTreeData.length > 0,
    [searchDisplayTreeData]
  );

  const getCurrentNodeListByCurrentIdRoute = (
    currentList: TreeNode[],
    currentIdRoute: string[]
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

  const handleSearchChange = (value: string) => {
    const targetSearchFilterList = flatTreeTotalListData.filter((item) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });

    const idRouteList = [
      ...new Set(targetSearchFilterList.map(({ idRoute }) => idRoute).flat()),
    ];

    const displayData: TreeNode[] = idRouteList
      .map((nodeId) => flatTreeTotalListData.find(({ id }) => id === nodeId))
      .filter((item) => !!item) as TreeNode[];

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
        displayExpandedNodes: expandedNodes.displayExpandedNodes,
        searchExpandedNodes: new Set(),
      });

      setSearchDisplayTreeData([]);
    }
  };

  const toggleNode = (currentClickItem: TreeNode) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes.displayExpandedNodes);

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
      displayExpandedNodes: newExpandedNodes,
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
      newIndeterminateNode.has(nodeId) && newIndeterminateNode.delete(nodeId);
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

        const allChildrenSelected = matchParentIdItem.childrenIdList.every(
          (childId) => newSelectedNodes.has(childId)
        );

        const allChildrenNotSelected = matchParentIdItem.childrenIdList.every(
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

  //无法选中
  const disableListData = () => {
    const newDisabledNodes = new Set<string>();

    roleUserList.forEach((item) => {
      newDisabledNodes.add(item.userId);
    });

    setDisabledNodes(newDisabledNodes);
  };

  useEffect(() => {
    handleSearchChange(searchValue);

    setSelectedData(
      flatTreeTotalListData.filter(
        (item) =>
          selectedNodes.has(item.id) &&
          !item.isDepartment &&
          !disabledNodes.has(item.id)
      )
    );
  }, [searchValue, selectedNodes]);

  useEffect(() => {
    disableListData();
    if (
      flatTreeTotalListData.length > 0 &&
      displayFlatUpdateTreeData.length === 0
    ) {
      setDisplayFlatUpdateTreeData(
        flatTreeTotalListData.filter((node) => node.idRoute.length === 2)
      );
    }
  }, [flatTreeTotalListData, displayFlatUpdateTreeData]);

  return {
    isSearch,
    searchDisplayTreeData,
    displayFlatUpdateTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    selectNode,
    toggleNode,
    handleSearchChange,
    flatTreeTotalListData,
    disabledNodes,
  };
};
