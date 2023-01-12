import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpData,
  IMessageTypeData,
  MessageDataType
} from "../../../../dtos/enterprise";

const useAction = () => {
  const [corpsList, setCorpsList] = useState<ICorpData[]>();
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>();
  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.ImageText },
    { title: "语音", groupBy: "文件", type: MessageDataType.Audio },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image }
  ];
  const [messageParams, setMessageParams] = useState<string>();
  const [corpsValue, setCorpsValue] = useState<ICorpData>();
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>();
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  );

  const getCorpAppList = async (corpsDataId: string) => {
    const corpAppResult = await GetCorpAppList({ CorpId: corpsDataId });
    if (corpAppResult) {
      setCorpAppList(corpAppResult);
      setCorpAppValue(corpAppResult[0]);
    }
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

  return {
    corpsList,
    corpAppList,
    messageTypeList,
    messageParams,
    corpsValue,
    corpAppValue,
    messageTypeValue,
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
