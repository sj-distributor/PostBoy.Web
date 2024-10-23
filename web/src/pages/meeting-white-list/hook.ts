import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import {
  GetWhiteLists,
  PostAddWhiteList,
  PostDeleteWhiteList,
  PostUpdateWhiteList,
} from "../../api/white-list";
import { IIWhiteListsDto, IMeetingGroupsDto } from "../../dtos/white-list";
import { IAddEditWhiteListDto, IWhiteListsRequest } from "./props";

const useAction = () => {
  const [successText, setSuccessText] = useState<string>("");

  const [success, successAction] = useBoolean(false);

  const [failSend, failSendAction] = useBoolean(false);

  const [loading, loadingAction] = useBoolean(false);

  const [failSendText, setFailSendText] = useState<string>("");

  const [isConfirmDialog, confirmDialogAction] = useBoolean(false);

  const [openAddWhiteList, setOpenAddWhiteList] = useState<boolean>(false);

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const [delLoading, setDelLoading] = useState<boolean>(false);

  const [whiteListsRequest, setWhiteListsRequest] =
    useState<IWhiteListsRequest>({
      pageIndex: 0,
      pageSize: 10,
      rowCount: 0,
      keyword: "",
    });

  const [addEditWhiteListDto, setAddEditWhiteListDto] =
    useState<IAddEditWhiteListDto>({
      MeetingCode: "",
      NotifyUserId: "",
      type: "add",
      Id: "",
    });

  const [rows, setRows] = useState<IMeetingGroupsDto[]>([]);

  const handleCopyMeetingLink = (link: string) => {
    if (link) {
      const clipboardObj = navigator.clipboard;
      clipboardObj.writeText(link);
      successAction.setTrue();
      setSuccessText("Successfully copied link");
    }
  };

  const getMeetingList = () => {
    const data = {
      PageIndex: whiteListsRequest.pageIndex + 1,
      PageSize: whiteListsRequest.pageSize,
      KeyWord: whiteListsRequest.keyword,
    };
    loadingAction.setTrue();

    GetWhiteLists(data)
      .then((res) => {
        if (res && res.groups) {
          setRows(res.groups ?? []);
          setWhiteListsRequest((prev) => ({ ...prev, rowCount: res.count }));
          loadingAction.setFalse();
        } else {
          failSendAction.setTrue();
          setFailSendText("Table data update failed");
          loadingAction.setFalse();
        }

        loadingAction.setFalse();
      })
      .catch((err) => {
        failSendAction.setTrue();
        setFailSendText((err as Error).message);
        loadingAction.setFalse();
      });
  };

  const handelAddEditWhiteList = () => {
    if (addEditWhiteListDto?.MeetingCode && addEditWhiteListDto.NotifyUserId) {
      const fun =
        addEditWhiteListDto.type === "add"
          ? PostAddWhiteList
          : PostUpdateWhiteList;

      setUpdateLoading(true);

      const ids =
        typeof addEditWhiteListDto.NotifyUserId !== "string"
          ? addEditWhiteListDto.NotifyUserId
          : addEditWhiteListDto.NotifyUserId.split(",").filter((item) => item);
      fun({
        meetingCode: addEditWhiteListDto.MeetingCode,
        notifyUserIds: ids,
      })
        .then((res) => {
          setAddEditWhiteListDto((prev) => ({
            ...prev,
            MeetingCode: "",
            NotifyUserId: "",
          }));
          setOpenAddWhiteList(false);
          getMeetingList();
        })
        .catch((err) => {
          failSendAction.setTrue();
          setFailSendText((err as Error).message);
        })
        .finally(() => setUpdateLoading(false));
    } else {
      failSendAction.setTrue();
      setFailSendText("Please fill in the form completely before submitting");
    }
  };

  const handelDeleteWhiteList = (id: string) => {
    if (id) {
      setDelLoading(true);
      PostDeleteWhiteList(id)
        .then(() => {
          successAction.setTrue();
          setSuccessText("Delete ok");
          confirmDialogAction.setFalse();
          getMeetingList();
        })
        .catch((err) => {
          failSendAction.setTrue();
          setFailSendText((err as Error).message);
        })
        .finally(() => setDelLoading(false));
    } else {
      failSendAction.setTrue();
      setFailSendText("Delete failed, unable to find whitelist ID");
    }
  };

  useEffect(() => {
    getMeetingList();
  }, [whiteListsRequest.pageIndex, whiteListsRequest.pageSize]);

  // 延迟关闭警告提示
  useEffect(() => {
    if (failSend) {
      setTimeout(() => {
        failSendAction.setFalse();
      }, 3000);
    } else if (success) {
      setTimeout(() => {
        successAction.setFalse();
      }, 3000);
    }
  }, [failSend, success]);

  return {
    success,
    failSend,
    failSendText,
    successText,
    whiteListsRequest,
    rows,
    setWhiteListsRequest,
    handleCopyMeetingLink,
    isConfirmDialog,
    confirmDialogAction,
    openAddWhiteList,
    setOpenAddWhiteList,
    addEditWhiteListDto,
    setAddEditWhiteListDto,
    handelAddEditWhiteList,
    updateLoading,
    handelDeleteWhiteList,
    loading,
    delLoading,
  };
};

export default useAction;
