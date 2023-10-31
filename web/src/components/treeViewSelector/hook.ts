import { clone, difference, remove } from "ramda";
import { useEffect, useState } from "react";
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise";
import useDeptUserData from "../../hooks/deptUserData";
import { ITreeViewHookProps, SourceType } from "./props";

const useAction = ({
  appId,
  defaultSelectedList,
  flattenData,
  foldData,
  sourceType,
  settingSelectedList,
}: ITreeViewHookProps) => {
  const { deduplicationArray } = useDeptUserData({ appId });

  const [selectedList, setSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >(
    defaultSelectedList?.map((item) => ({
      ...item,
      idRoute: flattenData.find((cell) => cell.id === item.id)?.idRoute,
    })) ?? []
  );

  const [foldList, setFoldList] = useState<IDepartmentAndUserListValue[]>(
    clone(foldData)
  );

  const [flattenList, setFlattenList] = useState<IDepartmentAndUserListValue[]>(
    clone(flattenData)
  );

  // 处理部门列表能否被选择
  const handleTypeIsCanSelect = (
    canSelect: DeptUserCanSelectStatus,
    type: DepartmentAndUserType
  ) => {
    if (canSelect === DeptUserCanSelectStatus.Both) return true;
    return type === DepartmentAndUserType.Department
      ? canSelect === DeptUserCanSelectStatus.Department
      : canSelect === DeptUserCanSelectStatus.User;
  };

  function findNodeByIdRoute(
    node: IDepartmentAndUserListValue,
    idRoute: number[]
  ): IDepartmentAndUserListValue | undefined {
    if (idRoute.length === 0 || node.id !== idRoute[0]) {
      return undefined;
    }

    if (idRoute.length === 1 && idRoute[0] === node.id) {
      return node;
    }

    for (const child of node.children) {
      const foundNode = findNodeByIdRoute(child, idRoute.slice(1));
      if (foundNode) {
        return foundNode;
      }
    }

    return undefined;
  }

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedList: IDepartmentAndUserListValue | IDepartmentAndUserListValue[],
    value?: boolean
  ) => {
    const clickedItem = !Array.isArray(clickedList)
      ? clickedList
      : clickedList[0];

    setSelectedList((prev) => {
      if (
        prev.some((item) => item.id === clickedItem.id) &&
        !clickedItem.selected
      )
        return prev;
      return type === ClickType.Select
        ? clickedItem.selected
          ? remove(
              prev.findIndex((item) => item.id === clickedItem.id),
              1,
              prev
            )
          : [...prev, clickedItem]
        : prev;
    });

    const copyFoldList: IDepartmentAndUserListValue[] = foldList.map(
      (item) => ({ ...item })
    );

    const copyClickedList = Array.isArray(clickedList)
      ? clickedList
      : [clickedList];

    setFoldList(
      handleSelectDataSync(copyFoldList, copyClickedList, value, type)
    );
  };

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    const diff = difference(valueArr, selectedList);
    const diffReverse = difference(selectedList, valueArr);

    diff.length > 0 && handleDeptOrUserClick(ClickType.Select, diff, true);
    diffReverse.length > 0 &&
      handleDeptOrUserClick(ClickType.Select, diffReverse, false);

    setSelectedList(valueArr);
  };

  const handleSelectDataSync = (
    sourceData: IDepartmentAndUserListValue[],
    selectedList: IDepartmentAndUserListValue[],
    value?: boolean,
    type?: ClickType
  ) => {
    const copySourceData: IDepartmentAndUserListValue[] = sourceData.map(
      (item) => ({
        ...item,
      })
    );

    selectedList.length > 0 &&
      selectedList.forEach((selectedItem) => {
        const topLevelIdList = copySourceData.map((item) => Number(item.id));
        const repeatUserList = deduplicationArray(
          flattenList.filter((x) => x.type === DepartmentAndUserType.Department)
        )
          .concat(
            deduplicationArray(
              flattenList.filter((x) => x.type === DepartmentAndUserType.User),
              (x, y) => x.id === y.id && x.parentid === y.parentid
            )
          )
          .filter((flattenItem) => selectedItem.id === flattenItem.id);

        // 提前判断顶层user数据选中并返回
        const userData = copySourceData.find(
          (item) => item.id === selectedItem.id
        );
        if (!Number(selectedItem.id) && userData) {
          type !== ClickType.Collapse
            ? (userData.selected = value ?? !userData.selected)
            : (userData.isCollapsed = !userData?.isCollapsed);
        }
        for (const repeatItem of repeatUserList) {
          // 提取顶层department数据并剪裁idRoute
          const topIndex = repeatItem.idRoute?.findIndex((id) =>
            topLevelIdList.some((topId) => topId === id)
          );
          // 通用-通过idRoute修改对应数据
          const routeArr =
            (sourceType === SourceType.Part
              ? topIndex !== undefined &&
                topIndex > -1 &&
                repeatItem.idRoute?.slice(topIndex)
              : repeatItem.idRoute) || [];

          const innerItem: IDepartmentAndUserListValue | undefined =
            copySourceData
              .map((copySourceDataItem) => {
                return findNodeByIdRoute(copySourceDataItem, routeArr);
              })
              .filter((x) => x)[0];

          const finalInnerItem =
            repeatItem.type === DepartmentAndUserType.Department
              ? innerItem
              : innerItem?.children.find((cell) => cell.id === repeatItem.id);

          finalInnerItem &&
            (type !== ClickType.Collapse
              ? (finalInnerItem.selected = value ?? !finalInnerItem.selected)
              : (finalInnerItem.isCollapsed = !finalInnerItem?.isCollapsed));
        }
      });

    return copySourceData;
  };

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList);
  }, [selectedList]);

  useEffect(() => {
    // 初始化已选择的item到foldList中
    const copyFoldList: IDepartmentAndUserListValue[] = foldList.map(
      (item) => ({ ...item })
    );

    setFoldList(handleSelectDataSync(copyFoldList, selectedList));
  }, []);

  return {
    foldList,
    flattenList,
    selectedList,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
  };
};

export default useAction;
