import { useMap, useThrottle, useThrottleEffect } from "ahooks";
import { clone, difference, remove } from "ramda";
import { useEffect, useState, useTransition, startTransition } from "react";
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

  const [limitTags, setLimitTags] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>("");

  const throttledValue = useThrottle(searchValue, { wait: 500 });

  const getUniqueId = (value: IDepartmentAndUserListValue): string => {
    return `${value.id}${value.idRoute?.join("")}`;
  };

  const map = new Map();

  flattenList.forEach((value) => map.set(getUniqueId(value), value));

  const [foldMap, { set: foldMapSetter, get: foldMapGetter }] = useMap<
    string | number,
    IDepartmentAndUserListValue
  >(map);

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

  const setAllChildrenById = (
    id: string | number,
    childrenList: IDepartmentAndUserListValue[]
  ) => {
    const mapItem = foldMapGetter(id);
    mapItem &&
      mapItem.children.forEach((item) => {
        const innerItem = foldMapGetter(getUniqueId(item));
        if (innerItem) {
          foldMapSetter(getUniqueId(item), { ...innerItem, selected: true });
          childrenList.push(innerItem);
          innerItem.children.length > 0 &&
            setAllChildrenById(innerItem.id, childrenList);
        }
      });
    return childrenList;
  };

  const updateDropDownFromTree = () => {
    const list: IDepartmentAndUserListValue[] = [];
    for (let value of foldMap.values()) {
      value.selected && list.push(value);
    }
    if (list.length > 500) {
      setLoading(true);
      const stepSize = 100;
      const totalSteps = Math.ceil(list.length / stepSize);
      let currentStep = 0;
      function updateDataStepByStep() {
        const startIndex = currentStep * stepSize;
        const endIndex = Math.min((currentStep + 1) * stepSize, list.length);
        setLimitTags(endIndex);

        // 在此处执行数据更新的逻辑，从startIndex到endIndex之间的数据更新
        setSelectedList((prev) => [
          ...prev,
          ...list.slice(startIndex, endIndex),
        ]);

        // 更新步骤数，并在还有剩余数据需要更新时请求下一帧
        currentStep++;
        if (currentStep < totalSteps) {
          window.requestAnimationFrame(updateDataStepByStep);
        }
      }
      window.requestAnimationFrame(updateDataStepByStep);
    } else setSelectedList(list);
  };

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedList: IDepartmentAndUserListValue | IDepartmentAndUserListValue[],
    toSelect?: boolean
  ) => {
    const clickedItem = Array.isArray(clickedList)
      ? clickedList
      : [clickedList];

    for (const value of clickedItem) {
      const mapItem = foldMapGetter(getUniqueId(value));

      !mapItem?.selected &&
        type !== ClickType.Collapse &&
        setSelectedList((prev) => [
          ...prev,
          ...setAllChildrenById(getUniqueId(value), []),
        ]);

      mapItem &&
        foldMapSetter(
          value.id,
          type !== ClickType.Collapse
            ? { ...mapItem, selected: toSelect ?? !mapItem.selected }
            : { ...mapItem, isCollapsed: !mapItem.isCollapsed }
        );

      mapItem &&
        setSelectedList((prev) => {
          return type === ClickType.Select
            ? mapItem.selected
              ? remove(
                  prev.findIndex((item) => getUniqueId(item) === mapItem.id),
                  1,
                  prev
                )
              : [...prev, mapItem]
            : prev;
        });
    }
  };

  const handleFlattenToTree = (
    selectItem: IDepartmentAndUserListValue,
    selected: boolean
  ) => {
    const result: IDepartmentAndUserListValue[] = [];

    for (const flattenItem of flattenList) {
      if (selectItem.type === DepartmentAndUserType.Department) {
        const flag = selectItem.idRoute?.every(
          (item, index) => item === flattenItem.idRoute?.[index]
        );
        if (flag) {
          foldMapSetter(getUniqueId(flattenItem), { ...flattenItem, selected });
          result.push(flattenItem);
        }
      } else {
        if (selectItem.id === flattenItem.id) {
          foldMapSetter(getUniqueId(flattenItem), { ...flattenItem, selected });
          !result.some((item) => item.id === flattenItem.id) &&
            result.push(flattenItem);
        }
      }
    }
    return result;
  };

  const handleClear = (
    valueArr: IDepartmentAndUserListValue[],
    reason: string
  ) => {
    if (reason === "clear") {
      setSelectedList([]);
      flattenList.forEach((item) =>
        foldMapSetter(item.id, { ...item, selected: false })
      );
    } else {
      for (const selectedItem of selectedList) {
        const existItem = valueArr.find((item) => item.id === selectedItem.id);
        if (!existItem) {
          foldMapSetter(selectedItem.id, { ...selectedItem, selected: false });
          setSelectedList(valueArr);
        }
      }
    }
  };

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (value: IDepartmentAndUserListValue) => {
    if (!foldMapGetter(value.id)?.selected) {
      startTransition(() => {
        setSelectedList((prev) => [
          ...prev,
          ...handleFlattenToTree(value, true),
        ]);
      });
    } else {
      foldMapSetter(getUniqueId(value), { ...value, selected: false });
      setSelectedList((prev) =>
        prev.filter((item) => getUniqueId(item) !== getUniqueId(value))
      );
    }
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
    // const copyFoldList: IDepartmentAndUserListValue[] = foldList.map(
    //   (item) => ({ ...item })
    // );
    // setFoldList(handleSelectDataSync(copyFoldList, selectedList));
  }, []);

  useEffect(() => {
    if (limitTags === selectedList.length) setLoading(false);
  }, [limitTags]);

  return {
    foldList,
    flattenList,
    selectedList,
    limitTags,
    loading,
    throttledValue,
    setSearchValue,
    setLoading,
    handleClear,
    setLimitTags,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
    foldMapGetter,
    foldMapSetter,
    getUniqueId,
  };
};

export default useAction;
