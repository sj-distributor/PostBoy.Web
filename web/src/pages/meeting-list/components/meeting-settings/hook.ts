import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";
import {
  CreateOrUpdateWorkWeChatMeetingDto,
  DefaultDisplay,
  GetWorkWeChatMeeting,
  IsRepeat,
  MeetingDuration,
  MeetingSettingsProps,
  ReminderTimeSelectData,
  RepeatSelectData,
  SelectDataType,
  SelectGroupType,
  WorkWeChatMeetingReminderDto,
  WorkWeChatMeetingSettingDto,
} from "../../../../dtos/meeting-seetings";
import { ICorpAppData, ICorpData } from "../../../../dtos/enterprise";
import { GetCorpAppList, GetCorpsList } from "../../../../api/enterprise";
import {
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IDeptAndUserList,
  ISearchList,
  ITagsList,
  IWorkCorpAppGroup,
  SendObjOrGroup,
} from "../../../../dtos/enterprise";
import { clone, flatten } from "ramda";
import { GetDeptsAndUserList } from "../../../../api/enterprise";
import {
  createMeeting,
  getMeetingData,
  updateMeeting,
} from "../../../../api/meeting-seetings";
import { useBoolean } from "ahooks";

dayjs.extend(utc);
dayjs.extend(timezone);

