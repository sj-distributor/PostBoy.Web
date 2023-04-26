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
  setOpenAddDialog: (vlaue: boolean) => void;
  openAddDialog: boolean;
  setClickName?: Dispatch<SetStateAction<string>>;
  appointList?: IDepartmentAndUserListValue[];
}) => {
  const { setOpenAddDialog, setClickName, appointList, openAddDialog } = props;
  const checkList: MeetingSettingList[] = [
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
    useState<MeetingSettingList[]>(checkList);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [radioDisabled, setRadioDisabled] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const setMembershipPassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newList = meetingSettingList;
    newList.map((item, i) => i === index && (item.password = e.target.value));
    setMeetingSettingList([...newList]);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newList = [...meetingSettingList];
    newList[index].optionData = event.target.value;
    if (
      newList[index].title === "会议开始时来电提醒" &&
      newList[index].optionData === MeetingCallReminder.Appoint
    ) {
      setAppint();
    }
    setMeetingSettingList([...newList]);
  };

  const setAppint = () => {
    setOpenAddDialog(true);
    setClickName && setClickName("选择指定提醒人员");
  };

  const setIsOption = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newList = [...meetingSettingList];
    newList[index].isOption = event.target.checked;

    if (newList[index].title === "允许成员在主持人进会前加入") {
      setRadioDisabled(event.target.checked);
    }
    setMeetingSettingList([...newList]);
  };

  const setAppintRadio = (MeetingCallReminderValue: string) => {
    const newList = [...meetingSettingList];
    newList.forEach(
      (item, index) =>
        item.title === "会议开始时来电提醒" &&
        (item.optionData = MeetingCallReminderValue)
    );
    setMeetingSettingList([...newList]);
  };

  const selectHost = () => {
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
      const newList = [...meetingSettingList];
      newList[index].optionData = MeetingCallReminder.Host;
      setMeetingSettingList([...newList]);
    }
  }, [radioDisabled]);

  useEffect(() => {
    (!appointList || appointList.length < 1) &&
      setAppintRadio(MeetingCallReminder.Host);
  }, [appointList, openAddDialog]);

  return {
    meetingSettingList,
    showPassword,
    radioDisabled,
    setIsOption,
    handleChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    setMembershipPassword,
    selectHost,
    setAppint,
  };
};

export default useAction;
