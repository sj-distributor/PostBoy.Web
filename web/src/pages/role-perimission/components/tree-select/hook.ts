import { clone } from "ramda";
import { useEffect, useMemo, useState } from "react";
import { IDepartmentAndUserListValue } from "../../../../dtos/enterprise";

export const useAction = (
  treeData: IDepartmentAndUserListValue[],
  searchValue: string,
  setSelectedData: (data: IDepartmentAndUserListValue[]) => void
) => {
  //平铺树结构
  const flattenTreeTotalList = (
    tree: IDepartmentAndUserListValue[],
    parentIdRoute: number[] = []
  ): IDepartmentAndUserListValue[] => {
    let flattenedList: IDepartmentAndUserListValue[] = [];

    for (const node of tree) {
      const idRoute = [...parentIdRoute, node.id];

      flattenedList.push(node);

      node.children &&
        node.children.length > 0 &&
        flattenedList.push(
          ...flattenTreeTotalList(node.children, [Number(idRoute)])
        );
    }

    return flattenedList;
  };

  const flatTreeTotalListData = flattenTreeTotalList(treeData);

  const [expandedNodes, setExpandedNodes] = useState<{
    displayExpandedNodes: Set<number | undefined>;
    searchExpandedNodes: Set<number | undefined>;
  }>({ displayExpandedNodes: new Set(), searchExpandedNodes: new Set() });

  const [selectedNodes, setSelectedNodes] = useState<Set<number | undefined>>(
    new Set()
  );

  const [indeterminateNodes, setIndeterminateNodes] = useState<
    Set<number | undefined>
  >(new Set());

  const [displayFlatUpdateTreeData, setDisplayFlatUpdateTreeData] = useState<
    IDepartmentAndUserListValue[]
  >(flatTreeTotalListData.filter((node) => node.idRoute?.length === 1));

  const [searchDisplayTreeData, setSearchDisplayTreeData] = useState<
    IDepartmentAndUserListValue[]
  >([]);

  const isSearch = useMemo(
    () => searchDisplayTreeData.length > 0,
    [searchDisplayTreeData]
  );

  const getCurrentNodeListByCurrentIdRoute = (
    currentList: IDepartmentAndUserListValue[],
    currentIdRoute: number[]
  ) => {
    return {
      allChildrenIncludeParentList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          currentIdRoute.every(
            (parentIdRoute, index) =>
              nodeRoute && parentIdRoute === nodeRoute[index]
          )
      ),
      nextLevelChildrenList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          currentIdRoute.every(
            (parentIdRoute, index) =>
              nodeRoute && parentIdRoute === nodeRoute[index]
          ) && nodeRoute?.length === currentIdRoute.length + 1
      ),
      allParentList: currentList.filter(
        ({ idRoute: nodeRoute }) =>
          nodeRoute &&
          nodeRoute.length < currentIdRoute.length &&
          nodeRoute.every(
            (childIdRoute, index) => childIdRoute === currentIdRoute[index]
          )
      ),
    };
  };

  //根据展开插入或删除节点
  const displayTreeList = (
    currentClickItem: IDepartmentAndUserListValue,
    nextLevelChildrenList: IDepartmentAndUserListValue[],
    isExpandingCurrentItem: boolean
  ): IDepartmentAndUserListValue[] => {
    if (isSearch) return searchDisplayTreeData;

    const displayList = clone(displayFlatUpdateTreeData);

    const parentRoute = currentClickItem.idRoute;

    const currentChildrenItem = nextLevelChildrenList;

    const currentTotalChildrenItem = getCurrentNodeListByCurrentIdRoute(
      displayList,
      parentRoute ?? []
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
      return item.name.toLowerCase().includes(value.toLowerCase());
    });

    const idRouteList = [
      ...new Set(targetSearchFilterList.map(({ idRoute }) => idRoute).flat()),
    ];

    const displayData: IDepartmentAndUserListValue[] = idRouteList
      .map((nodeId) => flatTreeTotalListData.find(({ id }) => id === nodeId))
      .filter((item): item is IDepartmentAndUserListValue => !!item);

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

  const toggleNode = (currentClickItem: any) => {
    const currentNodeId = currentClickItem.id;

    const newExpandedNodes = new Set(expandedNodes.displayExpandedNodes);

    const {
      allChildrenIncludeParentList: expendChildrenNodeList,
      nextLevelChildrenList: expendNextLevelChildrenList,
    } = getCurrentNodeListByCurrentIdRoute(
      flatTreeTotalListData,
      currentClickItem.idRoute ?? []
    );

    currentClickItem.childrenIdList = expendNextLevelChildrenList.map(
      ({ id }) => id
    );

    if (!isSearch)
      newExpandedNodes.has(currentNodeId)
        ? expendChildrenNodeList.forEach(({ id: nodeId }) => {
            newExpandedNodes.delete(Number(nodeId));
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

  const selectNode = (currentClickItem: IDepartmentAndUserListValue) => {
    const newSelectedNodes = new Set(selectedNodes);

    const newIndeterminateNode = new Set(indeterminateNodes);

    const conditioned = newSelectedNodes.has(Number(currentClickItem.id));

    const currentRoute = currentClickItem.idRoute;

    const {
      allChildrenIncludeParentList: selectTotalItemList,
      allParentList: parentItemList,
    } = getCurrentNodeListByCurrentIdRoute(
      flatTreeTotalListData,
      currentRoute ?? []
    );

    selectTotalItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newSelectedNodes.delete(Number(nodeId))
        : newSelectedNodes.add(Number(nodeId));
      newIndeterminateNode.has(Number(nodeId)) &&
        newIndeterminateNode.delete(Number(nodeId));
    });

    parentItemList.forEach(({ id: nodeId }) => {
      conditioned
        ? newIndeterminateNode.delete(Number(nodeId))
        : newIndeterminateNode.add(Number(nodeId));
    });

    const parentIdRoute = currentRoute?.slice(0, -1).reverse();

    parentIdRoute?.forEach((parentId) => {
      const matchParentIdItem: any = flatTreeTotalListData.find(
        (item) => item.id === parentId
      );

      if (matchParentIdItem) {
        const { nextLevelChildrenList: expendNextLevelChildrenList } =
          getCurrentNodeListByCurrentIdRoute(
            flatTreeTotalListData,
            matchParentIdItem.idRoute ?? []
          );

        matchParentIdItem.childrenIdList = expendNextLevelChildrenList.map(
          ({ id }) => id
        );

        const allChildrenSelected = matchParentIdItem.childrenIdList.every(
          (childId: number) => newSelectedNodes.has(childId)
        );

        const allChildrenNotSelected = matchParentIdItem.childrenIdList.every(
          (childId: number) =>
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

  useEffect(() => {
    handleSearchChange(searchValue);

    setSelectedData(
      flatTreeTotalListData.filter(
        (item) =>
          selectedNodes.has(Number(item.id)) && item.children.length === 0
      )
    );
  }, [searchValue, selectedNodes]);

  useEffect(() => {
    treeData.length && setDisplayFlatUpdateTreeData(treeData);
    console.log(treeData);
  }, [treeData]);

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
  };
};
