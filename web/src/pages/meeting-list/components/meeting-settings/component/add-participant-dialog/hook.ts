import { clone } from "ramda";
import { useEffect, useState } from "react";
import {
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList,
  IDepartmentKeyControl,
  ClickType,
  DeptUserCanSelectStatus,
  SendObjOrGroup,
  IFirstState,
  DefaultDisplay,
  SelectPersonnelType,
} from "../../../../../../dtos/meeting-seetings";
import { AddParticipantDialogProps } from "./props";

const useAction = (props: AddParticipantDialogProps) => {
  const {
    departmentAndUserList,
    departmentKeyValue,
    AppId,
    open,
    isLoading,
    tagsList,
    clickName,
    chatId,
    outerTagsValue,
    lastTagsValue,
    CorpId,
    loadSelectData,
    setChatId,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    handleGetSelectData,
    settingSelectedList,
  } = props;

  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([]);
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [tipsObject, setTipsObject] = useState({
    show: false,
    msg: "",
  });
  const [firstState, setFirstState] = useState<IFirstState>();
  const [createLoading, setCreateLoading] = useState(false);

  const recursiveSeachDeptOrUser = (
    hasData: IDepartmentAndUserListValue[],
    callback: (e: IDepartmentAndUserListValue) => void
  ) => {
    for (const key in hasData) {
      callback(hasData[key]);
      hasData[key].children.length > 0 &&
        recursiveSeachDeptOrUser(hasData[key].children, callback);
    }
    return hasData;
  };

  const recursiveDeptList = (
    hasData: IDepartmentAndUserListValue[],
    changeList: IDepartmentAndUserListValue[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key];
      const hasItemIndex = changeList.findIndex((item) => item.id === e.id);
      e.selected
        ? hasItemIndex <= -1 &&
          changeList.push({
            id: e.id,
            name: e.name,
            type: DepartmentAndUserType.User,
            parentid: e.parentid,
            selected: e.selected,
            children: [],
            isCollapsed: e.isCollapsed,
          })
        : hasItemIndex > -1 && changeList.splice(hasItemIndex, 1);
      e.children.length > 0 && recursiveDeptList(e.children, changeList);
    }
  };

  // 处理部门列表点击选择或者展开
  // const handleDeptOrUserClick = (
  //   type: ClickType,
  //   clickedItem: IDepartmentAndUserListValue
  // ) => {
  //   setDeptUserList((prev) => {
  //     const newValue = prev.filter((e) => !!e);
  //     const activeData = newValue.find((e) => e.key === departmentKeyValue.key);

  //     activeData &&
  //       recursiveSeachDeptOrUser(activeData.data, (e) => {
  //         e.id === clickedItem.id &&
  //           (type === ClickType.Collapse
  //             ? (e.isCollapsed = !e.isCollapsed)
  //             : (e.selected = !e.selected));
  //       });
  //     return newValue;
  //   });
  // };

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    const handleDataUpdate = (prev: IDepartmentKeyControl[]) => {
      const newValue = prev.filter((e) => !!e);

      const activeData = newValue.find(
        (e) => e.key === departmentKeyValue?.key
      );
      if (activeData) {
        valueArr.length > 0
          ? valueArr.forEach((item) => {
              recursiveSeachDeptOrUser(activeData.data, (user) => {
                user.selected = !!valueArr.find((e) => e.id === user.id);
              });
            })
          : recursiveSeachDeptOrUser(
              activeData.data,
              (user) => (user.selected = false)
            );
      }
      return newValue;
    };
    setDepartmentSelectedList(valueArr);
    setDeptUserList(handleDataUpdate);
  };

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

  const handleSelectDataCheck = (selectData: IDepartmentAndUserListValue[]) => {
    let flg: boolean = true;

    return flg;
  };

  const handleConfirm = () => {
    if (clickName === SelectPersonnelType.ConferenceAdministrator) {
      console.log(departmentSelectedList);
      const isUserArr = departmentSelectedList.filter(
        (item) => typeof item.id !== "string"
      );
      if (isUserArr.length) {
        setTipsObject({
          show: true,
          msg: "Administrators cannot select departments",
        });

        return;
      }
      if (departmentSelectedList.length > 1) {
        setTipsObject({
          show: true,
          msg: "Administrators can only select one person",
        });
        return;
      }
    }
    if (
      clickName === SelectPersonnelType.Moderator &&
      departmentSelectedList.length > DefaultDisplay.hostList
    ) {
      tipsObject &&
        setTipsObject({
          show: true,
          msg: "Cannot select department and up to ten hosts",
        });

      return;
    }
    settingSelectedList(departmentSelectedList);
    setOpenFunction(false);
    setOuterTagsValue(tagsValue);
    setFirstState(undefined);
    handleGetSelectData && handleGetSelectData(departmentSelectedList);
  };

  const handleCancel = () => {
    setOpenFunction(false);
    clearSelected();
  };

  useEffect(() => {
    // 限制条件下发送列表部门列表变化同步到发送搜索选择列表

    !isLoading &&
      departmentKeyValue?.data.length > 0 &&
      setDepartmentSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e);
        recursiveDeptList(departmentKeyValue.data, newValue);
        return newValue;
      });
  }, [departmentAndUserList]);

  const clearSelected = () => {
    if (firstState) {
      setTagsValue(firstState.tagsValue);
      setDeptUserList(firstState.deptUserList);
      setChatId && setChatId(firstState.chatId);
      setFirstState(undefined);
    }
  };

  useEffect(() => {
    clearSelected();
  }, [AppId]);

  useEffect(() => {
    open &&
      setFirstState({
        tagsValue: outerTagsValue ?? [],
        chatId,
        deptUserList: clone(departmentAndUserList),
        sendType: SendObjOrGroup.Object,
      });
  }, [open]);

  const handleData = (
    prev: IDepartmentAndUserListValue[],
    listData: IDepartmentKeyControl[]
  ) => {
    const newValue = loadSelectData
      ? loadSelectData.filter((x) => x)
      : prev.filter((x) => x);
    const hasData = listData.find((x) => x.key === AppId);

    if (hasData) {
      loadSelectData
        ? loadSelectData.forEach((item) => {
            recursiveSeachDeptOrUser(hasData.data, (user) => {
              user.selected = !!loadSelectData.find((e) => e.id === user.id);
            });
          })
        : recursiveSeachDeptOrUser(hasData.data, (user) => {
            user.selected = false;
          });
    }

    return newValue;
  };

  // useEffect(() => {
  //   departmentAndUserList.length && setSearchToDeptValue([]);

  //   open
  //     ? loadSelectData && loadSelectData.length > 0
  //       ? setDepartmentSelectedList((prev) =>
  //           handleData(prev, departmentAndUserList)
  //         )
  //       : setDepartmentSelectedList([])
  //     : // 关闭时清空上次选中数据
  //       (() => {
  //         setDepartmentSelectedList([]);
  //       })();
  // }, [open, isLoading]);

  useEffect(() => {
    // 3s关闭提示
    const number = setTimeout(() => {
      if (tipsObject.show) {
        setTipsObject({ msg: "", show: false });
      }
    }, 3000);
    return () => {
      clearTimeout(number);
    };
  }, [tipsObject.show]);

  useEffect(() => {
    if (!!tagsList && !!lastTagsValue && lastTagsValue?.length > 0) {
      const selectTagsList: ITagsList[] = [];
      lastTagsValue.forEach((item) => {
        const findItem = tagsList.find((i) => i.tagId === Number(item));
        !!findItem && selectTagsList.push(findItem);
      });

      setTagsValue(selectTagsList);
    }
  }, [tagsList, lastTagsValue]);

  useEffect(() => {
    const hasData = departmentAndUserList.find((x) => x.key === AppId);
    hasData &&
      recursiveSeachDeptOrUser(hasData.data, (user) => {
        user.selected = false;
      });
  }, [AppId, CorpId]);

  useEffect(() => {
    if (
      departmentAndUserList &&
      departmentAndUserList.length > 0 &&
      loadSelectData
    ) {
      // setDepartmentSelectedList(loadSelectData);
    }
  }, [isLoading, loadSelectData]);

  useEffect(() => {
    if (
      (clickName === SelectPersonnelType.SpecifyReminderPersonnel ||
        clickName === SelectPersonnelType.Moderator) &&
      loadSelectData
    ) {
      // setDepartmentSelectedList(loadSelectData);
    }
  }, [clickName]);

  return {
    departmentSelectedList,
    tagsValue,
    isShowDialog,
    tipsObject,
    createLoading,
    setCreateLoading,
    handleTypeIsCanSelect,
    setIsShowDialog,
    setTagsValue,
    // handleDeptOrUserClick,
    setSearchToDeptValue,
    handleConfirm,
    handleCancel,
    handleSelectDataCheck,
    setDepartmentSelectedList,
  };
};
export default useAction;
