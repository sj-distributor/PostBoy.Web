import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpsData,
  IMessageType,
  MessageType
} from "../../../../dtos/enterprise";

const useAction = () => {
  const [corpsList, setCorpsList] = useState<ICorpsData[]>();
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>();
  const messageTypeList: IMessageType[] = [
    { title: "文本", groupBy: "", type: MessageType.Text },
    { title: "图文", groupBy: "", type: MessageType.ImageText },
    { title: "语音", groupBy: "文件", type: MessageType.Audio },
    { title: "图片", groupBy: "文件", type: MessageType.Image }
  ];
  const [messageParams, setMessageParams] = useState<string>();
  const [corpsValue, setCorpsValue] = useState<ICorpsData>();
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>();
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageType>(
    messageTypeList[0]
  );

  const getCorpAppList = async (corpsDataId: string) => {
    const corpAppResult = await GetCorpAppList({ CorpId: corpsDataId });
    if (corpAppResult) {
      setCorpAppList(corpAppResult);
      setCorpAppValue(corpAppResult[0]);
    }
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
    if (
      corpsList &&
      corpsList.length >= 1 &&
      corpsList[0].corpName !== "None"
    ) {
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
    setMessageTypeValue,
    getCorpAppList,
    handleSubmit,
    handleCorpsListChange
  };
};

export default useAction;
