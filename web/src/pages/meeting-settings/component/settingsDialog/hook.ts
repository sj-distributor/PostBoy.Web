import { clone } from "ramda";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IDepartmentAndUserListValue } from "../../../../dtos/enterprise";
import {
  MeetingCallReminder,
  MeetingRecording,
  MeetingSettingList,
  MembershipRestrictions,
  MutewhenJoining,
  RecordWatermark,
} from "../../../../dtos/meeting-seetings";

const useAction = (props: {
  setOpenAddDialog: (value: boolean) => void;
  openAddDialog: boolean;
  setClickName?: Dispatch<SetStateAction<string>>;
  appointList?: IDepartmentAndUserListValue[];
}) => {
  const { setOpenAddDialog, setClickName, appointList, openAddDialog } = props;
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
      password: "",
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
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "允许成员在主持人进会前加入",
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "开启屏幕共享水印",
      optionType: "checkbox",
      border: true,
      isOption: false,
      optionData: RecordWatermark.SingleRowWatermark,
      optionList: [
        {
          lable: "单排水印",
          value: RecordWatermark.SingleRowWatermark,
        },
        {
          lable: "双排水印",
          value: RecordWatermark.DoubleRowWatermark,
        },
      ],
    },

    {
      title: "会议开始时来电提醒",
      border: true,
      isOption: true,
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
  const [meetingSettingList, setMeetingSettingList] =
    useState<MeetingSettingList[]>(settingList);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [radioDisabled, setRadioDisabled] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onMembershipPassword = (value: string, index: number) => {
    const newList = clone(meetingSettingList);
    newList.map((item, i) => i === index && (item.password = value));
    setMeetingSettingList([...newList]);
  };

  const handleChange = (value: string, index: number) => {
    const newList = clone(meetingSettingList);
    newList[index].optionData = value;
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

  const onAppintRadio = (MeetingCallReminderValue: string) => {
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

  useEffect(() => {
    const value = meetingSettingList.filter(
      (item, index) => item.title === "会议开始时来电提醒"
    )[0].optionData;
    const index = meetingSettingList.findIndex(
      (item, index) => item.title === "会议开始时来电提醒"
    );
    if (value === MeetingCallReminder.All) {
      const newList = clone(meetingSettingList);
      newList[index].optionData = MeetingCallReminder.Host;
      setMeetingSettingList([...newList]);
    }
  }, [radioDisabled]);

  useEffect(() => {
    !openAddDialog &&
      (!appointList || appointList.length === 0) &&
      onAppintRadio(MeetingCallReminder.Host);
  }, [appointList, openAddDialog]);

  return {
    meetingSettingList,
    showPassword,
    radioDisabled,
    onIsOption,
    handleChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    onMembershipPassword,
    onSelectHost,
    onAppint,
  };
};

export default useAction;
