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
      border: true,
      isOption: false,
    },
    {
      title: "自动开启会议录制",
      optionType: "checkbox",
      border: true,
      isOption: false,
      optionData: MeetingRecording.Soundcloud,
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
      password: null,
      enable_waiting_room: false,
      allow_enter_before_host: false,
      remind_scope: 1,
      enable_enter_mute: 0,
      allow_external_user: true,
      enable_screen_watermark: false,
      hosts: undefined,
      ring_users: undefined,
    };

    meetingSettingList.map((item) => {
      if (item.optionType === "input") {
        if (item.isOption) {
          settingData.password = item.password ? item.password : null;
        } else {
          settingData.password = null;
        }
      }
      item.key === "enable_waiting_room" &&
        (settingData.enable_waiting_room = item.isOption);
      item.key === "allow_enter_before_host" &&
        (settingData.allow_enter_before_host = item.isOption);
      item.key === "remind_scope" &&
        (settingData.remind_scope = item.optionData ? item.optionData : 1);
      item.key === "enable_enter_mute" &&
        (settingData.enable_enter_mute = item.optionData ? item.optionData : 0);
      item.key === "allow_external_user" &&
        (settingData.allow_external_user = !!item.optionData);

      item.key === "enable_screen_watermark" &&
        (settingData.enable_screen_watermark = !!item.isOption);
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
      settingsData.map((item) => {
        item.optionType === "input" &&
          settings.password &&
          (item.password = settings.password);
        item.password && (item.isOption = true);

        item.key === "enable_waiting_room" &&
          (item.isOption = settings.enable_waiting_room);
        item.key === "allow_enter_before_host" &&
          (item.isOption = settings.allow_enter_before_host);
        item.key === "remind_scope" &&
          (item.optionData = settings.remind_scope);
        item.key === "enable_enter_mute" &&
          (item.optionData = settings.enable_enter_mute);
        item.key === "allow_external_user" &&
          (item.optionData = +settings.allow_external_user);
        item.key === "enable_screen_watermark" &&
          (item.isOption = settings.enable_screen_watermark);
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
