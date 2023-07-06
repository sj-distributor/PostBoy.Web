import { clone } from "ramda";
import { useEffect, useState } from "react";
import {
  MeetingCallReminder,
  MeetingPasswordLimitation,
  MeetingRecording,
  MeetingSettingList,
  MembershipRestrictions,
  MutewhenJoining,
  RecordWatermark,
  SettingDialogProps,
  WorkWeChatMeetingSettingDto,
  WorkWeChatMeetingUserDto,
} from "../../../../../../dtos/meeting-seetings";

const useAction = (props: SettingDialogProps) => {
  const {
    setOpenAddDialog,
    setClickName,
    appointList,
    hostList,
    openAddDialog,
    handleGetSettingData,
    setDialog,
    settings,
    open,
  } = props;
  const settingList: MeetingSettingList[] = [
    {
      title: "指定主持人",
      icon: true,
      optionType: "dailog",
      border: true,
      isOption: false,
    },
    {
      title: "入会密码",
      optionType: "input",
      key: "password",
      border: true,
      isOption: false,
    },
    {
      title: "自动开启会议录制",
      optionType: "checkbox",
      key: "meetingRecordType",
      border: true,
      isOption: false,
      optionData: MeetingRecording.Disable,
      optionList: [
        {
          lable: "主持人入会后开启云录制",
          value: MeetingRecording.Soundcloud,
        },
        {
          lable: "主持人入会后开启本地录制",
          value: MeetingRecording.LocalRecording,
        },
      ],
    },
    {
      title: "是否开启会议总结",
      key: "enableCloudRecordSummary",
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "是否发送会议总结给参会人",
      key: "meetingSummaryDistributionEnabled",
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "开启等候室",
      key: "enable_waiting_room",
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "允许成员在主持人进会前加入",
      optionType: "checkbox",
      key: "allow_enter_before_host",
      border: true,
      isOption: true,
    },
    {
      title: "开启屏幕共享水印",
      optionType: "checkbox",
      key: "enable_screen_watermark",
      border: true,
      isOption: false,
      optionData: RecordWatermark.Off,
    },

    {
      title: "会议开始时来电提醒",
      border: true,
      isOption: true,
      key: "remind_scope",
      optionData: MeetingCallReminder.Host,
      optionList: [
        {
          lable: "所有成员",
          value: MeetingCallReminder.All,
        },
        {
          lable: "指定成员",
          value: MeetingCallReminder.Appoint,
        },
        {
          lable: "仅主持人",
          value: MeetingCallReminder.Host,
        },
        {
          lable: "不提醒",
          value: MeetingCallReminder.NoRemind,
        },
      ],
    },
    {
      title: "成员入会时静音",
      border: true,
      isOption: true,
      key: "enable_enter_mute",
      optionData: MutewhenJoining.On,
      optionList: [
        {
          lable: "开启",
          value: MutewhenJoining.On,
        },
        {
          lable: "关闭",
          value: MutewhenJoining.Off,
        },
        {
          lable: "超过6人自动开启",
          value: MutewhenJoining.MoreThanSixOn,
        },
      ],
    },
    {
      title: "入会成员限制",
      border: true,
      isOption: true,
      key: "allow_external_user",
      optionData: MembershipRestrictions.All,
      optionList: [
        {
          lable: "所有人可以入会",
          value: MembershipRestrictions.All,
        },
        {
          lable: "仅企业内部用户可入会",
          value: MembershipRestrictions.InternalMembers,
        },
      ],
    },
  ];
  const [tipsObject, setTipsObject] = useState({
    show: false,
    msg: "",
  });
  const [meetingSettingList, setMeetingSettingList] =
    useState<MeetingSettingList[]>(settingList);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [radioDisabled, setRadioDisabled] = useState<boolean>(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onMembershipPassword = (value: string, index: number) => {
    const newList = clone(meetingSettingList);
    const password = value.slice(0, MeetingPasswordLimitation.Max);
    newList.map((item, i) => i === index && (item.password = +password));
    setMeetingSettingList([...newList]);
  };

  const handleChange = (value: string, index: number) => {
    const newList = clone(meetingSettingList);
    newList[index].optionData = +value;
    if (
      newList[index].title === "会议开始时来电提醒" &&
      newList[index].optionData === MeetingCallReminder.Appoint
    ) {
      onAppint();
    }

    setMeetingSettingList([...newList]);
  };

  const onAppint = () => {
    setOpenAddDialog(true);
    setClickName && setClickName("选择指定提醒人员");
  };

  const onIsOption = (checked: boolean, index: number) => {
    const newList = clone(meetingSettingList);
    newList[index].isOption = checked;

    if (newList[index].title === "允许成员在主持人进会前加入") {
      setRadioDisabled(checked);
    }

    if (newList[index].key === "meetingRecordType") {
      newList[index].optionData = checked
        ? MeetingRecording.Soundcloud
        : MeetingRecording.Disable;
    }

    setMeetingSettingList([...newList]);
  };

  const onAppintRadio = (MeetingCallReminderValue: number) => {
    const newList = clone(meetingSettingList);
    newList.forEach(
      (item, index) =>
        item.title === "会议开始时来电提醒" &&
        (item.optionData = MeetingCallReminderValue)
    );
    setMeetingSettingList([...newList]);
  };

  const onSelectHost = () => {
    setClickName && setClickName("选择指定主持人");
    setOpenAddDialog(true);
  };

  const onUpdateSettings = () => {
    const intPassword = meetingSettingList.filter(
      (item) => item.optionType === "input"
    )[0];
    if (
      intPassword.isOption &&
      (!intPassword.password ||
        (intPassword.password + "").length < MeetingPasswordLimitation.Min)
    ) {
      setTipsObject({
        show: true,
        msg: "Please re-enter the 4-6 number password",
      });
      return;
    }
    let settingData: WorkWeChatMeetingSettingDto = {
      password: "",
      enable_waiting_room: false,
      allow_enter_before_host: false,
      remind_scope: 1,
      enable_enter_mute: 0,
      allow_external_user: true,
      enable_screen_watermark: false,
      hosts: undefined,
      ring_users: undefined,
      meetingRecordType: MeetingRecording.Disable,
      enableCloudRecordSummary: false,
      meetingSummaryDistributionEnabled: false,
    };

    meetingSettingList.map((item) => {
      if (item.optionType === "input") {
        if (item.isOption) {
          settingData.password = item.password ? item.password : "";
        } else {
          settingData.password = "";
        }
      }

      switch (item.key) {
        case "enable_waiting_room":
          settingData.enable_waiting_room = item.isOption;
          break;
        case "allow_enter_before_host":
          settingData.allow_enter_before_host = item.isOption;
          break;
        case "remind_scope":
          settingData.remind_scope = item.optionData ? item.optionData : 1;
          break;
        case "enable_enter_mute":
          settingData.enable_enter_mute = item.optionData ? item.optionData : 0;
          break;
        case "allow_external_user":
          settingData.allow_external_user = !!item.optionData;
          break;
        case "enable_screen_watermark":
          settingData.enable_screen_watermark = !!item.isOption;
          break;
        case "meetingRecordType":
          settingData.meetingRecordType = item.optionData
            ? item.optionData
            : MeetingRecording.Disable;
          break;
        case "enableCloudRecordSummary":
          settingData.enableCloudRecordSummary = !!item.isOption;
          break;
        case "meetingSummaryDistributionEnabled":
          settingData.meetingSummaryDistributionEnabled = !!item.isOption;
          break;
        default:
          break;
      }
    });

    let hosts: WorkWeChatMeetingUserDto = {
      userid: [],
    };
    let ring_user: WorkWeChatMeetingUserDto = {
      userid: [],
    };
    appointList &&
      appointList?.length > 0 &&
      appointList?.map((item) => ring_user.userid.push(item.id + ""));
    hostList &&
      hostList?.length > 0 &&
      hostList?.map((item) => hosts.userid.push(item.id + ""));
    settingData.hosts = hosts.userid.length > 0 ? hosts : undefined;
    settingData.ring_users =
      ring_user.userid.length > 0 ? ring_user : undefined;
    handleGetSettingData && handleGetSettingData(settingData);

    setDialog(false);
    setMeetingSettingList(settingList);
  };

  useEffect(() => {
    !openAddDialog &&
      (!appointList || appointList.length === 0) &&
      onAppintRadio(MeetingCallReminder.Host);
  }, [appointList, openAddDialog]);

  useEffect(() => {
    if (settings && open) {
      let settingsData = clone(meetingSettingList);

      const {
        password,
        enable_waiting_room,
        allow_enter_before_host,
        remind_scope,
        enable_enter_mute,
        allow_external_user,
        enable_screen_watermark,
        auto_record_type,
        enableCloudRecordSummary,
        meetingSummaryDistributionEnabled,
      } = settings;

      settingsData.map((item) => {
        switch (item.key) {
          case "password":
            password && (item.password = password);
            item.password && (item.isOption = true);
            break;
          case "enable_waiting_room":
            item.isOption = enable_waiting_room;
            break;
          case "allow_enter_before_host":
            item.isOption = allow_enter_before_host;
            break;
          case "enable_enter_mute":
            item.optionData = enable_enter_mute;
            break;
          case "remind_scope":
            item.optionData = remind_scope;
            break;
          case "allow_external_user":
            item.optionData = +allow_external_user;
            break;
          case "enable_screen_watermark":
            item.isOption = enable_screen_watermark;
            break;
          case "meetingRecordType":
            if (auto_record_type) {
              item.optionData =
                auto_record_type === "local"
                  ? MeetingRecording.LocalRecording
                  : MeetingRecording.Soundcloud;
              item.isOption = true;
            }
            break;
          case "enableCloudRecordSummary":
            item.isOption = enableCloudRecordSummary;
            break;
          case "meetingSummaryDistributionEnabled":
            item.isOption = meetingSummaryDistributionEnabled;
            break;
          default:
            break;
        }
      });

      setMeetingSettingList(settingsData);
    }
  }, [settings, open]);

  useEffect(() => {
    setMeetingSettingList((prve) => {
      let callReminderList = clone(prve);

      callReminderList.forEach((item) => {
        if (
          item.title === "会议开始时来电提醒" &&
          item.optionData === MeetingCallReminder.All
        ) {
          item.optionData = MeetingCallReminder.Host;
        }
      });

      return callReminderList;
    });
  }, [radioDisabled]);

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

  return {
    meetingSettingList,
    showPassword,
    radioDisabled,
    tipsObject,
    onIsOption,
    handleChange,
    handleClickShowPassword,
    onMembershipPassword,
    onSelectHost,
    onAppint,
    onUpdateSettings,
  };
};

export default useAction;
