import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpData,
  IMessageTypeData,
  MessageDataType
} from "../../../../dtos/enterprise";

const useAction = () => {
  const [corpsList, setCorpsList] = useState<ICorpData[]>([]);
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([]);
  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image }
  ];
  const [messageParams, setMessageParams] = useState<string>("");
  const [corpsValue, setCorpsValue] = useState<ICorpData>();
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>();
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  );
  const [isShowCorpAndApp, setIsShowCorpAndApp] = useState(false);

  const getCorpAppList = async (corpsDataId: string) => {
    GetCorpAppList({ CorpId: corpsDataId }).then((corpAppResult) => {
      if (corpAppResult) {
        setCorpAppList(corpAppResult);
        setCorpAppValue(corpAppResult[0]);
      }
    });
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
    corpsValue && getCorpAppList(corpsValue.id);
  }, [corpsValue?.id]);

  useEffect(() => {
    corpsValue !== undefined &&
      corpAppValue !== undefined &&
      setIsShowCorpAndApp(true);
  }, [corpsValue, corpAppValue]);

  return {
    corpsList,
    corpAppList,
    messageTypeList,
    messageParams,
    corpsValue,
    corpAppValue,
    messageTypeValue,
    isShowCorpAndApp,
    setMessageParams,
    setCorpsValue,
    setCorpAppValue,
    setCorpAppList,
    setMessageTypeValue,
    getCorpAppList,
    handleSubmit
  };
};

export default useAction;
