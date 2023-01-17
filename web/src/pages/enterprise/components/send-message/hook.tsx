import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpData,
  IDepartmentUsersData,
  IMessageTypeData,
  ITargetDialogValue,
  MessageDataType,
  MessageWidgetShowStatus
} from "../../../../dtos/enterprise";

const useAction = () => {
  const [corpsList, setCorpsList] = useState<ICorpData[]>([]);
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([]);
  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "文件", groupBy: "文件", type: MessageDataType.File }
  ];
  const [messageParams, setMessageParams] = useState<string>("");

  const [corpsValue, setCorpsValue] = useState<ICorpData>();
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>();
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  );
  const [departmentUserValue, setDepartmentUserValue] =
    useState<IDepartmentUsersData>();
  const [tagsValue, setTagsValue] = useState<string>("");

  const [isShowCorpAndApp, setIsShowCorpAndApp] = useState<boolean>(false);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll);
  const [isShowMessageParams, setIsShowMessageParams] =
    useState<boolean>(false);

  const [departmentApiAppId, setDepartmentApiAppId] = useState<string>("");

  const setDialogValue = { departmentUserValue, tagsValue };

  const getDialogValue = (dialogData: ITargetDialogValue) => {
    setDepartmentUserValue(dialogData.departmentUserValue);
    setTagsValue(dialogData.tagsValue);
  };

  const handleSubmit = () => {};

  useEffect(() => {
    GetcCorpsList().then((data) => {
      if (data) {
        setCorpsList(data);
        setCorpsValue(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    const getCorpAppList = async (corpsDataId: string) => {
      GetCorpAppList({ CorpId: corpsDataId }).then((corpAppResult) => {
        if (corpAppResult) {
          setCorpAppList(corpAppResult);
          setCorpAppValue(corpAppResult[0]);
        }
      });
    };
    corpsValue && getCorpAppList(corpsValue.id);
  }, [corpsValue?.id]);

  useEffect(() => {
    corpAppValue && setDepartmentApiAppId(corpAppValue.appId);
  }, [corpAppValue]);

  useEffect(() => {
    corpsValue !== undefined &&
      corpAppValue !== undefined &&
      setIsShowCorpAndApp(true);
  }, [corpsValue, corpAppValue]);

  useEffect(() => {
    messageTypeValue.type === MessageDataType.Image && !messageTypeValue.groupBy
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowAll)
      : messageTypeValue.type === MessageDataType.Text
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowInput)
      : (() => {
          setIsShowInputOrUpload(MessageWidgetShowStatus.ShowUpload);
          setMessageParams("");
        })();
  }, [messageTypeValue]);

  return {
    corpsList,
    corpAppList,
    messageTypeList,
    messageParams,
    corpsValue,
    corpAppValue,
    messageTypeValue,
    isShowCorpAndApp,
    isShowDialog,
    isShowInputOrUpload,
    setDialogValue,
    isShowMessageParams,
    departmentApiAppId,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    getDialogValue,
    setIsShowMessageParams
  };
};

export default useAction;
