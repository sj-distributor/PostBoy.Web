import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import { ICorpAppData, ICorpsData } from "../../../../dtos/enterprise";

const useAction = () => {
  const defaultCorpsList = [{ corpId: "", corpName: "", id: "" }];
  const defaultCorpAppData = [
    { agentId: 0, appId: "", id: "", name: "", secret: "", workWeChatCorpId: "" }
  ];
  const [corpsList, setCorpsList] = useState<ICorpsData[]>(defaultCorpsList);
  const [corpAppData, setCorpAppData] = useState<ICorpAppData[]>(defaultCorpAppData);
  const [messageTypeList, setMessageTypeList] = useState<string[]>([]);
  const [messageParams, setMessageParams] = useState<string[]>([]);

  const getCorpAppList = async (corpsDataId: string) => {
    setCorpAppData(corpAppData);
    const corpAppResult = await GetCorpAppList({ CorpId: corpsDataId });
    // console.log(corpAppResult);
    if (corpAppResult) {
      setCorpAppData(corpAppResult);
    }
  };

  const handleCorpsListChange = (text: string) => {
    const result = corpsList.find((item) => item.corpName === text);
    result ? getCorpAppList(result.id) : setCorpAppData(defaultCorpAppData);
  };

  useEffect(() => {
    GetcCorpsList().then((data) => {
      setCorpsList(defaultCorpsList);
      if (data) {
        setCorpsList(data);
      } else {
        setCorpsList(defaultCorpsList);
      }
    });
  }, []);

  const handleSubmit = () => {};

  return {
    corpsList,
    corpAppData,
    messageTypeList,
    messageParams,
    getCorpAppList,
    handleSubmit,
    handleCorpsListChange
  };
};

export default useAction;
