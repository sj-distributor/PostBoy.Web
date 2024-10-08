import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import {
  GetWhiteLists,
  PostAddWhiteList,
  PostDeleteWhiteList,
  PostUpdateWhiteList,
} from "../../api/white-list";
import { IIWhiteListsDto } from "../../dtos/white-list";

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
  const [dto, setDto] = useState({
    pageIndex: 0,
    pageSize: 10,
    rowCount: 0,
    ketWord: "",
  });
  const [addEditWhiteListDto, setAddEditWhiteListDto] = useState<{
    MeetingCode: string;
    NotifyUserId: string;
    type: "add" | "edit";
    Id: string;
  }>({
    MeetingCode: "",
    NotifyUserId: "",
    type: "add",
    Id: "",
  });

  const [rows, setRows] = useState<IIWhiteListsDto[]>([]);

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
      PageIndex: dto.pageIndex + 1,
      PageSize: dto.pageSize,
      KeyWord: dto.ketWord,
    };
    loadingAction.setTrue();

    GetWhiteLists(data)
      .then((res) => {
        if (res && res.whitelist) {
          setRows(res.whitelist);
          setDto((prev) => ({ ...prev, rowCount: res.count }));
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
        setFailSendText("Table data update failed");
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
      fun({
        MeetingCode: addEditWhiteListDto.MeetingCode,
        NotifyUserId: addEditWhiteListDto.NotifyUserId,
        Id:
          addEditWhiteListDto.type === "edit"
            ? addEditWhiteListDto.Id
            : undefined,
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
          setFailSendText(`${addEditWhiteListDto.type} failed`);
          loadingAction.setFalse();
        })
        .finally(() => setUpdateLoading(false));
    } else {
      failSendAction.setTrue();
      setFailSendText("Please fill in the form completely before submitting");
      loadingAction.setFalse();
    }
  };

  const handelDeleteWhiteList = (id: string) => {
    if (id) {
      setDelLoading(true);
      PostDeleteWhiteList(id)
        .then(() => {
          failSendAction.setTrue();
          setSuccessText("Delete ok");
          loadingAction.setFalse();
          getMeetingList();
        })
        .finally(() => setDelLoading(false));
    } else {
      failSendAction.setTrue();
      setFailSendText("Delete failed, unable to find whitelist ID");
      loadingAction.setFalse();
    }
  };

  useEffect(() => {
    getMeetingList();
  }, [dto.pageIndex, dto.pageSize]);

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
    dto,
    rows,
    setDto,
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
