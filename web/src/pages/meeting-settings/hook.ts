import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";
import {
  DateTimeData,
  SelectDataType,
  SelectGroupType,
} from "../../dtos/meeting-seetings";

const useAction = () => {
  const [openAddParticipantDialog, setOpenAddParticipantDialog] =
    useState<boolean>(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<SelectDataType[][]>([
    [
      {
        value: "1:00",
        lable: "1:00",
      },
      {
        value: "2:00",
        lable: "2:00",
      },
      {
        value: "4:00",
        lable: "4:00",
      },
    ],
    [
      {
        value: "5:00",
        lable: "5:00",
      },
      {
        value: "6:00",
        lable: "6:00",
      },
      {
        value: "8:00",
        lable: "8:00",
      },
    ],
  ]);
  const [selectGroup, setSelectGroup] = useState<SelectGroupType[]>([
    {
      title: "提醒",
      key: "reminderTime",
      value: "",
      data: [
        {
          value: "十五分钟前",
          lable: "十五分钟前",
        },
        {
          value: "会议开始时",
          lable: "会议开始时",
        },
        {
          value: "一小时前",
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
          value: "不重复",
          lable: "不重复",
        },
        {
          value: "重复",
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
          value: "MARS.PENG的日历",
          lable: "MARS.PENG的日历",
        },
        {
          value: "ELK的日历",
          lable: "ELK的日历",
        },
        {
          value: "JKL的日历",
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

  const [annexFile, setAnnexFile] = useState(["icon.png"]);
  // 文件上传
  const fileUpload = async (
    files: FileList,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let fileList = annexFile;
    for (var i = 0; i < files.length; i++) {
      var name = files[i].name;
      fileList.findIndex((item) => item === name) === -1 && fileList.push(name);
    }
    setAnnexFile(fileList);
  };

  return {
    editor,
    html,
    toolbarConfig,
    selectData,
    editorConfig,
    selectGroup,
    openAnnexList,
    anchorRef,
    openAddParticipantDialog,
    openSettingsDialog,
    annexFile,
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
  };
};

export default useAction;
