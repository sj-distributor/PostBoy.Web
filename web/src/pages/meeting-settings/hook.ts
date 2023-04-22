import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";
import {
  CalendarSelectData,
  DateTimeData,
  ReminderTimeSelectData,
  RepeatSelectData,
  SelectGroupType,
  SelectParticipantList,
} from "../../dtos/meeting-seetings";

const useAction = () => {
  const [openAddParticipantDialog, setOpenAddParticipantDialog] =
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

  const getEndDate = (data: DateTimeData) => {};
  const getStateDate = (data: DateTimeData) => {};
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
  //获取选中成员
  const getSelectListData = (data: SelectParticipantList[]) => {};
  return {
    editor,
    html,
    toolbarConfig,
    editorConfig,
    selectGroup,
    openAnnexList,
    anchorRef,
    openAddParticipantDialog,
    openSettingsDialog,
    annexFile,
    inputRef,
    open,
    anchorEl,
    handleClick,
    handleCloseMenu,
    uploadAnnex,
    setOpenAddParticipantDialog,
    setOpenSettingsDialog,
    handleChange,
    setEditor,
    setHtml,
    handleClose,
    handleToggle,
    getEndDate,
    getStateDate,
    fileUpload,
    fileDelete,
    getSelectListData,
  };
};

export default useAction;
