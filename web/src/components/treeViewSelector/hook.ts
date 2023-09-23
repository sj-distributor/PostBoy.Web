import { useBoolean, useMap, useThrottle } from "ahooks";
import { clone } from "ramda";
import { useEffect, useState } from "react";
import { validate as uuidValidate } from "uuid";
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise";
import useDeptUserData from "../../hooks/deptUserData";
import { ITreeViewHookProps } from "./props";

const useAction = ({
  appId,
  defaultSelectedList,
  flattenData,
  foldData,
  sourceType,
  schemaType,
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
  const [indeterminateList, setIndeterminateList] = useState<
    IDepartmentAndUserListValue[]
  >([]);

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
    return schemaType ? value.name : `${value.id}${value.idRoute?.join("")}`;
  };

  const [isDirectTeamMembers, setIsDirectTeamMembers] = useBoolean(true);

  const map = new Map();

  flattenList.forEach((value) => map.set(getUniqueId(value), value));

  const [foldMap, { set: foldMapSetter, get: foldMapGetter, setAll }] = useMap<
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

  const setAllChildrenById = (
    id: string | number,
    childrenList: IDepartmentAndUserListValue[],
    isSelected: boolean
  ) => {
    const mapItem = foldMapGetter(id);
    //向下
    mapItem &&
      mapItem.children.forEach((item) => {
        const innerItem = foldMapGetter(getUniqueId(item));
        if (innerItem) {
          const flattenItem = flattenList.find(
            (x) => getUniqueId(x) === getUniqueId(innerItem)
          );
          flattenItem && childrenList.push(flattenItem);
          innerItem.children.length > 0 &&
            setAllChildrenById(
              getUniqueId(innerItem),
              childrenList,
              isSelected
            );
        }
      });
    return childrenList;
  };

  const handleIndeterminateList = (
    clickedItem: IDepartmentAndUserListValue,
    selectedList: IDepartmentAndUserListValue[],
    indeterminateList: IDepartmentAndUserListValue[]
  ) => {
    /*
      处理indeterminateList横杠列表的方法
      找出所有父数据的children是否全选中/全不选中(直接对比selectedList即可) 或 有杠 (此处处理顺序必须从点击项开始往上)
      只要数据符合条件便set入resultList
      return一个resultList
    */

    const resultList: IDepartmentAndUserListValue[] = [...indeterminateList];
    const idRouteList = clickedItem.idRoute?.slice().reverse();

    idRouteList?.forEach((item) => {
      const idIndex = (item: number) =>
        clickedItem.idRoute?.findIndex((x) => x === item) ?? 0;

      const mapItem = foldMapGetter(
        `${clickedItem.id}${clickedItem.idRoute?.join("")}`
      );

      if (mapItem) {
        const idSelectedList = selectedList.map((x) => x.id);
        const idIndeterminateList = resultList.map((x) => x.id);

        const determine = {
          allSelected: mapItem?.children.every((child) =>
            idSelectedList.includes(child.id)
          ),
          allNotSelected: mapItem?.children.every(
            (child) => !idSelectedList.includes(child.id)
          ),
          someIndeterminate: mapItem?.children.some((child) =>
            idIndeterminateList.includes(child.id)
          ),
        };

        const activeIndex = resultList.findIndex((x) => x.id === mapItem.id);
        determine.allSelected &&
          !determine.allNotSelected &&
          !selectedList.some((item) => item.id === mapItem.id) &&
          selectedList.push(mapItem);
        determine.someIndeterminate ||
        (!determine.allSelected && !determine.allNotSelected)
          ? activeIndex === -1 && resultList.push(mapItem)
          : activeIndex > -1 && resultList.splice(activeIndex, 1);
      }
    });

    return resultList;
  };

  const handleMapUpdate = (
    selectedList: IDepartmentAndUserListValue[],
    indeterminateList?: IDepartmentAndUserListValue[]
  ) => {
    const cloneData = clone(foldMap);

    selectedList.map((selectItem) => {
      let fatherItem: IDepartmentAndUserListValue | undefined = Array.from(
        cloneData.values()
      ).find((item) => item.id === selectItem.parentid);

      let clickItem: IDepartmentAndUserListValue | undefined = Array.from(
        cloneData.values()
      ).find((item) => item.name === selectItem.name);

      let isIndeterminate = clickItem?.indeterminate
        ? clickItem.indeterminate
        : false;

      let updateSelectedList = [
        ...setAllChildrenById(getUniqueId(selectItem), [], true),
        selectItem,
      ];

      for (const [key, value] of cloneData.entries()) {
        const selectedListItem = updateSelectedList.find(
          (item) => item.name === value.name
        );

        selectedListItem &&
          cloneData.set(key, {
            ...value,
            selected: isIndeterminate ? true : !value.selected,
            indeterminate: false,
          });
      }

      isIndeterminate &&
        clickItem &&
        cloneData.set(getUniqueId(clickItem), {
          ...(cloneData.get(
            getUniqueId(clickItem)
          ) as IDepartmentAndUserListValue),
          selected: true,
          indeterminate: false,
        });

      if (!isIndeterminate) {
        if (fatherItem) {
          let fatherMapData: IDepartmentAndUserListValue = cloneData.get(
            getUniqueId(fatherItem)
          ) as IDepartmentAndUserListValue;

          let childrenList: IDepartmentAndUserListValue[] = [];
          cloneData.forEach((item) => {
            if (
              item.parentid === selectItem.parentid &&
              fatherItem?.name !== item.name
            ) {
              childrenList.push(item);
            }
          });

          if (
            fatherMapData &&
            fatherMapData.children.find((item) => item.name === selectItem.name)
          ) {
            cloneData.set(getUniqueId(fatherItem), {
              ...fatherMapData,
              selected: childrenList.every((item) => item?.selected === true),
              indeterminate: childrenList.every((item) => !item?.selected)
                ? false
                : !childrenList.every((item) => item?.selected),
            });
          }

          foldMap.forEach((item) => {
            if (
              fatherMapData.idRoute
                ?.slice(
                  0,
                  fatherMapData.name !== fatherMapData.id
                    ? fatherMapData.idRoute.length - 1
                    : fatherMapData.idRoute.length
                )
                .find((rItem) => rItem === item.id)
            ) {
              cloneData.set(getUniqueId(item), {
                ...item,
                indeterminate: fatherItem
                  ? foldMapGetter(getUniqueId(fatherItem))?.selected ||
                    foldMapGetter(getUniqueId(fatherItem))?.indeterminate
                  : false,
              });
            }
          });
        }
      }
    });

    setAll(cloneData);
    setSelectedList([]);
  };

  useEffect(() => {
    let departmentItem: IDepartmentAndUserListValue[] = [];

    foldMap.forEach((item) => {
      if (
        item.selected &&
        !departmentItem.find((dItem) => item.name === dItem.name)
      ) {
        departmentItem.push(item);
      }
    });
    setTimeout(() => {
      setSelectedList(departmentItem);
    }, 100);
  }, [foldMap]);

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedList: IDepartmentAndUserListValue | IDepartmentAndUserListValue[],
    toSelect?: boolean
  ) => {
    /*
      一、先统一当前项和当前项的所有子数据在同一个列表
      二、当前项还要丢给处理indeterminateList横杠列表的方法:handleIndeterminateList,会返回一个横杠列表
      三、最后在调用遍历map的方法:handleMapUpdate,并传入上述list,但不使用state, 使用普通变量
    */
    const clickedItem = Array.isArray(clickedList)
      ? clickedList
      : [clickedList];

    for (const value of clickedItem) {
      if (type === ClickType.Collapse) {
        // 折叠

        foldMapSetter(schemaType ? value.name : getUniqueId(value), {
          ...value,
          isCollapsed: !value.isCollapsed,
        });
      } else {
        let newSelectedList = [...selectedList, value];

        const uniqueArray = (arr: IDepartmentAndUserListValue[]) => {
          const set: IDepartmentAndUserListValue[] = [];
          arr.map((item) => {
            !set.find((cItem) => item.id === cItem.id) && set.push(item);
          });

          return schemaType
            ? set.filter((item) => isNaN(Number(item.id)))
            : set;
        };

        let newIndeterminateList = handleIndeterminateList(
          value,
          newSelectedList,
          indeterminateList
        );
        newSelectedList.length &&
          (newSelectedList = uniqueArray(
            newSelectedList.filter(
              (value) =>
                !newIndeterminateList.some((item) => item.id === value.id)
            )
          ));

        if (!schemaType) {
          handleMapUpdate([value], newIndeterminateList);
        }
        setIndeterminateList(newIndeterminateList);
      }
    }

    if (schemaType && type !== ClickType.Collapse) {
      handleMapUpdate(clickedItem, []);
    }
  };

  const handleClear = (
    valueArr: IDepartmentAndUserListValue[],
    reason: string,
    clickItem?: IDepartmentAndUserListValue
  ) => {
    if (reason === "clear") {
      setSelectedList([]);
      flattenList.forEach((item) =>
        foldMapSetter(getUniqueId(item), { ...item, selected: false })
      );
    } else {
      clickItem && handleDeptOrUserClick(ClickType.Select, clickItem);
      setSelectedList((prev) =>
        prev.filter((item) => item.name !== clickItem?.name)
      );
    }
  };

  const setFilterChildren = (arr: IDepartmentAndUserListValue[]) => {
    // 遍歷數組中的每個對象
    arr.forEach((item) => {
      if (item.children.length) {
        // 檢查item的children是否都存在於數組中
        const allChildrenExist = item.children.every((child) =>
          arr.some((obj) => obj.name === child.name)
        );

        // 如果所有children都存在，則刪除數組中所有爲item的children
        if (allChildrenExist) {
          arr = arr.filter(
            (obj) => !item.children.find((item) => item.name === obj.name)
          );
        }
      }
    });

    return arr;
  };

  //指数组员按钮逻辑
  const handleGetAllTeamMembers = () => {
    isDirectTeamMembers
      ? setIsDirectTeamMembers.setFalse()
      : setIsDirectTeamMembers.setTrue();

    let teamMembers = getUserTeamMembers();

    if (isDirectTeamMembers) {
      let newData: IDepartmentAndUserListValue[] = [];
      teamMembers.map((item) => {
        !selectedList.find((nItem) => nItem.name === item.name) &&
          newData.push(item);
      });

      handleMapUpdate(newData, indeterminateList);
    } else {
      handleMapUpdate(
        schemaType
          ? selectedList.filter((item) =>
              teamMembers.find((tItem) => item.name === tItem.name)
            )
          : selectedList
              .filter(
                (item) => !teamMembers.find((tItem) => item.name === tItem.name)
              )
              .filter((item) => item.name === item.id),
        indeterminateList
      );

      flattenList.forEach(
        (item) =>
          teamMembers.some((tItem) => tItem.name === item.name) &&
          foldMapSetter(getUniqueId(item), { ...item, selected: false })
      );
    }
  };

  //获取组员
  const getUserTeamMembers = () => {
    const teamMembers = schemaType
      ? flattenList.find((item) => item.name === "TED.F")?.children
      : flattenList.filter(
          (item) =>
            item.department_leader &&
            item.department_leader.length &&
            item.department_leader[0] === "TED.F" &&
            item.id === item.name
        );

    const removeDuplicate = (teamMembers: IDepartmentAndUserListValue[]) => {
      let len = teamMembers.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (teamMembers[i].name === teamMembers[j].name) {
            teamMembers.splice(j, 1);
            len--;
            j--;
          }
        }
      }

      return teamMembers;
    };
    return removeDuplicate(teamMembers ?? []);
  };

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList);

    const teamMembers = getUserTeamMembers();

    teamMembers.every((tItem) =>
      selectedList.map((item) => item.name).includes(tItem.name)
    ) && teamMembers.length <= selectedList.length
      ? setIsDirectTeamMembers.setFalse()
      : setIsDirectTeamMembers.setTrue();
  }, [selectedList]);

  useEffect(() => {
    if (limitTags === selectedList.length) setLoading(false);
  }, [limitTags]);

  //初始化选中数据
  useEffect(() => {
    !loading &&
      handleMapUpdate(
        schemaType
          ? setFilterChildren(
              flattenList.filter((item) =>
                selectedList
                  .filter((item) => item.name === item.id)
                  .some((clickItem) => clickItem.name === item.name)
              )
            )
          : flattenList.filter((item) =>
              selectedList.some((clickItem) => clickItem.name === item.name)
            )
      );
  }, []);

  return {
    foldList,
    flattenList,
    selectedList,
    limitTags,
    loading,
    throttledValue,
    isDirectTeamMembers,
    foldMap,
    handleGetAllTeamMembers,
    setSearchValue,
    setLoading,
    handleClear,
    setLimitTags,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    foldMapGetter,
    foldMapSetter,
    getUniqueId,
  };
};

export default useAction;
