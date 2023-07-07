import { useBoolean } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { cancelMeeting, getAllMeetingData } from "../../api/meeting-seetings";
import {
  CancelWorkWeChatMeetingDto,
  CandelDto,
  GetAllMeetingsData,
} from "../../dtos/meeting-seetings";

const useAction = () => {
  //组件状态，create会议或update会议
  const [meetingState, setMeetingState] = useState<string>("create");
  const [loading, loadingAction] = useBoolean(false);
  const [success, successAction] = useBoolean(false);
  const [successText, setSuccessText] = useState<string>("");
  const [failSend, failSendAction] = useBoolean(false);
  const [failSendText, setFailSendText] = useState<string>("");
  const [isConfirmDialog, confirmDialogAction] = useBoolean(false);
  const [candelDto, setCandelDto] = useState<CandelDto>();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const [dto, setDto] = useState({
    pageIndex: 0,
    pageSize: 10,
    rowCount: 0,
    ketWord: "",
  });
  const [rows, setRows] = useState<GetAllMeetingsData[]>([]);
  const [isOpenMeetingSettings, setMeetingData] = useState<boolean>(false);
  const [meetingData, setGetAllMeetingsData] =
    useState<GetAllMeetingsData | null>();

  const meetingSetting = (data: GetAllMeetingsData) => {
    setGetAllMeetingsData(data);
    setMeetingData(true);
    setMeetingState("update");
  };

  const meetingCreate = () => {
    setGetAllMeetingsData(null);
    setMeetingData(true);
    setMeetingState("create");
  };

  //取消会议
  const meetingCancel = (data: GetAllMeetingsData) => {
    confirmDialogAction.setTrue();
    const { meetingId, workWeChatCorpApplicationId, workWeChatCorpId } = data;
    setCandelDto({ meetingId, workWeChatCorpApplicationId, workWeChatCorpId });
  };

  const getMeetingList = () => {
    const data = {
      PageIndex: dto.pageIndex + 1,
      PageSize: dto.pageSize,
      KeyWord: dto.ketWord,
    };
    loadingAction.setTrue();

    getAllMeetingData(data)
      .then((res) => {
        if (res && res.meetings.length >= 0) {
          setRows([...res?.meetings]);
          setDto((prev) => ({ ...prev, rowCount: res.rowCount }));
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

  const searchMeeting = () => {
    setDto((prev) => ({ ...prev, pageIndex: 0 }));
    getMeetingList();
  };

  const handleCopyMeetingLink = (link: string) => {
    if (link) {
      const clipboardObj = navigator.clipboard;
      clipboardObj.writeText(link);
      successAction.setTrue();
      setSuccessText("Successfully copied link");
    }
  };

  const confirmDelete = () => {
    if (candelDto) {
      confirmDialogAction.setFalse();
      const cancelData: CancelWorkWeChatMeetingDto = {
        cancelWorkWeChatMeeting: {
          appId: candelDto.workWeChatCorpApplicationId,
          meetingid: candelDto.meetingId,
        },
      };

      loadingAction.setTrue();

      cancelMeeting(cancelData)
        .then((res) => {
          if (res && res.errcode === 0) {
            successAction.setTrue();
            setSuccessText("Successfully cancelled the meeting");
            getMeetingList();
            loadingAction.setFalse();
          } else {
            setFailSendText("Cancel meeting failed");
            failSendAction.setTrue();
          }
          loadingAction.setFalse();
        })
        .catch((err) => {
          failSendAction.setTrue();
          setFailSendText("Cancel meeting failed");
          loadingAction.setFalse();
        });
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
    rows,
    isOpenMeetingSettings,
    setMeetingData,
    meetingData,
    success,
    failSend,
    loading,
    meetingSetting,
    meetingCancel,
    meetingCreate,
    getMeetingList,
    meetingState,
    failSendText,
    successText,
    dto,
    setDto,
    searchMeeting,
    handleCopyMeetingLink,
    isConfirmDialog,
    confirmDialogAction,
    confirmDelete,
    cancelBtnRef,
  };
};

export default useAction;
