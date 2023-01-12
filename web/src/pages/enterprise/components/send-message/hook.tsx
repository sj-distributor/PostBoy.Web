import { useEffect, useState } from "react";
import { GetcCorpsList, GetCorpAppList } from "../../../../api/enterprise";
import { ICorpAppData, ICorpsData, IMessageType } from "../../../../dtos/enterprise";
import { SlideProps } from "@mui/material/Slide";
import Slide from "@mui/material/Slide";

const useAction = () => {
  const [corpsList, setCorpsList] = useState<ICorpsData[]>();
  const [corpAppData, setCorpAppData] = useState<ICorpAppData[]>();
  const [messageTypeList, setMessageTypeList] = useState<IMessageType[]>([
    { title: "文本", groupBy: "" },
    { title: "图文", groupBy: "" },
    { title: "语音", groupBy: "文件" },
    { title: "图片", groupBy: "文件" }
  ]);
  const [messageParams, setMessageParams] = useState<string>();

  const [corpsListSelected, setCorpsListSelected] = useState(false);
  const [corAppValue, setCorAppValue] = useState<ICorpAppData>();
  const [corpsListLoading, setCorpsListLoading] = useState<boolean>(false);
  const [corpAppListLoading, setCorpAppListLoading] = useState<boolean>(false);
  const [isShowTips, setIsShowTips] = useState(false);

  const getCorpAppList = async (corpsDataId: string) => {
    const corpAppResult = await GetCorpAppList({ CorpId: corpsDataId });
    if (corpAppResult) {
      setCorpAppData(corpAppResult);
    }
  };

  const handleCorpAppListClick = () => {
    setIsShowTips(true);
  };

  const handleCorpsListChange = (text: string) => {
    let clickedCorpItem;
    corpsList && text
      ? (clickedCorpItem = corpsList.find((item) => item.corpName === text))
      : setCorAppValue(undefined);
    setCorpsListSelected(!!(corpsList && text));
    clickedCorpItem ? getCorpAppList(clickedCorpItem.id) : setCorpAppData(undefined);
  };

  useEffect(() => {
    GetcCorpsList().then((data) => {
      setCorpsList(data ? data : undefined);
    });
  }, []);

  useEffect(() => {
    setCorpsListLoading(!corpsList || corpsList.length <= 0);
    setCorpAppListLoading((!corpAppData || corpAppData.length <= 0) && !!corpsListSelected);
  }, [corpAppData, corpsList, corpsListSelected]);

  const handleSubmit = () => {};

  function TransitionLeft(props: Omit<SlideProps, "direction">) {
    return <Slide {...props} direction="right" />;
  }

  return {
    corpsList,
    corpAppData,
    messageTypeList,
    messageParams,
    corAppValue,
    corpsListLoading,
    corpAppListLoading,
    isShowTips,
    setIsShowTips,
    setMessageParams,
    getCorpAppList,
    handleSubmit,
    handleCorpAppListClick,
    TransitionLeft,
    handleCorpsListChange
  };
};

export default useAction;
