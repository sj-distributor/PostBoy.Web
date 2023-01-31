import { useEffect, useState } from "react";
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetTagsList
} from "../../../../api/enterprise";
import {
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IMessageTypeData,
  ITagsList,
  ITargetDialogValue,
  MessageDataType,
  MessageWidgetShowStatus
} from "../../../../dtos/enterprise";
import { flatten } from "ramda";

const useAction = () => {
  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "文件", groupBy: "文件", type: MessageDataType.File }
  ];
  const [messageParams, setMessageParams] = useState<string>("");

  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  );
  const [tagsValue, setTagsValue] = useState<ITagsList>();

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll);
  const [isShowMessageParams, setIsShowMessageParams] =
    useState<boolean>(false);

  const [corpsList, setCorpsList] = useState<ICorpData[]>([]);
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([]);
  const [corpsValue, setCorpsValue] = useState<ICorpData>();
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>();
  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([]);
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([]);

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<ITagsList[]>([]);

  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        setCorpsList(data);
        setCorpsValue(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    corpsValue &&
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        if (corpAppResult) {
          setCorpAppList(corpAppResult);
          setCorpAppValue(corpAppResult[0]);
          GetTagsList({ AppId: corpAppResult[0].appId }).then((tagsData) => {
            tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist);
          });
        }
      });
  }, [corpsValue?.id]);

  useEffect(() => {
    const loadDeptUsers = async (AppId: string) => {
      setDepartmentList([]);
      const deptListResponse = await GetDepartmentList({ AppId });
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        for (const department of deptListResponse.department) {
          const userList = await GetDepartmentUsersList({
            AppId,
            DepartmentId: department.id
          });
          if (!!userList && userList.errcode === 0) {
            setDepartmentList((prev) => {
              const newValue = prev.filter((e) => !!e);
              newValue.push({
                ...department,
                departmentUserList: userList.userlist.map((e) => {
                  e.selected = false;
                  return e;
                }),
                selected: false
              });
              return newValue;
            });
            setFlattenDepartmentList((prev) => {
              return [
                ...prev,
                ...flatten(userList.userlist).map((item) => ({
                  id: item.userid,
                  name: item.name,
                  parentid: department.name
                }))
              ];
            });

            deptListResponse.department[
              deptListResponse.department.length - 1
            ] === department && setIsTreeViewLoading(false);
          }
        }
      }
    };
    if (!!corpAppValue) {
      setIsTreeViewLoading(true);

      loadDeptUsers(corpAppValue.appId);
    }
  }, [corpAppValue?.appId]);

  const setDialogValue = { deptAndUserValueList: departmentList, tagsValue };

  const getDialogValue = (dialogData: ITargetDialogValue) => {
    setDepartmentList(dialogData.deptAndUserValueList);
    setTagsValue(dialogData.tagsValue);
  };

  const handleSubmit = () => {};

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
    corpsValue,
    corpAppValue,
    messageTypeList,
    messageParams,
    messageTypeValue,
    isShowDialog,
    isShowInputOrUpload,
    setDialogValue,
    isShowMessageParams,
    departmentList,
    isTreeViewLoading,
    tagsList,
    flattenDepartmentList,
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
