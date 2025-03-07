import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";
import {
  CreateOrUpdateWorkWeChatMeetingDto,
  DefaultDisplay,
  IsRepeat,
  MeetingDuration,
  MeetingSettingsProps,
  ReminderTimeSelectData,
  RepeatSelectData,
  SelectDataType,
  SelectGroupType,
  WorkWeChatMeetingReminderDto,
  WorkWeChatMeetingSettingDto,
  ICorpAppData,
  ICorpData,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  ISearchList,
  ITagsList,
  MeetingGroup,
  MeetingRecording,
  GetAllMeetingsData,
  MeetingCallReminder,
  SelectPersonnelType,
} from "../../../../dtos/meeting-seetings";
import {
  GetCorpAppList,
  GetCorpsList,
  GetDeptTreeList,
} from "../../../../api/enterprise";
import { clone } from "ramda";
import { createMeeting, updateMeeting } from "../../../../api/meeting-seetings";
import { useBoolean } from "ahooks";
import useDeptUserData from "../../../../hooks/deptUserData";

dayjs.extend(utc);
dayjs.extend(timezone);

const useAction = (props: MeetingSettingsProps) => {
  const {
    meetingData,
    isOpenMeetingSettings,
    getMeetingList,
    meetingState,
    setIsOpenMeetingSettings,
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

  const {
    departmentAndUserList,
    flattenDepartmentList,
    recursiveSearchDeptOrUser,
    setFlattenDepartmentList,
    setDepartmentAndUserList,
    loadDeptUsersFromWebWorker,
  } = useDeptUserData({
    appId: corpAppValue?.appId,
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

  const selectGroupInitData: SelectGroupType[] = [
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
  ];
  const [selectGroup, setSelectGroup] =
    useState<SelectGroupType[]>(selectGroupInitData);
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

  const [appLoading, setAppLoading] = useState<boolean>(true);

  const [departmentAndUserListBackups, setDepartmentAndUserListBackups] =
    useState<IDepartmentKeyControl[]>([]);

  const [flattenDepartmentListBackups, setFlattenDepartmentListBackups] =
    useState<ISearchList[]>([]);
  // TreeView显示展开
  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false);
  // 获取的Tags数组
  const [tagsList, setTagsList] = useState<ITagsList[]>([]);
  // 群组列表
  const [chatId, setChatId] = useState<string>("");
  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([]);
  // 上次上传的tagsList
  const [lastTimeTagsList, setLastTimeTagsList] = useState<string[]>([]);
  const [clickName, setClickName] = useState<SelectPersonnelType>(
    SelectPersonnelType.MeetingAttendees
  );
  //  拉取数据旋转
  const [isLoadStop, setIsLoadStop] = useState<boolean>(false);

  //指定提醒人员
  const [appointList, setAppointList] =
    useState<IDepartmentAndUserListValue[]>();
  //指定主持人
  const [hostList, setHostList] = useState<IDepartmentAndUserListValue[]>();
  const [tipsObject, setTipsObject] = useState({
    show: false,
    msg: "",
  });

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
    password: "",
    enable_waiting_room: false,
    allow_enter_before_host: true,
    remind_scope: 1,
    enable_enter_mute: 0,
    allow_external_user: true,
    enable_screen_watermark: false,
    hosts: undefined,
    ring_users: undefined,
    meetingRecordType: MeetingRecording.Disable,
    enableCloudRecordSummary: false,
    meetingSummaryDistributionEnabled: false,
  });

  //拉群并通知
  const [meetingGroup, setMeetingGroup] = useState<MeetingGroup>({
    isCreateGroup: false,
    isMeetingCode: true,
    isMeetingLink: true,
    content: "",
  });

  const [participantPage, setParticipantPage] = useState<number>(1);

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

  const getFlattenDepartmentList = (
    data: IDepartmentAndUserListValue[],
    arr: IDepartmentAndUserListValue[]
  ) => {
    data.map((item) => {
      arr.push(item);
      if (item.children.length) {
        getFlattenDepartmentList(item.children, arr);
      }
    });
    return arr;
  };

  //传企业部门数据到组件前处理
  const initializeCollapseSearchData = (
    valueList: IDepartmentAndUserListValue[]
  ) => {
    const deduplicationData = (sourceData: IDepartmentAndUserListValue[]) => {
      // 合并父数据
      const result: IDepartmentAndUserListValue[] = [];
      for (const item of sourceData) {
        const departmentList = sourceData.filter(
          (item) => item.type === DepartmentAndUserType.Department
        );
        if (item.type === DepartmentAndUserType.User) {
          !departmentList.some((cell) =>
            item.idRoute?.includes(Number(cell.id))
          ) && result.push(item);
        } else {
          !departmentList.some(
            (cell) =>
              item.id !== cell.id && item.idRoute?.includes(Number(cell.id))
          ) && result.push(item);
        }
      }
      // 递归重置选择为false
      recursiveSearchDeptOrUser(result, (item) => (item.selected = false));
      return result;
    };

    setDepartmentAndUserList([
      {
        data: deduplicationData(valueList),
        key: corpAppValue.appId,
      },
    ]);

    setFlattenDepartmentList([
      {
        data: getFlattenDepartmentList(valueList, []),
        key: corpAppValue.appId,
      },
    ]);
  };

  const settingSelectedList = (valueList: IDepartmentAndUserListValue[]) => {
    if (clickName === SelectPersonnelType.MeetingAttendees) {
      setParticipantList([...valueList]);

      initializeCollapseSearchData(valueList);
      setAppointList([]);

      setHostList([]);
      setSettings((prev) => ({
        ...prev,
        hosts: undefined,
        ring_users: undefined,
        remind_scope: MeetingCallReminder.NoRemind,
      }));
    }

    clickName === SelectPersonnelType.SpecifyReminderPersonnel &&
      setAppointList(valueList);
    clickName === SelectPersonnelType.Moderator && setHostList(valueList);

    if (clickName === SelectPersonnelType.ConferenceAdministrator) {
      setAdminUser(valueList);
      valueList.length > 0 &&
        setParticipantList((prev) => {
          let newArr = prev ? clone(prev) : [];

          if (!newArr.find((item) => item.id === valueList[0].id)) {
            newArr.push(valueList[0]);
          }

          return newArr;
        });
    }
  };

  //选中成员公共数据
  const loadSelectData = useMemo(() => {
    const result =
      clickName === SelectPersonnelType.MeetingAttendees
        ? participantList
        : clickName === SelectPersonnelType.SpecifyReminderPersonnel
        ? appointList
        : clickName === SelectPersonnelType.Moderator
        ? hostList
        : clickName === SelectPersonnelType.ConferenceAdministrator
        ? adminUser
        : undefined;

    //切换折叠数据
    if (
      (clickName === SelectPersonnelType.Moderator ||
        clickName === SelectPersonnelType.SpecifyReminderPersonnel) &&
      participantList
    ) {
      initializeCollapseSearchData(participantList);
    }

    return result?.map((item) => ({
      ...item,
      selected: false,
      isCollapsed: false,
    })) as IDepartmentAndUserListValue[];
  }, [participantList, appointList, hostList, clickName, adminUser]);

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
    let newArr: string[] = [];
    getUserId(personnelData, newArr);

    return newArr;
  };

  const getUserId = (data: IDepartmentAndUserListValue[], arr: string[]) => {
    data.map((item) => {
      if (item.children && item.children.length > 0) {
        getUserId(item.children, arr);
      } else {
        arr.push(item.name);
      }
    });
  };

  const onSetParticipant = () => {
    setClickName(SelectPersonnelType.MeetingAttendees);
    setDepartmentAndUserList(departmentAndUserListBackups);
    setFlattenDepartmentList(flattenDepartmentListBackups);
    setIsShowDialog(true);
  };

  const onSetAdminUser = () => {
    setClickName(SelectPersonnelType.ConferenceAdministrator);
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

  const handelGetNewUserDataList = (data: IDepartmentAndUserListValue[]) => {
    if (data.every((item) => item.type === DepartmentAndUserType.User)) {
      return data.map((item) => item.name);
    }
    return getUserChildrenList(departmentAndUserList[0]?.data ?? [], data, []);
  };

  const onCreateUpdateMeeting = () => {
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

      participantList &&
        (attendeesList = handelGetNewUserDataList(participantList));

      const admin_userid = adminUser
        ? adminUser.length > 0
          ? adminUser[0].id
          : ""
        : "";

      let settingsData = clone(settings);
      if (!settingsData.hosts) {
        delete settingsData.hosts;
      } else {
        hostList &&
          (settingsData.hosts = {
            userid: handelGetNewUserDataList(hostList),
          });
      }

      if (!settingsData.ring_users) {
        delete settingsData.ring_users;
      } else {
        appointList &&
          (settingsData.ring_users = {
            userid: handelGetNewUserDataList(appointList),
          });
      }

      !settingsData.password && (settingsData.password = "");

      const createOrUpdateMeetingData: CreateOrUpdateWorkWeChatMeetingDto = {
        appId: corpAppValue.appId,
        admin_userid: admin_userid + "",
        title: meetingTitle,
        meeting_start,
        meeting_duration,
        description: editor?.getText(),
        location: meetingLocation,
        settings: settingsData,
        invitees: {
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
        dayjs.unix(createOrUpdateMeetingData.meeting_start * 1000),
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
        createOrUpdateMeetingData.meeting_duration >= 300 &&
        dayjs.tz(
          dayjs.unix(createOrUpdateMeetingData.meeting_start * 1000),
          "Asia/Shanghai"
        ) > dayjs.tz(dayjs(), "Asia/Shanghai") &&
        attendeesList.findIndex(
          (item) => item === createOrUpdateMeetingData.admin_userid
        ) !== -1
      ) {
        if (meetingState === "create") {
          const content = `${meetingGroup.content}${
            meetingGroup.isMeetingCode ? "\n #会议号：#{meeting_code}" : ""
          }${
            meetingGroup.isMeetingLink ? "\n #会议链接：#{meeting_link}" : ""
          }`;

          const data = {
            createWorkWeChatMeeting: createOrUpdateMeetingData,
            meetingGroup: {
              isCreateGroup: meetingGroup.isCreateGroup,
              content,
            },
          };

          createMeeting(data)
            .then((res) => {
              if (res && res.errcode === 0) {
                const meetingId = res.meetingid;
                if (meetingId !== null) {
                  successAction.setTrue();
                  setIsOpenMeetingSettings(false);
                  clearData();
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
          createOrUpdateMeetingData.meetingid = meetingData?.meetingId;

          const data = {
            updateWorkWeChatMeeting: createOrUpdateMeetingData,
          };

          updateMeeting(data)
            .then((res) => {
              if (res && res.errcode === 0) {
                successAction.setTrue();
                loadingAction.setFalse();
                setIsOpenMeetingSettings(false);
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

    setSelectGroup(selectGroupInitData);

    customEndTimeAction.setFalse();

    setMeetingDuration((prev) => ({ ...prev, value: MeetingDuration.Minutes }));

    setMeetingReminders({
      is_repeat: 0,
      repeat_type: 0,
      repeat_until: 0,
      repeat_interval: 0,
      remind_before: [0],
    });

    setMeetingStartDate(dayjs().format("YYYY-MM-DD"));
    setMeetingStartTime(
      dayjs()
        .set("minutes", dayjs().get("minutes") + 5)
        .format("HH:mm")
    );
    setMeetingEndDate(dayjs().format("YYYY-MM-DD"));
    setMeetingEndTime(
      dayjs()
        .set("hours", dayjs().get("hours") + 1)
        .set("minutes", dayjs().get("minutes") + 5)
        .format("HH:mm")
    );

    setSettings({
      password: "",
      enable_waiting_room: false,
      allow_enter_before_host: true,
      remind_scope: MeetingCallReminder.NoRemind,
      enable_enter_mute: 0,
      allow_external_user: true,
      enable_screen_watermark: false,
      hosts: undefined,
      ring_users: undefined,
      meetingRecordType: MeetingRecording.Disable,
      enableCloudRecordSummary: false,
      meetingSummaryDistributionEnabled: false,
    });

    setMeetingGroup({
      isCreateGroup: false,
      content: "",
      isMeetingCode: true,
      isMeetingLink: true,
    });

    corpsList && setCorpsValue(corpsList[0]);
  };

  const onGetMeetingData = (data: GetAllMeetingsData) => {
    if (data) {
      const {
        adminUserId,
        title,
        meetingStart,
        meetingDuration,
        description,
        location,
        absentMember,
        presentMember,
        password,
        enableWaitingRoom,
        allowEnterBeforeHost,
        remindScope,
        enableEnterMute,
        allowExternalUser,
        enableScreenWatermark,
        hosts,
        ringUsers,
        isRepeat,
        repeatType,
        repeatUntil,
        repeatInterval,
        remindBefore,
        meetingRecordType,
        enableCloudRecordSummary,
        meetingSummaryDistributionEnabled,
        workWeChatCorpApplicationId,
        workWeChatCorpId,
      } = data;

      setMeetingTitle(title);

      loadingAction.setFalse();

      const corp = corpsList?.find((item) => item.id === workWeChatCorpId);

      const corpApp = corpAppList?.find(
        (item) => item.id === workWeChatCorpApplicationId
      );

      corp && setCorpsValue(corp);

      corpApp && setCorpAppValue(corpApp);

      setMeetingStartDate(dayjs.unix(meetingStart).format("YYYY-MM-DD"));

      setMeetingStartTime(dayjs.unix(meetingStart).format("HH:mm"));

      const meetingDurationValues = Object.values(MeetingDuration);

      meetingDurationValues.includes(meetingDuration)
        ? customEndTimeAction.setFalse()
        : customEndTimeAction.setTrue();

      setMeetingDuration((prev) => ({ ...prev, value: meetingDuration }));

      setMeetingEndDate(
        dayjs.unix(meetingStart + meetingDuration).format("YYYY-MM-DD")
      );

      setMeetingEndTime(
        dayjs.unix(meetingStart + meetingDuration).format("HH:mm")
      );

      setMeetingLocation(location);

      setHtml(description);

      setMeetingReminders({
        is_repeat: isRepeat,
        repeat_type: repeatType,
        repeat_until: repeatUntil,
        repeat_interval: repeatInterval,
        remind_before: [+remindBefore],
      });

      const ring_users = ringUsers ? ringUsers.split(",") : [];

      const hostsData = hosts ? hosts.split(",") : [];

      setSettings({
        password: password ?? "",
        enable_waiting_room: enableWaitingRoom,
        allow_enter_before_host: allowEnterBeforeHost,
        remind_scope: remindScope,
        enable_enter_mute: enableEnterMute,
        allow_external_user: allowExternalUser,
        hosts: hosts ? { userid: hostsData } : undefined,
        enable_screen_watermark: enableScreenWatermark,
        ring_users: ringUsers ? { userid: ring_users } : undefined,
        meetingRecordType: meetingRecordType,
        enableCloudRecordSummary: enableCloudRecordSummary,
        meetingSummaryDistributionEnabled: meetingSummaryDistributionEnabled,
      });

      setHostList((host) => {
        let hostData: IDepartmentAndUserListValue[] = [];
        hostsData.map((item) =>
          hostData.push({
            id: item,
            name: item,
            type: 1,
            parentid: 1,
            selected: false,
            isCollapsed: false,
            children: [],
          })
        );
        return hostData;
      });

      setAppointList((apponint) => {
        let apponintData: IDepartmentAndUserListValue[] = [];
        ring_users.map((item) =>
          apponintData.push({
            id: item,
            name: item,
            type: 1,
            parentid: 1,
            selected: false,
            isCollapsed: false,
            children: [],
          })
        );
        return apponintData;
      });

      setSelectGroup((selectData) => {
        let arr = clone(selectData);
        arr.forEach((item) => {
          item.key === "reminderTime" &&
            (item.value = remindBefore
              ? +remindBefore
              : ReminderTimeSelectData.MeetingBegins);

          if (item.key === "repeat") {
            item.value = isRepeat ? repeatType : RepeatSelectData.NoRepeat;
          }
        });

        return arr;
      });

      setParticipantList((participant) => {
        let attendeesData: IDepartmentAndUserListValue[] = [];

        const participantData = [
          ...(presentMember ?? []),
          ...(absentMember ?? []),
        ];

        participantData.length > 0 &&
          [...new Set(participantData)].map((item) =>
            attendeesData.push({
              id: item,
              name: item,
              type: 1,
              parentid: 1,
              selected: false,
              isCollapsed: false,
              children: [],
            })
          );

        return attendeesData;
      });

      setAdminUser([
        {
          id: adminUserId,
          name: adminUserId,
          type: 1,
          parentid: 1,
          selected: true,
          isCollapsed: false,
          children: [],
        },
      ]);
      setAppLoading(false);
    }
  };

  //获取会议设置数据
  const handleGetSettingData = (data: WorkWeChatMeetingSettingDto) => {
    setSettings(data);
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
    meetingData &&
      setCorpsValue(
        corpsList.filter((item) => item.id === meetingData.workWeChatCorpId)[0]
      );
  }, [meetingData]);

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
        ? meetingData
          ? corpAppList.filter(
              (item) => item.id === meetingData.workWeChatCorpApplicationId
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

  useEffect(() => {
    participantList &&
      participantList.length > DefaultDisplay.Participant &&
      setIsShowMoreParticipantList(true);
  }, [participantList]);

  useEffect(() => {
    const loadDepartment = async (AppId: string) => {
      setIsTreeViewLoading(true);
      const deptListResponse = await GetDeptTreeList(AppId);
      if (deptListResponse && deptListResponse.workWeChatUnits.length === 0)
        setIsTreeViewLoading(false);

      !!deptListResponse &&
        loadDeptUsersFromWebWorker({
          AppId,
          workWeChatUnits: deptListResponse.workWeChatUnits,
        }).then(() => {
          setIsTreeViewLoading(false);
          setIsLoadStop(true);
        });
    };
    if (
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

      // 开始load数据
      setIsLoadStop(false);
      corpAppValue?.appId &&
        isShowDialog &&
        (clickName === SelectPersonnelType.MeetingAttendees ||
          clickName === SelectPersonnelType.ConferenceAdministrator) &&
        loadDepartment(corpAppValue.appId);
    }
  }, [isShowDialog]);

  useEffect(() => {
    if (isLoadStop) {
      setDepartmentAndUserListBackups(departmentAndUserList);
      setFlattenDepartmentListBackups([
        {
          data: getFlattenDepartmentList(departmentAndUserList[0].data, []),
          key: departmentAndUserList[0].key,
        },
      ]);
    }
  }, [isLoadStop]);

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

  //初始化会议数据
  useEffect(() => {
    meetingData && onGetMeetingData(meetingData);
  }, [isOpenMeetingSettings]);

  useEffect(() => {
    meetingDuration.value === MeetingDuration.CustomEndTime &&
      customEndTimeAction.setTrue();
  }, [meetingDuration.value]);

  //创建会议前清空数据
  useEffect(() => {
    meetingState === "create" &&
      isOpenMeetingSettings &&
      corpsList &&
      corpsList.length > 0 &&
      clearData();
  }, [meetingState, isOpenMeetingSettings]);

  //创建会议时切换企业清空上个企业成员数据
  useEffect(() => {
    if (meetingState === "create") {
      setParticipantList([]);
      setAppointList([]);
      setHostList([]);
      setAdminUser([]);
      setSettings({
        password: "",
        enable_waiting_room: false,
        allow_enter_before_host: true,
        remind_scope: MeetingCallReminder.NoRemind,
        enable_enter_mute: 0,
        allow_external_user: true,
        enable_screen_watermark: false,
        hosts: undefined,
        ring_users: undefined,
        meetingRecordType: MeetingRecording.Disable,
        enableCloudRecordSummary: false,
        meetingSummaryDistributionEnabled: false,
      });
    }
  }, [corpsValue]);

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
    DeptUserCanSelectStatus,
    tagsValue,
    lastTimeTagsList,
    clickName,
    chatId,
    loadSelectData,
    appointList,
    hostList,
    participantList,
    tipsObject,
    appLoading,
    setCorpsValue,
    setIsShowDialog,
    setDepartmentAndUserList,
    setTagsValue,
    setChatId,
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
    meetingGroup,
    setMeetingGroup,
    participantPage,
    setParticipantPage,
    settingSelectedList,
  };
};

export default useAction;
