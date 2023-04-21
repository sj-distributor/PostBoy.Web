import { useState } from "react";
import { MeetingSettingList } from "../../../../dtos/meeting-seetings";

const useAction = () => {
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
      optionType: "checkbox",
      border: true,
      isOption: false,
    },
    {
      title: "自动开启会议录制",
      optionType: "checkbox",
      border: true,
      isOption: false,
      optionData: "",
      optionList: [
        {
          lable: "主持人入会后开启云录制",
          value: "主持人入会后开启云录制",
        },
        {
          lable: "主持人入会后开启本地录制",
          value: "主持人入会后开启本地录制",
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
      optionData: "",
      optionList: [
        {
          lable: "单排水印",
          value: "单排水印",
        },
        {
          lable: "双排水印",
          value: "双排水印",
        },
      ],
    },

    {
      title: "会议开始时来电提醒",
      border: true,
      isOption: true,
      optionData: "",
      optionList: [
        {
          lable: "所有成员",
          value: "所有成员",
        },
        {
          lable: "指定成员",
          value: "指定成员",
        },
        {
          lable: "仅主持人",
          value: "仅主持人",
        },
        {
          lable: "不提醒",
          value: "不提醒",
        },
      ],
    },
    {
      title: "成员入会时静音",
      border: true,
      isOption: true,
      optionData: "",
      optionList: [
        {
          lable: "开启",
          value: "开启",
        },
        {
          lable: "关闭",
          value: "关闭",
        },
        {
          lable: "超过6人自动开启",
          value: "超过6人自动开启",
        },
      ],
    },
    {
      title: "入会成员限制",
      border: true,
      isOption: true,
      optionData: "",
      optionList: [
        {
          lable: "所有人可以入会",
          value: "所有人可以入会",
        },
        {
          lable: "仅企业内部用户可入会",
          value: "仅企业内部用户可入会",
        },
      ],
    },
  ];
  const [meetingSettingList, setMeetingSettingList] =
    useState<MeetingSettingList[]>(checkList);
  const [openAddDialog, setAddDialog] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newList = meetingSettingList;
    newList[index].optionData = event.target.value;
    setMeetingSettingList([...newList]);
  };

  const setIsOption = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newList = meetingSettingList;
    newList[index].isOption = event.target.checked;
    setMeetingSettingList([...newList]);
    console.log(meetingSettingList);
  };

  return {
    meetingSettingList,
    openAddDialog,
    setAddDialog,
    setIsOption,
    handleChange,
  };
};

export default useAction;
