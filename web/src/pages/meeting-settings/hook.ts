import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";
import {
  CalendarSelectData,
  DefaultDisplay,
  ReminderTimeSelectData,
  RepeatSelectData,
  SelectGroupType,
} from "../../dtos/meeting-seetings";
import { ICorpAppData, ICorpData } from "../../dtos/enterprise";
import { GetCorpAppList, GetCorpsList } from "../../api/enterprise";
import {
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IDeptAndUserList,
  ILastShowTableData,
  ISearchList,
  ITagsList,
  IWorkCorpAppGroup,
  SendObject,
  SendObjOrGroup,
} from "../../dtos/enterprise";
import { clone, flatten } from "ramda";
import { GetDeptsAndUserList } from "../../api/enterprise";

const useAction = () => {
  // 拿到的企业对象
  const [corpsValue, setCorpsValue] = useState<ICorpData>({
    corpName: "",
    corpId: "",
    id: "",
  });
  // 拿到的App对象
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>({
    appId: "",
    id: "",
    name: "",
    workWeChatCorpId: "",
    display: true,
    agentId: 0,
  });
  // 获取的企业数组
  const [corpsList, setCorpsList] = useState<ICorpData[]>([]);
  // 获取的App数组
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([]);
  const [isNewOrUpdate, setIsNewOrUpdate] = useState<string>("new");
  const [participantList, setParticipantList] =
    useState<IDepartmentAndUserListValue[]>();
  const [isShowMoreParticipantList, setIsShowMoreParticipantList] =
    useState<boolean>(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);
  const [selectGroup, setSelectGroup] = useState<SelectGroupType[]>([
    {
      title: "提醒",
      key: "reminderTime",
      value: "",
      data: [
        {
          value: ReminderTimeSelectData.FifteenMinutesAgo,
          lable: "十五分钟前",
        },
        {
          value: ReminderTimeSelectData.MeetingBegins,
          lable: "会议开始时",
        },
        {
          value: ReminderTimeSelectData.AnHourAgo,
          lable: "一小时前",
        },
      ],
    },
    {
      title: "重复",
      key: "repeat",
      value: "",
      data: [
        {
          value: RepeatSelectData.Repeat,
          lable: "不重复",
        },
        {
          value: RepeatSelectData.NoRepeat,
          lable: "重复",
        },
      ],
    },
    {
      title: "日历",
      key: "calendar",
      value: "",
      isIcon: true,
      data: [
        {
          value: CalendarSelectData.CalendarForMARS,
          lable: "MARS.PENG的日历",
        },
        {
          value: CalendarSelectData.CalendarForELK,
          lable: "ELK的日历",
        },
        {
          value: CalendarSelectData.CalendarForJKL,
          lable: "JKL的日历",
        },
      ],
    },
  ]);
  const [openAnnexList, setOpenAnnexList] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpenAnnexList((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenAnnexList(false);
  };

  const getEndDate = (data: string) => {};
  const getStartDate = (data: string) => {};
  const getEndTime = (data: string) => {};
  const getStartTime = (data: string) => {};
  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null);
  const [html, setHtml] = useState<string>("");
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入描述",
  };
  const toolbarConfig: Partial<wangEditor.IToolbarConfig> = {
    toolbarKeys: [
      "bold",
      "bulletedList",
      "numberedList",
      "justifyJustify",
      "delIndent",
      "indent",
    ],
  };

  const handleChange = (event: SelectChangeEvent, type: string) => {
    const newList = selectGroup;

    newList.forEach(
      (item) => item.key === type && (item.value = event.target.value)
    );

    setSelectGroup(newList);
  };
  // 文件上传
  const [annexFile, setAnnexFile] = useState<File[] | []>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const inputRef = useRef<HTMLInputElement>(null);
  //选择人员
  // 弹出选择对象框 boolean
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  // 部门和用户数组
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([]);
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([]);
  // TreeView显示展开
  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false);
  // 获取的Tags数组
  const [tagsList, setTagsList] = useState<ITagsList[]>([]);
  // 群组列表
  const [groupList, setGroupList] = useState<IWorkCorpAppGroup[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [sendType, setSendType] = useState<SendObjOrGroup>(
    SendObjOrGroup.Object
  );
  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([]);
  // 上次上传的tagsList
  const [lastTimeTagsList, setLastTimeTagsList] = useState<string[]>([]);
  const [clickName, setClickName] = useState<string>("选择参会人");
  const [isUpdatedDeptUser, setIsUpdatedDeptUser] = useState(false);
  //  拉取数据旋转
  const [isLoadStop, setIsLoadStop] = useState<boolean>(false);
  const [updateMessageJobInformation, setUpdateMessageJobInformation] =
    useState<ILastShowTableData>();
  const [sendObject, setSendObject] = useState<SendObject>({
    toUsers: [],
    toParties: [],
  });
  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find(
      (e) => e.key === corpAppValue?.appId
    );
    return result as IDepartmentKeyControl;
  }, [departmentAndUserList, corpAppValue?.appId]);
  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find(
      (e) => e.key === corpAppValue?.appId
    );
    return result?.data as IDepartmentAndUserListValue[];
  }, [flattenDepartmentList, corpAppValue?.appId]);

  const recursiveDeptList = (
    hasData: IDepartmentAndUserListValue[],
    defaultChild: IDepartmentAndUserListValue,
    department: IDepartmentData,
    parentRouteId: number[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key];
      parentRouteId.push(Number(e.id));
      if (e.id === department.parentid) {
        e.children.push(defaultChild);
        return parentRouteId;
      }
      if (e.children.length > 0) {
        const idList: number[] = recursiveDeptList(
          e.children,
          defaultChild,
          department,
          [...parentRouteId]
        );
        if (idList.length !== parentRouteId.length) return idList;
        parentRouteId.pop();
      } else {
        parentRouteId.pop();
      }
    }
    return parentRouteId;
  };

  const loadDeptUsers = async (
    AppId: string,
    deptListResponse: IDeptAndUserList[]
  ) => {
    const copyDeptListResponse = deptListResponse.sort(
      (a, b) => a.department.id - b.department.id
    );
    for (let index = 0; index < copyDeptListResponse.length; index++) {
      // 当前的部门
      const department = copyDeptListResponse[index].department;
      // 当前的用户列表
      const users = copyDeptListResponse[index].users;

      // 需要插入的数据
      const defaultChild: IDepartmentAndUserListValue = {
        id: department.id,
        name: department.name,
        type: DepartmentAndUserType.Department,
        parentid: String(department.parentid),
        selected: false,
        children: users.map((item) => ({
          id: item.userid,
          name: item.userid,
          type: DepartmentAndUserType.User,
          parentid: item.department,
          selected: false,
          isCollapsed: false,
          canSelect: true,
          children: [],
        })),
      };

      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev);
        const hasData = newValue.find((e) => e.key === AppId);
        let idList = [];
        // 是否现有key的数据
        hasData && hasData.data.length > 0
          ? (idList = recursiveDeptList(
              hasData.data,
              defaultChild,
              department,
              []
            ))
          : newValue.push({ key: AppId, data: [defaultChild] });
        idList.length === 0 && hasData?.data.push(defaultChild);
        return newValue;
      });

      setFlattenDepartmentList((prev) => {
        const newValue = clone(prev);
        let hasData = newValue.find((e) => e.key === AppId);
        const insertData = [
          {
            id: department.id,
            name: department.name,
            parentid: department.name,
            type: DepartmentAndUserType.Department,
            selected: false,
            children: [],
          },
          ...flatten(
            users.map((item) => ({
              id: item.userid,
              name: item.userid,
              parentid: department.name,
              type: DepartmentAndUserType.User,
              selected: false,
              canSelect: true,
              children: [],
            }))
          ),
        ];
        hasData
          ? (hasData.data = [...hasData.data, ...insertData])
          : newValue.push({
              key: AppId,
              data: insertData,
            });
        return newValue;
      });

      if (index === copyDeptListResponse.length - 1) {
        setIsTreeViewLoading(false);
        setIsLoadStop(true);
      }
    }
  };
  //指定提醒人员
  const [appointList, setAppointList] =
    useState<IDepartmentAndUserListValue[]>();
  //指定主持人
  const [hostList, setHostList] = useState<IDepartmentAndUserListValue[]>();

  const loadSelectData = useMemo(() => {
    const result =
      clickName === "选择参会人"
        ? participantList
        : clickName === "选择指定提醒人员"
        ? appointList
        : clickName === "选择指定主持人"
        ? hostList
        : undefined;

    return result as IDepartmentAndUserListValue[];
  }, [participantList, appointList, hostList, clickName]);
  //获取选择人员
  const getSelectData = (data: IDepartmentAndUserListValue[]) => {
    clickName === "选择参会人" && setParticipantList([...data]);
    clickName === "选择指定提醒人员" && setAppointList([...data]);
    clickName === "选择指定主持人" && setHostList([...data]);
  };

  const setParticipant = () => {
    setClickName("选择参会人");
    setIsShowDialog(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const uploadAnnex = () => {
    inputRef.current?.click();
  };

  const fileUpload = async (
    files: FileList,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const array = Array.from(files);
    setAnnexFile(array);
  };

  const fileDelete = (name: string, index?: number) => {
    const newFileList = annexFile.filter((item, i) => i !== index);
    setAnnexFile(newFileList);
  };

  // 初始化企业数组
  useEffect(() => {
    GetCorpsList().then((data) => {
      data && setCorpsList(data);
    });
  }, []);

  // 默认选择第一个企业对象
  useEffect(() => {
    !corpsValue.corpId && corpsList.length > 0 && setCorpsValue(corpsList[0]);
  }, [corpsList]);

  // 初始化App数组
  useEffect(() => {
    !!corpsValue.corpId &&
      GetCorpAppList({ CorpId: corpsValue.id }).then(
        (corpAppResult: ICorpAppData[] | null | undefined) => {
          if (corpAppResult) {
            setCorpAppList(corpAppResult.filter((x) => x.display));
          }
        }
      );
  }, [corpsValue?.id]);

  // 默认选择第一个App对象
  useEffect(() => {
    isNewOrUpdate === "new" &&
      corpAppList.length > 0 &&
      setCorpAppValue(corpAppList[0]);
  }, [corpAppList, isNewOrUpdate]);

  useEffect(() => {
    participantList &&
      participantList.length > DefaultDisplay.Participant &&
      setIsShowMoreParticipantList(true);
  }, [participantList]);

  useEffect(() => {
    const loadDepartment = async (AppId: string) => {
      setIsTreeViewLoading(true);
      const deptListResponse = await GetDeptsAndUserList(AppId);
      if (deptListResponse && deptListResponse.workWeChatUnits.length === 0)
        setIsTreeViewLoading(false);

      !!deptListResponse &&
        loadDeptUsers(AppId, deptListResponse.workWeChatUnits);
    };
    if (
      isShowDialog &&
      !!corpAppValue &&
      !departmentAndUserList.find((e) => e.key === corpAppValue.appId)
    ) {
      // 设置相对应key的数据为空
      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev);
        const hasData = newValue.find((e) => e.key === corpAppValue.appId);
        hasData && (hasData.data = []);
        return newValue;
      });
      setFlattenDepartmentList((prev) => {
        const newValue = clone(prev);
        const hasData = newValue.find((e) => e.key === corpAppValue.appId);
        hasData && (hasData.data = []);
        return newValue;
      });

      !updateMessageJobInformation?.workWeChatAppNotification &&
        setSendObject({
          toUsers: [],
          toParties: [],
        });
      // 开始load数据
      setIsLoadStop(false);
      loadDepartment(corpAppValue.appId);
    }
  }, [corpAppValue?.appId, isShowDialog]);

  return {
    editor,
    html,
    toolbarConfig,
    editorConfig,
    selectGroup,
    openAnnexList,
    anchorRef,
    openSettingsDialog,
    annexFile,
    inputRef,
    open,
    anchorEl,
    corpsValue,
    corpAppValue,
    corpsList,
    corpAppList,
    participantList,
    isShowMoreParticipantList,
    isShowDialog,
    departmentAndUserList,
    departmentKeyValue,
    searchKeyValue,
    isTreeViewLoading,
    tagsList,
    groupList,
    DeptUserCanSelectStatus,
    tagsValue,
    lastTimeTagsList,
    clickName,
    chatId,
    sendType,
    isUpdatedDeptUser,
    loadSelectData,
    appointList,
    hostList,
    setCorpsValue,
    setGroupList,
    setIsShowDialog,
    setDepartmentAndUserList,
    setTagsValue,
    setIsRefresh,
    setChatId,
    setSendType,
    setIsShowMoreParticipantList,
    setCorpAppValue,
    handleClick,
    handleCloseMenu,
    uploadAnnex,
    setOpenSettingsDialog,
    handleChange,
    setHtml,
    setEditor,
    handleToggle,
    handleClose,
    getEndDate,
    getStartDate,
    getEndTime,
    getStartTime,
    fileUpload,
    fileDelete,
    getSelectData,
    setParticipant,
    setClickName,
  };
};

export default useAction;
