import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpsData,
  IMessageType,
  MessageType
} from "../../../../dtos/enterprise";
import { SlideProps } from "@mui/material/Slide";
import Slide from "@mui/material/Slide";

const useAction = () => {
  const defaultCorp: ICorpsData = {
    id: "",
    corpId: "",
    corpName: "None"
  };
  const defaultCorpApp: ICorpAppData = {
    id: "",
    appId: "",
    workWeChatCorpId: "",
    name: "None",
    secret: "",
    agentId: -1
  };

  const [corpsList, setCorpsList] = useState<ICorpsData[]>([defaultCorp]);
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([
    defaultCorpApp
  ]);
  const messageTypeList: IMessageType[] = [
    { title: "文本", groupBy: "", type: MessageType.Text },
    { title: "图文", groupBy: "", type: MessageType.ImageText },
    { title: "语音", groupBy: "文件", type: MessageType.Audio },
    { title: "图片", groupBy: "文件", type: MessageType.Image }
  ];
  const [messageParams, setMessageParams] = useState<string>();
  const [corpsValue, setCorpsValue] = useState<ICorpsData>(defaultCorp);
  const [corpAppValue, setCorpAppValue] =
    useState<ICorpAppData>(defaultCorpApp);
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageType>();

  const getCorpAppList = async (corpsDataId: string) => {
    const corpAppResult = await GetCorpAppList({ CorpId: corpsDataId });
    if (corpAppResult) {
      setCorpAppList(corpAppResult);
      setCorpAppValue(corpAppResult[0]);
    }
  };

  const TransitionLeft = (props: Omit<SlideProps, "direction">) => {
    return <Slide {...props} direction="right" />;
  };

  const handleCorpsListChange = (data: ICorpsData | null) => {
    if (!!data) {
      setCorpsValue(data);
      getCorpAppList(data.id);
    }
  };

  const handleSubmit = () => {};

  useEffect(() => {
    GetcCorpsList().then((data) => {
      if (data) {
        setCorpsList(data);
        setCorpsValue(data[0]);
        getCorpAppList(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (corpsList.length >= 1 && corpsList[0].corpName !== "None") {
      setCorpsValue(corpsList[0]);
      getCorpAppList(corpsList[0].id);
    }
  }, [corpsList]);

  return {
    corpsList,
    corpAppList,
    messageTypeList,
    messageParams,
    corpsValue,
    corpAppValue,
    messageTypeValue,
    setMessageParams,
    setCorpAppValue,
    setCorpsValue,
    setMessageTypeValue,
    getCorpAppList,
    handleSubmit,
    TransitionLeft,
    handleCorpsListChange
  };
};

export default useAction;
