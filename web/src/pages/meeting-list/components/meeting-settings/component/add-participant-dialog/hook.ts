import { clone } from "ramda";
import { useEffect, useState } from "react";
import {
  IDepartmentAndUserListValue,
  ITagsList,
  SendObjOrGroup,
  IFirstState,
  DefaultDisplay,
  SelectPersonnelType,
} from "../../../../../../dtos/meeting-seetings";
import { AddParticipantDialogProps } from "./props";

const useAction = (props: AddParticipantDialogProps) => {
  const {
    departmentAndUserList,
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

  const countArrayItems = (
    departmentSelectedList: IDepartmentAndUserListValue[]
  ) => {
    let count = 0;

    const countChildren = (children: IDepartmentAndUserListValue[]) => {
      if (!children || children.length === 0) {
        return 1;
      } else {
        const childCount: number = children.reduce(
          (count, child) => count + countChildren(child.children),
          0
        );
        return childCount;
      }
    };

    return departmentSelectedList.reduce((count, department) => {
      return count + countChildren(department.children);
    }, 0);
  };

  const handleConfirm = () => {
    if (clickName === SelectPersonnelType.ConferenceAdministrator) {
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
      countArrayItems(departmentSelectedList) > DefaultDisplay.hostList
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
  };

  const handleCancel = () => {
    setOpenFunction(false);
    clearSelected();
  };

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
    if (
      departmentAndUserList &&
      departmentAndUserList.length > 0 &&
      loadSelectData
    ) {
      setDepartmentSelectedList(loadSelectData);
    }
  }, [isLoading, loadSelectData]);

  return {
    departmentSelectedList,
    tagsValue,
    isShowDialog,
    tipsObject,
    createLoading,
    setCreateLoading,
    setIsShowDialog,
    setTagsValue,
    handleConfirm,
    handleCancel,
    setDepartmentSelectedList,
  };
};
export default useAction;
