import { useEffect, useMemo, useState } from "react";
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
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentData[]
  >([]);
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([]);
  const [departmentPage, setDepartmentPage] = useState({
    pageNumber: 0,
    listLength: 0
  });

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<ITagsList[]>([]);

  const onScrolling = (
    scrollHeight: number,
    scrollTop: number,
    clientHeight: number
  ) => {
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setDepartmentPage((prev) => ({
        ...prev,
        pageNumber:
          prev.pageNumber + 10 >= departmentList.length - 1
            ? departmentList.length - 1
            : prev.pageNumber + 10
      }));
    }
  };

  const loadDeptUsers = async (
    AppId: string,
    deptListResponse: IDepartmentData[]
  ) => {
    const limit =
      departmentPage.pageNumber + 10 >= deptListResponse.length - 1
        ? deptListResponse.length - 1
        : departmentPage.pageNumber + 10;

    for (let index = departmentPage.pageNumber; index <= limit; index++) {
      const department = deptListResponse[index];
      const userList = await GetDepartmentUsersList({
        AppId,
        DepartmentId: department.id
      });
      if (!!userList && userList.errcode === 0) {
        setDepartmentAndUserList((prev) => {
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
        index === limit - 1 && setIsTreeViewLoading(false);
      }
    }
  };

  useEffect(() => {
    corpAppValue && loadDeptUsers(corpAppValue.appId, departmentList);
  }, [departmentPage.pageNumber]);

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
    const loadDepartment = async (AppId: string) => {
      const deptListResponse = await GetDepartmentList({ AppId });
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        setDepartmentPage((prev) => ({
          ...prev,
          listLength: deptListResponse.department.length
        }));
        setDepartmentList(deptListResponse.department);
        loadDeptUsers(AppId, deptListResponse.department);
      }
    };
    setDepartmentAndUserList([]);
    setDepartmentPage((prev) => ({ ...prev, pageNumber: 0 }));
    if (!!corpAppValue) {
      setIsTreeViewLoading(true);
      loadDepartment(corpAppValue.appId);
    }
  }, [corpAppValue?.appId]);

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
    isShowMessageParams,
    departmentAndUserList,
    isTreeViewLoading,
    tagsList,
    flattenDepartmentList,
    setDepartmentAndUserList,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    setIsShowMessageParams,
    onScrolling
  };
};

export default useAction;
