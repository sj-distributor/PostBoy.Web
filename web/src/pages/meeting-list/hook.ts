import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { GetCorpAppList } from "../../api/enterprise";
import { cancelMeeting, getAllMeetingData } from "../../api/meeting-seetings";
import {
  CancelWorkWeChatMeetingDto,
  GetAllMeetingsData,
  MeetingIdCorpIdAndAppId,
} from "../../dtos/meeting-seetings";

const useAction = () => {
  //组件状态，create会议或update会议
  const [meetingState, setMeetingState] = useState<string>("create");
  const [loading, loadingAction] = useBoolean(false);
  const [success, successAction] = useBoolean(false);
  const [successText, setSuccessText] = useState<string>("");
  const [failSend, failSendAction] = useBoolean(false);
  const [failSendText, setFailSendText] = useState<string>("");
  const [dto, setDto] = useState({
    pageIndex: 0,
    pageSize: 10,
    rowCount: 0,
    ketWord: "",
  });
  const [rows, setRows] = useState<GetAllMeetingsData[]>([]);
  const [isOpenMeetingSettings, setIsOpenMeetingSettings] =
    useState<boolean>(false);
  const [meetingIdCorpIdAndAppId, setMeetingIdCorpIdAndAppId] =
    useState<MeetingIdCorpIdAndAppId | null>();

  const meetingSetting = (data: GetAllMeetingsData) => {
    const { meetingId, workWeChatCorpApplicationId, workWeChatCorpId } = data;
    setMeetingIdCorpIdAndAppId({
      meetingId,
      appId: workWeChatCorpApplicationId,
      corpId: workWeChatCorpId,
    });
    setIsOpenMeetingSettings(true);
    setMeetingState("update");
  };

  const meetingCreate = () => {
    setMeetingIdCorpIdAndAppId(null);
    setIsOpenMeetingSettings(true);
    setMeetingState("create");
  };

  const getAppId = async (
    workWeChatCorpId: string,
    workWeChatCorpApplicationId: string
  ) => {
    let appid = "";
    //获取appId
    await GetCorpAppList({ CorpId: workWeChatCorpId })
      .then((res) => {
        if (res && res.length > 0) {
          res?.map((item) => {
            item.id === workWeChatCorpApplicationId && (appid = item.appId);
          });
        } else {
          failSendAction.setTrue();
          setFailSendText("Failed to obtain application information");
        }
      })
      .catch((err) => {
        failSendAction.setTrue();
        setFailSendText("Failed to obtain application information");
      });
    return appid;
  };

  //取消会议
  const meetingCancel = (data: GetAllMeetingsData) => {
    const { meetingId, workWeChatCorpApplicationId, workWeChatCorpId } = data;

    getAppId(workWeChatCorpId, workWeChatCorpApplicationId).then(
      (appId: string) => {
        if (appId) {
          const cancelData: CancelWorkWeChatMeetingDto = {
            cancelWorkWeChatMeeting: {
              appId,
              meetingid: meetingId,
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
      }
    );
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
    setIsOpenMeetingSettings,
    meetingIdCorpIdAndAppId,
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
  };
};

export default useAction;