const useAction = (props: MeetingSettingsProps) => {
  const {
    meetingIdCorpIdAndAppId,
    isOpenMeetingSettings,
    getMeetingList,
    meetingState,
  } = props;

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
  const [participantList, setParticipantList] =
    useState<IDepartmentAndUserListValue[]>();
  const [isShowMoreParticipantList, setIsShowMoreParticipantList] =
    useState<boolean>(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<IDepartmentAndUserListValue[]>([]);
  const [selectGroup, setSelectGroup] = useState<SelectGroupType[]>([
    {
      title: "提醒",
      key: "reminderTime",
      value: ReminderTimeSelectData.MeetingBegins,
      data: [
        {
          value: ReminderTimeSelectData.MeetingBegins,
          lable: "会议开始时",
        },
        {
          value: ReminderTimeSelectData.FiveMinutesAgo,
          lable: "五分钟前",
        },
        {
          value: ReminderTimeSelectData.FifteenMinutesAgo,
          lable: "十五分钟前",
        },
        {
          value: ReminderTimeSelectData.AnHourAgo,
          lable: "一小时前",
        },
        {
          value: ReminderTimeSelectData.TheDayBefore,
          lable: "一天前",
        },
      ],
    },
    {
      title: "重复",
      key: "repeat",
      value: RepeatSelectData.NoRepeat,
      data: [
        {
          value: RepeatSelectData.NoRepeat,
          lable: "不重复",
        },
        {
          value: RepeatSelectData.EveryDay,
          lable: "每天重复",
        },
        {
          value: RepeatSelectData.Weekly,
          lable: "每周重复",
        },
        {
          value: RepeatSelectData.Monthly,
          lable: "每月重复",
        },
        {
          value: RepeatSelectData.EveryWorkingDay,
          lable: "每个工作日重复",
        },
      ],
    },
  ]);
  const [meetingDuration, setMeetingDuration] = useState<{
    value: number;
    menuItemList: SelectDataType[];
  }>({
    value: MeetingDuration.Minutes,
    menuItemList: [
      {
        value: MeetingDuration.Minutes,
        lable: "三十分钟",
      },
      {
        value: MeetingDuration.OneHour,
        lable: "一小时",
      },
      {
        value: MeetingDuration.TwoHours,
        lable: "两小时",
      },
      {
        value: MeetingDuration.ThreeHours,
        lable: "三小时",
      },
      {
        value: MeetingDuration.CustomEndTime,
        lable: "自定义会议时长",
      },
    ],
  });
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

  const handleChange = (value: string | number, type: string) => {
    const newList = selectGroup;
    newList.forEach((item) => item.key === type && (item.value = value));
    setSelectGroup(newList);
    if (type === "repeat") {
      //周期时间预设三个月
      const repeat_until = Math.ceil(
        dayjs(new Date().setMonth(new Date().getMonth() + 3)).valueOf() / 1000
      );

      setMeetingReminders((reminders) => {
        let data = clone(reminders);
        data.is_repeat =
          value !== RepeatSelectData.NoRepeat
            ? IsRepeat.PeriodicMeetings
            : IsRepeat.NonRecurringMeetings;
        data.repeat_type =
          value === RepeatSelectData.NoRepeat
            ? RepeatSelectData.EveryDay
            : +value;
        data.repeat_until = repeat_until;
        return data;
      });
    }

    if (type === "reminderTime") {
      setMeetingReminders((reminders) => {
        let data = clone(reminders);
        data.remind_before = [+value];
        return data;
      });
    }
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
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [departmentAndUserListBackups, setDepartmentAndUserListBackups] =
    useState<IDepartmentKeyControl[]>([]);
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([]);
  const [flattenDepartmentListBackups, setFlattenDepartmentListBackups] =
    useState<ISearchList[]>([]);
  // TreeView显示展开
  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false);
  // 获取的Tags数组
  const [tagsList, setTagsList] = useState<ITagsList[]>([]);
  // 群组列表
  const [groupList, setGroupList] = useState<IWorkCorpAppGroup[]>([]);
  const [chatId, setChatId] = useState<string>("");
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
        setDepartmentAndUserListBackups(newValue);
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
        setFlattenDepartmentListBackups(newValue);
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
  const [tipsObject, setTipsObject] = useState({
    show: false,
    msg: "",
  });

  const loadSelectData = useMemo(() => {
    const result =
      clickName === "选择参会人"
        ? participantList
        : clickName === "选择指定提醒人员"
        ? appointList
        : clickName === "选择指定主持人"
        ? hostList
        : clickName === "指定会议管理员"
        ? adminUser
        : undefined;

    return result as IDepartmentAndUserListValue[];
  }, [participantList, appointList, hostList, clickName, adminUser]);

  const getUserChildrenData = (
    arr: IDepartmentAndUserListValue[],
    newArr: IDepartmentAndUserListValue[]
  ) => {
    arr.map((item) => {
      if (
        item.children.length < 1 &&
        newArr.findIndex((i) => i.id === item.id) === -1
      ) {
        newArr.push(item);
      } else {
        getUserChildrenData(item.children, newArr);
      }
    });
    return newArr;
  };

  //显示全部人员
  const participantLists = useMemo(() => {
    let arr = participantList && getUserChildrenData(participantList, []);
    return arr as IDepartmentAndUserListValue[];
  }, [participantList]);

  const appointLists = useMemo(() => {
    let arr = appointList && getUserChildrenData(appointList, []);
    return arr as IDepartmentAndUserListValue[];
  }, [appointList]);

  const hostLists = useMemo(() => {
    let arr = hostList && getUserChildrenData(hostList, []);
    if (arr && arr.length > DefaultDisplay.hostList) {
      tipsObject &&
        setTipsObject({
          show: true,
          msg: "Cannot select department and up to ten hosts",
        });
      setHostList([]);
      return (arr = []);
    }
    return arr as IDepartmentAndUserListValue[];
  }, [hostList]);

  useEffect(() => {
    // 3s关闭提示
    const number = setTimeout(() => {
      if (tipsObject.show) {
        setTipsObject({ msg: "", show: false });
      }
    }, 3000);
    return () => {
      clearTimeout(number);
    };
  }, [tipsObject.show]);

  //获取选择人员
  const handleGetSelectData = (data: IDepartmentAndUserListValue[]) => {
    const personnelData = getUserChildrenList(
      departmentKeyValue?.data,
      data,
      []
    );
    if (clickName === "选择参会人") {
      setParticipantList([...personnelData]);
    }

    clickName === "选择指定提醒人员" && setAppointList([...personnelData]);
    clickName === "选择指定主持人" && setHostList([...personnelData]);

    if (clickName === "指定会议管理员") {
      setAdminUser([...personnelData]);
      setParticipantList([...personnelData]);
    }
  };

  const getUserChildrenList = (
    hasData: IDepartmentAndUserListValue[],
    data: IDepartmentAndUserListValue[],
    personnelData: IDepartmentAndUserListValue[]
  ) => {
    data.forEach((i) => {
      for (const key in hasData) {
        i.id === hasData[key].id &&
          personnelData.findIndex((item) => item === hasData[key]) === -1 &&
          personnelData.push(hasData[key]);
        hasData[key].children.length > 0 &&
          getUserChildrenList(hasData[key].children, data, personnelData);
      }
    });
    return personnelData;
  };

  const onSetParticipant = () => {
    setClickName("选择参会人");
    setDepartmentAndUserList(departmentAndUserListBackups);
    setFlattenDepartmentList(flattenDepartmentListBackups);
    setIsShowDialog(true);
  };

  const onSetAdminUser = () => {
    setClickName("指定会议管理员");
    setDepartmentAndUserList(departmentAndUserListBackups);
    setFlattenDepartmentList(flattenDepartmentListBackups);
    setIsShowDialog(true);
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

  // 默认选择企业对象
  useEffect(() => {
    !corpsValue.corpId && corpsList.length > 0 && setCorpsValue(corpsList[0]);
  }, [corpsList]);

  useEffect(() => {
    meetingIdCorpIdAndAppId &&
      setCorpsValue(
        corpsList.filter(
          (item) => item.id === meetingIdCorpIdAndAppId.corpId
        )[0]
      );
  }, [meetingIdCorpIdAndAppId]);

  // 初始化App数组
  useEffect(() => {
    if (!!corpsValue.id) {
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        setAppLoading(false);
        corpAppResult && setCorpAppList(corpAppResult.filter((x) => x.display));
      });
    }
  }, [corpsValue?.id]);

  // 默认选择App对象
  useEffect(() => {
    setCorpAppValue(
      corpAppList.length > 0
        ? meetingIdCorpIdAndAppId
          ? corpAppList.filter(
              (item) => item.id === meetingIdCorpIdAndAppId.appId
            )[0]
          : corpAppList[0]
        : {
            appId: "",
            id: "",
            name: "",
            workWeChatCorpId: "",
            display: true,
            agentId: 0,
          }
    );
  }, [corpAppList]);

  useEffect(() => {
    participantLists &&
      participantLists.length > DefaultDisplay.Participant &&
      setIsShowMoreParticipantList(true);
  }, [participantLists]);

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
      isOpenMeetingSettings &&
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

      // 开始load数据
      setIsLoadStop(false);
      corpAppValue?.appId && loadDepartment(corpAppValue.appId);
    }
  }, [corpAppValue?.appId, isOpenMeetingSettings]);

  const clearData = () => {
    setAppointList([]);
    setHostList([]);
    setParticipantList([]);
    setDepartmentAndUserList([]);
    setDepartmentAndUserListBackups([]);
    setMeetingLocation("");
    setMeetingTitle("");
    setHtml("");
    setAdminUser([]);
    setSettings({
      password: null,
      enable_waiting_room: false,
      allow_enter_before_host: true,
      remind_scope: 3,
      enable_enter_mute: 0,
      allow_external_user: true,
      enable_screen_watermark: false,
      hosts: undefined,
      ring_users: undefined,
    });
  };

  const [loading, loadingAction] = useBoolean(false);
  const [success, successAction] = useBoolean(false);
  const [failSend, failSendAction] = useBoolean(false);
  const [meetingReminders, setMeetingReminders] = useState<
    Partial<WorkWeChatMeetingReminderDto>
  >({});
  const [meetingTitle, setMeetingTitle] = useState<string>(" ");
  const [meetingStartDate, setMeetingStartDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [customEndTime, customEndTimeAction] = useBoolean(false);
  const [meetingStartTime, setMeetingStartTime] = useState<string>(
    dayjs()
      .set("minutes", dayjs().get("minutes") + 5)
      .format("HH:mm")
  );
  const [meetingEndDate, setMeetingEndDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [meetingEndTime, setMeetingEndTime] = useState<string>(
    dayjs()
      .set("hours", dayjs().get("hours") + 1)
      .set("minutes", dayjs().get("minutes") + 5)
      .format("HH:mm")
  );
  const [meetingLocation, setMeetingLocation] = useState<string>("");
  const [settings, setSettings] = useState<WorkWeChatMeetingSettingDto>({
    password: null,
    enable_waiting_room: false,
    allow_enter_before_host: true,
    remind_scope: 1,
    enable_enter_mute: 0,
    allow_external_user: true,
    enable_screen_watermark: false,
    hosts: undefined,
    ring_users: undefined,
  });

  const onCreateUpdateMeeting = async () => {
    if (!loading) {
      loadingAction.setTrue();
      const meeting_start = Math.ceil(
        dayjs(meetingStartDate + " " + meetingStartTime).valueOf() / 1000
      );
      let meeting_duration;

      if (customEndTime) {
        const meeting_end = Math.ceil(
          dayjs(meetingEndDate + " " + meetingEndTime).valueOf() / 1000
        );
        meeting_duration = meeting_end - meeting_start;
      } else {
        meeting_duration = meetingDuration.value;
      }

      let attendeesList: string[] = [];

      participantLists.map((item) => attendeesList.push(item.id + ""));
      const admin_userid = adminUser
        ? adminUser.length > 0
          ? adminUser[0].id
          : ""
        : "";

      let settingsData = clone(settings);
      if (!settingsData.hosts) {
        delete settingsData.hosts;
      }
      if (!settingsData.ring_users) {
        delete settingsData.ring_users;
      }
      const createOrUpdateMeetingData: CreateOrUpdateWorkWeChatMeetingDto = {
        appId: corpAppValue.appId,
        admin_userid: admin_userid + "",
        title: meetingTitle,
        meeting_start,
        meeting_duration,
        description: editor?.getText(),
        location: meetingLocation,
        settings: settingsData,
        attendees: {
          userid: attendeesList,
        },
        reminders: meetingReminders,
      };

      attendeesList.findIndex(
        (item) => item === createOrUpdateMeetingData.admin_userid
      ) === -1 &&
        setTipsObject({
          show: true,
          msg: "Administrators must attend the meeting",
        });
      !createOrUpdateMeetingData.appId &&
        setTipsObject({
          show: true,
          msg: "No application selected",
        });
      !createOrUpdateMeetingData.admin_userid &&
        setTipsObject({
          show: true,
          msg: "Failed to obtain account information",
        });
      !createOrUpdateMeetingData.title &&
        setTipsObject({
          show: true,
          msg: "Not filled in title",
        });
      !createOrUpdateMeetingData.meeting_start &&
        setTipsObject({
          show: true,
          msg: "Meeting start time not set",
        });
      createOrUpdateMeetingData.meeting_duration < 300 &&
        setTipsObject({
          show: true,
          msg: "The meeting duration cannot be less than 5 minutes",
        });
      dayjs.tz(
        dayjs.unix(createOrUpdateMeetingData.meeting_start),
        "Asia/Shanghai"
      ) < dayjs.tz(dayjs(), "Asia/Shanghai") &&
        setTipsObject({
          show: true,
          msg: "The meeting start time cannot be earlier than the current time, please reselect",
        });
      if (
        createOrUpdateMeetingData.appId &&
        createOrUpdateMeetingData.title &&
        createOrUpdateMeetingData.meeting_start &&
        createOrUpdateMeetingData.meeting_duration > 300 &&
        dayjs.tz(
          dayjs.unix(createOrUpdateMeetingData.meeting_start),
          "Asia/Shanghai"
        ) > dayjs.tz(dayjs(), "Asia/Shanghai") &&
        attendeesList.findIndex(
          (item) => item === createOrUpdateMeetingData.admin_userid
        ) !== -1
      ) {
        if (meetingState === "create") {
          const data = {
            createWorkWeChatMeeting: createOrUpdateMeetingData,
          };

          await createMeeting(data)
            .then((res) => {
              if (res && res.errcode === 0) {
                const meetingId = res.meetingid;
                if (meetingId !== null) {
                  successAction.setTrue();
                  getMeetingList();
                } else {
                  failSendAction.setTrue();
                }
              } else {
                failSendAction.setTrue();
              }
              loadingAction.setFalse();
            })
            .catch((err) => {
              loadingAction.setFalse();
              failSendAction.setTrue();
              setTipsObject({
                show: true,
                msg: "Meeting created failed",
              });
            });
        } else if (meetingState === "update") {
          createOrUpdateMeetingData.meetingid =
            meetingIdCorpIdAndAppId?.meetingId;
          const data = {
            updateWorkWeChatMeeting: createOrUpdateMeetingData,
          };

          await updateMeeting(data)
            .then((res) => {
              if (res && res.errcode === 0) {
                successAction.setTrue();
                loadingAction.setFalse();
                getMeetingList();
              } else {
                loadingAction.setFalse();
                failSendAction.setTrue();
              }
            })
            .catch((err) => {
              loadingAction.setFalse();
              failSendAction.setTrue();
              setTipsObject({
                show: true,
                msg: "Meeting created failed",
              });
            });
        }
      } else {
        loadingAction.setFalse();
      }
    } else {
      loadingAction.setFalse();
    }
  };

  //获取会议设置数据
  const handleGetSettingData = (data: WorkWeChatMeetingSettingDto) => {
    setSettings(data);
  };

  // 延迟关闭警告提示
  useEffect(() => {
    if (failSend) {
      setTimeout(() => {
        failSendAction.setFalse();
      }, 3000);
    } else if (success) {
      setTimeout(() => {
        successAction.setFalse();
      }, 3000);
    }
  }, [failSend, success]);

  useEffect(() => {
    // 组件销毁时，销毁 editor
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const onGetMeetingData = (data: GetWorkWeChatMeeting) => {
    getMeetingData(data)
      .then((res) => {
        if (res && res.errcode === 0) {
          const {
            title,
            admin_userid,
            attendees,
            description,
            location,
            meeting_duration,
            meeting_start,
            reminders,
            settings,
          } = res;

          setMeetingTitle(title);
          setMeetingStartDate(dayjs.unix(meeting_start).format("YYYY-MM-DD"));
          setMeetingStartTime(dayjs.unix(meeting_start).format("HH:mm"));
          meetingDuration.menuItemList.filter(
            (item) => meeting_duration === item.value
          ).length > 0
            ? customEndTimeAction.setFalse()
            : customEndTimeAction.setTrue();
          setMeetingDuration((prev) => ({ ...prev, value: meeting_duration }));
          setMeetingEndDate(
            dayjs.unix(meeting_start + meeting_duration).format("YYYY-MM-DD")
          );
          setMeetingEndTime(
            dayjs.unix(meeting_start + meeting_duration).format("HH:mm")
          );
          setMeetingLocation(location);
          setHtml(description);
          setMeetingReminders(reminders ? reminders : {});
          setSettings(settings);

          if (settings) {
            setHostList((host) => {
              let hostData: IDepartmentAndUserListValue[] = [];
              settings.hosts?.userid.map((item) =>
                hostData.push({
                  id: item,
                  name: item,
                  type: 1,
                  parentid: "1",
                  selected: false,
                  isCollapsed: false,
                  children: [],
                })
              );
              return hostData;
            });

            setAppointList((apponint) => {
              let apponintData: IDepartmentAndUserListValue[] = [];
              settings.ring_users?.userid.map((item) =>
                apponintData.push({
                  id: item,
                  name: item,
                  type: 1,
                  parentid: "1",
                  selected: false,
                  isCollapsed: false,
                  children: [],
                })
              );
              return apponintData;
            });
          }

          if (reminders) {
            setSelectGroup((selectData) => {
              let arr = clone(selectData);
              arr.forEach((item) => {
                item.key === "reminderTime" &&
                  (item.value = reminders.remind_before
                    ? reminders.remind_before.length > 0
                      ? reminders.remind_before[0]
                      : 0
                    : 0);
                item.key === "repeat" && (item.value = reminders.repeat_type);
              });
              return arr;
            });
          }

          setParticipantList((participant) => {
            let attendeesData: IDepartmentAndUserListValue[] = [];

            attendees.member.length > 0 &&
              attendees.member.map((item) =>
                attendeesData.push({
                  id: item.userid,
                  name: item.userid,
                  type: 1,
                  parentid: "1",
                  selected: false,
                  isCollapsed: false,
                  children: [],
                })
              );

            return attendeesData;
          });

          setAdminUser([
            {
              id: admin_userid,
              name: admin_userid,
              type: 1,
              parentid: "1",
              selected: false,
              isCollapsed: false,
              children: [],
            },
          ]);
          setAppLoading(false);
        } else {
          setTipsObject({
            show: true,
            msg: res?.errmsg
              ? res.errmsg
              : "Failed to obtain meeting information",
          });
          setAppLoading(false);
        }
      })
      .catch((err) => {
        setTipsObject({
          show: true,
          msg: "Failed to obtain meeting information",
        });
      });
  };

  //初始化会议数据
  useEffect(() => {
    if (isOpenMeetingSettings && meetingIdCorpIdAndAppId) {
      //获取appId
      GetCorpAppList({ CorpId: meetingIdCorpIdAndAppId.corpId })
        .then((res) => {
          if (res && res.length > 0) {
            res?.map((item) => {
              if (item.id === meetingIdCorpIdAndAppId.appId) {
                const data: GetWorkWeChatMeeting = {
                  AppId: item.appId,
                  MeetingId: meetingIdCorpIdAndAppId.meetingId,
                };
                onGetMeetingData(data);
              }
            });
          } else {
            setTipsObject({
              show: true,
              msg: "Failed to obtain application information",
            });
          }
        })
        .catch((err) => {
          setTipsObject({
            show: true,
            msg: "Failed to obtain application information",
          });
        });
      setAppLoading(true);
    } else {
      clearData();
    }
  }, [isOpenMeetingSettings, meetingIdCorpIdAndAppId]);

  useEffect(() => {
    if (clickName === "选择指定主持人" || clickName === "选择指定提醒人员") {
      if (participantList && participantList?.length > 0) {
        setDepartmentAndUserList([
          { data: participantList, key: departmentKeyValue.key },
        ]);
        setFlattenDepartmentList([
          { data: participantList, key: departmentKeyValue.key },
        ]);
      } else {
        setDepartmentAndUserList([]);
        setFlattenDepartmentList([]);
      }
    }
  }, [isShowDialog]);

  useEffect(() => {
    meetingDuration.value === MeetingDuration.CustomEndTime &&
      customEndTimeAction.setTrue();
  }, [meetingDuration.value]);

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
    appointLists,
    hostLists,
    participantLists,
    tipsObject,
    appLoading,
    setCorpsValue,
    setGroupList,
    setIsShowDialog,
    setDepartmentAndUserList,
    setTagsValue,
    setChatId,
    setSendType,
    setIsShowMoreParticipantList,
    setCorpAppValue,
    handleCloseMenu,
    uploadAnnex,
    setOpenSettingsDialog,
    handleChange,
    setHtml,
    setEditor,
    handleToggle,
    handleClose,
    fileUpload,
    fileDelete,
    handleGetSelectData,
    onSetParticipant,
    setClickName,
    onCreateUpdateMeeting,
    meetingTitle,
    setMeetingTitle,
    meetingLocation,
    setMeetingLocation,
    handleGetSettingData,
    meetingReminders,
    setMeetingReminders,
    loading,
    success,
    failSend,
    meetingStartDate,
    meetingStartTime,
    meetingEndDate,
    meetingEndTime,
    settings,
    setSettings,
    setMeetingStartDate,
    setMeetingStartTime,
    setMeetingEndDate,
    setMeetingEndTime,
    onSetAdminUser,
    adminUser,
    customEndTime,
    meetingDuration,
    setMeetingDuration,
  };
};

export default useAction;
