import { useBoolean, useMap, useThrottle } from "ahooks";
import { clone } from "ramda";
import { useEffect, useState } from "react";
import { GetAuthUser } from "../../api/user-management";
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise";
import { IUserResponse } from "../../dtos/user-management";
import useDeptUserData from "../../hooks/deptUserData";
import { ITreeViewHookProps } from "./props";
import { validate } from "uuid";
import { setFilterChildren } from "../../uilts/convert-type";
import useAuth from "../../auth";

const useAction = ({
  appId,
  defaultSelectedList,
  flattenData,
  foldData,
  sourceType,
  schemaType,
  settingSelectedList,
}: ITreeViewHookProps) => {
  const { username } = useAuth();

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
    return schemaType ? value.name : `${value.id}${value.idRoute?.join("")}`;
  };

  const [isDirectTeamMembers, setIsDirectTeamMembers] = useBoolean(true);

  const map = new Map();

  flattenList.forEach((value) => map.set(getUniqueId(value), value));

  const [foldMap, { set: foldMapSetter, get: foldMapGetter, setAll }] = useMap<
    string | number,
    IDepartmentAndUserListValue
  >(map);

  // 提示语
  const [promptText, setPromptText] = useState<string>("");
  // 提示显隐
  const [openError, openErrorAction] = useBoolean(false);

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

  const getIndeterminateStatus = (
    childrenList: IDepartmentAndUserListValue[]
  ) => {
    return !childrenList.every((item) => item?.selected)
      ? childrenList.some((item) => item.indeterminate) ||
          childrenList.some((item) => item.selected)
      : false;
  };

  const handleMapUpdate = (
    selectedList: IDepartmentAndUserListValue[],
    isClickFilter?: boolean,
    isStart?: boolean
  ) => {
    const cloneData = clone(foldMap);

    //处理横杆状态逻辑
    const setIndeterminateAllStatus = (
      fatherItem: IDepartmentAndUserListValue
    ) => {
      const superiors = (
        fatherItem.children.length > 0
          ? fatherItem.idRoute?.slice(0, -1)
          : fatherItem.idRoute
      )?.reverse();

      const setFatherItemStatus = (idRoutes: (string | number)[]) => {
        if (idRoutes.length) {
          const id = idRoutes.splice(0, 1);
          const data = Array.from(cloneData.values()).find(
            (cItem) => String(cItem.id) === String(id)
          );
          const childrenList: IDepartmentAndUserListValue[] = [];

          data &&
            cloneData.forEach((i) => {
              if (i.parentid === data.id && data.id !== i.id) {
                childrenList.push(i);
              }
            });

          data &&
            cloneData.set(getUniqueId(data), {
              ...data,
              selected: childrenList.every((item) => item?.selected),
              indeterminate: getIndeterminateStatus(childrenList),
            });

          setFatherItemStatus(idRoutes);
        }
      };

      superiors?.length && setFatherItemStatus(superiors);
    };

    selectedList.map((selectItem) => {
      let fatherItem: IDepartmentAndUserListValue | undefined = Array.from(
        cloneData.values()
      ).find((item) => item.id === selectItem.parentid);

      let clickItem: IDepartmentAndUserListValue | undefined = cloneData.get(
        getUniqueId(selectItem)
      );

      let isIndeterminate = clickItem?.indeterminate
        ? clickItem.indeterminate
        : false;

      let updateSelectedList: IDepartmentAndUserListValue[] = [];

      const allChildrenData = setAllChildrenById(
        getUniqueId(selectItem),
        [],
        true
      );

      if (schemaType) {
        updateSelectedList = selectItem.selected
          ? selectItem.indeterminate
            ? [selectItem]
            : [...allChildrenData, selectItem]
          : [...allChildrenData, selectItem];
      } else {
        updateSelectedList = [...allChildrenData, selectItem];
      }

      for (const [key, value] of cloneData.entries()) {
        const selectedListItem = updateSelectedList.find(
          (item) => item.name === value.name
        );

        cloneData.set(key, {
          ...value,
          indeterminate: false,
        });

        if (selectedListItem) {
          schemaType
            ? cloneData.set(key, {
                ...value,
                selected: selectItem.selected
                  ? !value.selected
                  : isClickFilter
                  ? clickItem?.children.length && !clickItem.selected
                    ? true
                    : !value.selected
                  : true,
              })
            : cloneData.set(key, {
                ...value,
                selected: isIndeterminate
                  ? true
                  : isStart
                  ? value.selected
                    ? value.selected
                    : !value.selected
                  : !value.selected,
              });
        }
      }

      isIndeterminate &&
        clickItem &&
        cloneData.set(getUniqueId(clickItem), {
          ...clickItem,
          selected: !schemaType ? true : !clickItem.selected,
          indeterminate: false,
        });

      if (fatherItem) {
        let childrenList: IDepartmentAndUserListValue[] = [];
        cloneData.forEach((item) => {
          if (
            item.parentid === selectItem.parentid &&
            fatherItem?.id !== item.id
          ) {
            childrenList.push(item);
          }
        });

        if (fatherItem.children.find((item) => item.id === selectItem.id)) {
          if (schemaType) {
            cloneData.set(getUniqueId(fatherItem), {
              ...fatherItem,
              indeterminate:
                childrenList.every((item) => !item?.selected) &&
                fatherItem.selected
                  ? true
                  : getIndeterminateStatus(childrenList),
            });
          } else {
            cloneData.set(getUniqueId(fatherItem), {
              ...fatherItem,
              selected: childrenList.every((item) => item?.selected === true),
              indeterminate: getIndeterminateStatus(childrenList),
            });
          }
        }

        !schemaType && setIndeterminateAllStatus(fatherItem);
      }
    });

    //处理有存在多个部门的横杆逻辑
    const filteredItems = Array.from(cloneData.values()).filter(
      (item, index, self) =>
        item.selected &&
        self.findIndex((i) => {
          return i.name === item.name;
        }) !== (schemaType ? index : 0)
    );

    if (filteredItems.length) {
      const setCloneItemData = (id: string | number) => {
        const data: IDepartmentAndUserListValue | undefined = Array.from(
          cloneData.values()
        ).find((item) => item.id === id);

        let childrenList: IDepartmentAndUserListValue[] = [];

        cloneData.forEach((item) => {
          if (data && item.parentid === data.id && data?.id !== item.id) {
            childrenList.push(item);
          }
        });

        data &&
          cloneData.set(getUniqueId(data), {
            ...data,
            selected: childrenList.every((item) => item?.selected === true),
            indeterminate: !childrenList.every((item) => item?.selected)
              ? childrenList.some((item) => item.indeterminate) ||
                childrenList.some((item) => item.selected)
              : false,
          });

        return data;
      };

      filteredItems.map((fItems) => {
        if (fItems.children.length) {
          setCloneItemData(fItems.id);
        }
        const fatherItem = setCloneItemData(fItems.parentid);

        fatherItem && setIndeterminateAllStatus(fatherItem);
      });
    }

    setAll(cloneData);
  };

  useEffect(() => {
    let newSelectedList: IDepartmentAndUserListValue[] = [];

    foldMap.forEach((item) => {
      if (
        item.selected &&
        !newSelectedList.find((dItem) => item.name === dItem.name)
      ) {
        newSelectedList.push(item);
      }
    });

    setSelectedList(newSelectedList);
  }, [foldMap]);

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
      if (type === ClickType.Collapse) {
        foldMapSetter(schemaType ? value.name : getUniqueId(value), {
          ...value,
          isCollapsed: !value.isCollapsed,
        });
      } else {
        if (!schemaType) {
          handleMapUpdate([value]);
        } else {
          handleMapUpdate([value], toSelect);
        }
      }
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

  //指数组员按钮逻辑
  const handleGetAllTeamMembers = async () => {
    isDirectTeamMembers
      ? setIsDirectTeamMembers.setFalse()
      : setIsDirectTeamMembers.setTrue();

    let teamMembers = await getUserTeamMembers();

    if (!teamMembers?.length) {
      setPromptText(
        "The current account name does not have a direct team member"
      );
      openErrorAction.setTrue();
      return;
    }

    if (isDirectTeamMembers) {
      let newData: IDepartmentAndUserListValue[] = [];
      teamMembers.map((item) => {
        !selectedList.find((nItem) => nItem.name === item.name) &&
          newData.push(item);
      });

      handleMapUpdate(newData);
    } else {
      let newData: IDepartmentAndUserListValue[] = [];
      teamMembers.map((item, index) => {
        !selectedList.find((nItem) => nItem.name === item.name) &&
          newData.splice(index, 1);
      });

      handleMapUpdate(
        selectedList.filter((item) =>
          teamMembers?.find((tItem) => item.name === tItem.name)
        )
      );

      flattenList.forEach(
        (item) =>
          teamMembers?.some((tItem) => tItem.name === item.name) &&
          foldMapSetter(getUniqueId(item), { ...item, selected: false })
      );
    }
  };

  const removeDuplicate = (teamMembers: IDepartmentAndUserListValue[]) => {
    const uniqueNames = new Set<string>();
    const deduplicatedMembers: IDepartmentAndUserListValue[] = [];

    for (const member of teamMembers) {
      if (!uniqueNames.has(member.name)) {
        uniqueNames.add(member.name);
        deduplicatedMembers.push(member);
      }
    }

    return deduplicatedMembers;
  };

  //获取组员
  const getUserTeamMembers = async () => {
    if (!username) {
      return;
    }

    const childrenData =
      flattenList.find((item) => item.name === username)?.children ?? [];
    const user = flattenList.find((item) => item.name === username);

    const teamMembers = schemaType
      ? user
        ? [...childrenData, user]
        : []
      : flattenList.filter(
          (item) =>
            item.department_leader &&
            item.department_leader.length &&
            item.department_leader[0] === username
        );

    const data = removeDuplicate(teamMembers ?? []);

    return schemaType
      ? data
      : data.filter((item) => !data.some((i) => i.id === item.parentid));
  };

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList);
  }, [selectedList]);

  useEffect(() => {
    (async function () {
      const teamMembers = await getUserTeamMembers();

      teamMembers?.length &&
      teamMembers.every((tItem) =>
        selectedList.map((item) => item.name).includes(tItem.name)
      )
        ? setIsDirectTeamMembers.setFalse()
        : setIsDirectTeamMembers.setTrue();
    })();
  }, [username, selectedList]);

  useEffect(() => {
    if (limitTags === selectedList.length) setLoading(false);
  }, [limitTags]);

  //初始化选中数据
  useEffect(() => {
    const newData = flattenList.filter((item) => {
      return selectedList.some(
        (selectedItem) => selectedItem.name === item.name
      );
    });

    !loading &&
      handleMapUpdate(setFilterChildren(removeDuplicate(newData)), false, true);
  }, []);

  // 延迟关闭警告提示
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse();
      }, 3000);
    }
  }, [openError]);

  return {
    foldList,
    flattenList,
    selectedList,
    limitTags,
    loading,
    throttledValue,
    isDirectTeamMembers,
    foldMap,
    promptText,
    openError,
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
    removeDuplicate,
  };
};

export default useAction;
