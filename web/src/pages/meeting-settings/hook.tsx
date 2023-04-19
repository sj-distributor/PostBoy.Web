import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import * as wangEditor from "@wangeditor/editor";
import { IEditorConfig } from "@wangeditor/editor";

const useAction = () => {
  enum SelectType {
    startTime = 0,
    endTime = 1,
  }

  const [selectData, setSelectData] = useState([
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
  const [selectGroup, setSelectGroup] = useState([
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
  // 富文本框实例
  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null); // 存储 editor 实例
  // 富文本框html
  const [html, setHtml] = useState<string>("");
  // 编辑器配置
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

  const handleChange = async (event: SelectChangeEvent, type: string) => {
    console.log(type, event.target.value);
    let newList = selectGroup;
    await newList.forEach(
      (item) => item.key === type && (item.value = event.target.value)
    );
    await setSelectGroup(newList);
    console.log(selectGroup);
  };

  return {
    SelectType,
    editor,
    html,
    toolbarConfig,
    selectData,
    editorConfig,
    selectGroup,
    handleChange,
    setEditor,
    setHtml,
  };
};

export default useAction;
