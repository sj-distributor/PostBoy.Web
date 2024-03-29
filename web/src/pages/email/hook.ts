import { useEffect, useRef, useState } from "react";
import { GetEmailData } from "../../api/email";
import * as wangEditor from "@wangeditor/editor";
import { IEmailResonponse } from "../../dtos/email";
import { annexEditorConfig } from "../../uilts/wangEditor";
import { ModalBoxRef } from "../../dtos/modal";
import { PostAttachmentUpload, PostMessageSend } from "../../api/enterprise";
import {
  IJobSettingDto,
  ILastShowTableData,
  IUpdateMessageCommand,
  MessageJobSendType,
  UploadAttachmentResponseData,
} from "../../dtos/enterprise";
import { useBoolean } from "ahooks";
import { timeZone } from "../../dtos/send-message-job";
import { clone } from "ramda";
import moment from "moment";
import { convertRoleErrorText } from "../../uilts/convert-error";

const useAction = (
  outterGetUpdateData?: (x: () => IUpdateMessageCommand | undefined) => void,
  emailUpdateData?: ILastShowTableData
) => {
  const emailObj = emailUpdateData?.emailNotification;
  const timeObj = emailUpdateData?.jobSettingJson
    ? JSON.parse(emailUpdateData?.jobSettingJson)
    : undefined;
  const defaultEmailValue = {
    displayName: "",
    senderId: "",
  };

  // 富文本框实例
  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null); // 存储 editor 实例
  // 富文本框html
  const [html, setHtml] = useState<string>(emailObj?.body ?? "");
  // 邮件的从
  const [emailFrom, setEmailFrom] =
    useState<IEmailResonponse>(defaultEmailValue);
  // 邮件从的用户列表
  const [emailList, setEmailList] = useState<IEmailResonponse[]>([]);
  // 发送邮件地址input值
  const [emailToString, setEmailToString] = useState<string>("");
  // 发送邮件地址 确认列表
  const [emailToArr, setEmailToArr] = useState<string[]>(emailObj?.to ?? []);
  // 抄送邮箱地址的input值
  const [emailCopyToString, setEmailCopyToString] = useState<string>("");
  // 抄送邮箱地址的 确定列表
  const [emailCopyToArr, setEmailCopyToArr] = useState<string[]>(
    emailObj?.cc ?? []
  );
  // 邮箱主题
  const [emailSubject, setEmailSubject] = useState<string>(
    emailObj?.subject ?? ""
  );
  // 是否显示抄送
  const [isShowCopyto, setIsShowCopyto] = useState<boolean>(
    !!emailObj?.cc && emailObj?.cc.length > 0
  );
  // 发送记录的ref
  const sendRecordRef = useRef<ModalBoxRef>(null);
  // 周期发送的设置value
  const [jobSetting, setJobSetting] = useState<IJobSettingDto>(
    timeObj ?? undefined
  );
  // 提示语
  const [promptText, setPromptText] = useState<string>("");
  // 提示显隐
  const [openError, openErrorAction] = useBoolean(false);
  // 循环周期
  const [cronExp, setCronExp] = useState<string>(
    timeObj?.RecurringJob?.CronExpression ?? "0 0 * * *"
  );
  // 发送类型选择
  const [sendTypeValue, setSendTypeValue] = useState<MessageJobSendType>(
    emailUpdateData?.jobType ?? MessageJobSendType.Fire
  );
  // 发送时间
  const [dateValue, setDateValue] = useState<string>(
    timeObj?.DelayedJob?.EnqueueAt ?? ""
  );
  // 终止时间
  const [endDateValue, setEndDateValue] = useState<string>(
    timeObj?.RecurringJob?.EndDate ?? ""
  );
  // 时区选择
  const [timeZoneValue, setTimeZoneValue] = useState<number>(
    timeZone.filter((x) => !x.disable)[0].value
  );

  const [sendLoading, setSendLoading] = useState<boolean>(false);

  // 弹出警告
  const showErrorPrompt = (text: string) => {
    setPromptText(text);
    openErrorAction.setTrue();
  };
  // 输出周期报错
  const [cronError, setCronError] = useState<string>("");

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const clickSendRecord = (operation: string) => {
    operation === "open"
      ? sendRecordRef.current?.open()
      : sendRecordRef.current?.close();
  };

  const [annexesList, setAnnexesList] = useState<
    (UploadAttachmentResponseData & { name: string; fileContent: string })[]
  >([]);

  type InsertImageFnType = (url: string, alt: string, href: string) => void;

  const toolbarConfig: Partial<wangEditor.IToolbarConfig> = {
    toolbarKeys: [
      "fontFamily",
      "fontSize",
      "color",
      "|",
      "bold",
      "italic",
      "underline",
      "through",
      "bgColor",
      "sup",
      "sub",
      "|",
      "bulletedList",
      "numberedList",
      "justifyJustify",
      "delIndent",
      "indent",
      "|",
      "insertLink",
      "redo",
      "undo",
      "uploadAttachment",
    ],
  };
  // 点击发送
  const handleClickSend = () => {
    const data = {
      jobSetting,
      metadata: editor
        ? [
            {
              key: "cleanContent",
              value: editor.getText(),
            },
          ]
        : [],
      emailNotification: {
        senderId: emailFrom.senderId,
        subject: emailSubject,
        body: editor ? editor.getHtml() : "",
        to: emailToArr,
        cc: emailCopyToArr,
        attachments: annexesList.map((item) => ({
          fileName: item.fileName,
          fileOriginalName: item.name,
          fileUrl: item.fileUrl,
          fileContent: item.fileContent,
        })),
      },
    };
    setSendLoading(true);
    checkObject() &&
      PostMessageSend(data)
        .then((data) => {
          if (data) {
            setPromptText("发送成功");
            openErrorAction.setTrue();
            setSendLoading(false);
            // 清空数据
            setJobSetting({
              timezone: timeZone[timeZoneValue].convertTimeZone,
            });
            editor && editor.setHtml("<p></p>");
            setEmailCopyToArr([]);
            setEmailToArr([]);
            setAnnexesList([]);
            setEmailToString("");
            setEmailCopyToString("");
            setEmailSubject("");
            setSendTypeValue(MessageJobSendType.Fire);
            setTimeZoneValue(timeZone.filter((x) => !x.disable)[0].value);
            setCronError("");
            setCronExp("0 0 * * *");
            setEndDateValue("");
            setDateValue("");
          } else {
            openErrorAction.setTrue();
            setPromptText("发送失败");
          }
        })
        .catch((error: Error) => {
          showErrorPrompt(convertRoleErrorText(error));
        });
    setSendLoading(false);
  };

  const editorConfig = {
    placeholder: "请输入内容...",
    autoFocus: false,
    hoverbarKeys: {
      ...annexEditorConfig.hoverbarKeys,
    },
    MENU_CONF: {
      ...annexEditorConfig.MENU_CONF,
      // “上传附件”菜单的配置
      uploadAttachment: {
        // 用户自定义上传
        customUpload: (file: File) => {
          if (file.size / 1024 > 20 * 1024) {
            showErrorPrompt("The Image size is too large!");
            return;
          }
          const formData = new FormData();
          const reader = new FileReader();
          let base64 = "";
          reader.readAsDataURL(file);
          reader.onload = (res) => {
            typeof res.target?.result === "string" &&
              (base64 = res.target?.result);
          };
          formData.append("file", file);
          PostAttachmentUpload(formData).then((res) => {
            res &&
              setAnnexesList((prev) => [
                ...prev,
                Object.assign(res, { name: file.name, fileContent: base64 }),
              ]);
          });
        },
      },
      uploadImage: {
        customUpload(file: File, insertFn: InsertImageFnType) {
          if (file.size / 1024 > 20 * 1024) {
            showErrorPrompt("The Image size is too large!");
            return;
          }
          const formData = new FormData();
          formData.append("file", file);
          PostAttachmentUpload(formData).then((res) => {
            if (res) insertFn(res.fileUrl, res.fileName, res.filePath);
          });
        },
      },
    },
  };

  const inputSx = { marginLeft: "1rem", flex: 1 };

  // 发送邮箱和抄送邮箱 input changing的时候通用自定义修改
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    setString: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = (e.target as HTMLInputElement).value;
    !!value.slice(0, -1) && (value.includes(";") || value.includes("；"))
      ? (() => {
          setArr((prev) => [...prev, value.slice(0, -1)]);
          setString("");
        })()
      : setString(value);
  };

  // 发送邮箱和抄送邮箱 input keydown的时候通用自定义修改
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    setString: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = (e.target as HTMLInputElement).value;
    e.code === "Backspace" &&
      value === "" &&
      setArr((prev) => {
        const newValue = prev.filter((x) => x);
        newValue.splice(newValue.length - 1, 1);
        return newValue;
      });
    if (!!value && (e.code === "Enter" || e.code === "NumpadEnter")) {
      setArr((prev) => [...prev, value]);
      setString("");
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>,
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    setString: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = (e.target as HTMLInputElement).value;
    if (!!value) {
      setArr((prev) => [...prev, value]);
      setString("");
    }
  };

  const validateAttrFunc = (string: string) => {
    return string
      ? {
          helperText: !validateEmail(string) ? "Incorrect entry." : "",
          error: !validateEmail(string),
        }
      : {
          helperText: "",
          error: false,
        };
  };

  const checkObject = () => {
    if (
      !emailToString &&
      (emailToArr.length <= 0 || emailToArr.some((x) => !validateEmail(x)))
    ) {
      setPromptText("please enter a valid email address for send to");
      openErrorAction.setTrue();
      return false;
    } else if (
      emailToString &&
      emailToArr.length <= 0 &&
      validateEmail(emailToString)
    ) {
      setPromptText("please enter a valid email address for send to");
      openErrorAction.setTrue();
      return false;
    } else if (emailCopyToArr.some((x) => !validateEmail(x))) {
      setPromptText("please enter a valid email address for send copy");
      openErrorAction.setTrue();
      return false;
    } else if (
      emailCopyToString &&
      emailCopyToArr.length <= 0 &&
      validateEmail(emailCopyToString)
    ) {
      setPromptText("please enter a valid email address for send copy");
      openErrorAction.setTrue();
      return false;
    } else if (!emailSubject) {
      setPromptText("please enter a valid email subject");
      openErrorAction.setTrue();
      return false;
    } else if (!emailFrom.displayName) {
      setPromptText("please select a email from");
      openErrorAction.setTrue();
      return false;
    } else if (
      editor?.getHtml() === "<p><br></p>" ||
      editor?.getHtml() === "<p></p>"
    ) {
      setPromptText("please enter email content");
      openErrorAction.setTrue();
      return false;
    } else if (
      sendTypeValue === MessageJobSendType.Delayed &&
      !jobSetting?.delayedJob?.enqueueAt
    ) {
      openErrorAction.setTrue();
      setPromptText("Please select delivery time!");
      return false;
    } else if (
      sendTypeValue === MessageJobSendType.Recurring &&
      jobSetting?.recurringJob?.cronExpression.trim().split(" ").length !== 5
    ) {
      openErrorAction.setTrue();
      setPromptText("Please select the sending period!");
      return false;
    } else if (
      (!!jobSetting?.recurringJob &&
        jobSetting.recurringJob.endDate &&
        !moment(jobSetting.recurringJob.endDate).isSameOrAfter(
          new Date(),
          "minute"
        )) ||
      (sendTypeValue === MessageJobSendType.Recurring &&
        !jobSetting?.recurringJob?.endDate)
    ) {
      openErrorAction.setTrue();
      setPromptText("The end time cannot exceed the current time!");
      return false;
    }
    return true;
  };

  const handleAnnexDelete = (
    deleteItem: UploadAttachmentResponseData & {
      name: string;
      fileContent: string;
    }
  ) => {
    setAnnexesList((prev) => {
      const newValue = clone(prev);
      const deleteIndex = newValue.findIndex((x) => x.id === deleteItem.id);
      newValue.splice(deleteIndex, 1);
      return newValue;
    });
  };

  useEffect(() => {
    outterGetUpdateData &&
      outterGetUpdateData(() => {
        if (checkObject())
          return {
            jobSetting: jobSetting ?? {
              timezone: timeZone[timeZoneValue].convertTimeZone,
            },
            metadata: editor
              ? [
                  {
                    key: "cleanContent",
                    value: editor.getText(),
                  },
                ]
              : [],
            emailNotification: {
              senderId: emailFrom.senderId,
              subject: emailSubject,
              body: editor ? editor.getHtml() : "",
              to: emailToArr,
              cc: emailCopyToArr,
            },
            messageJobId: "",
          };
        else return undefined;
      });
  }, [
    jobSetting,
    editor?.getText(),
    emailFrom,
    emailSubject,
    emailToArr,
    emailCopyToArr,
  ]);

  // 延迟关闭警告提示
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse();
      }, 3000);
    }
  }, [openError]);

  useEffect(() => {
    GetEmailData()
      .then((data) => {
        // 获取发送信息
        if (data && data.length > 0) {
          setEmailList(data);
          setEmailFrom(
            data.find((x) => x.senderId === emailObj?.senderId) ?? data[0]
          );
        }
      })
      .catch((error: Error) => {
        openErrorAction.setTrue();
        setPromptText(convertRoleErrorText(error));
      });
  }, []);

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // jobSetting参数
  useEffect(() => {
    switch (sendTypeValue) {
      case MessageJobSendType.Fire: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
        });
        break;
      }
      case MessageJobSendType.Delayed: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
          delayedJob: {
            enqueueAt: dateValue,
          },
        });
        break;
      }
      default: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
          recurringJob: !!endDateValue
            ? {
                cronExpression: cronExp,
                endDate: endDateValue,
              }
            : {
                cronExpression: cronExp,
              },
        });
        break;
      }
    }
  }, [sendTypeValue, timeZoneValue, cronExp, dateValue, endDateValue]);

  return {
    toolbarConfig,
    editorConfig,
    inputSx,
    editor,
    html,
    emailFrom,
    emailList,
    isShowCopyto,
    sendRecordRef,
    emailToString,
    emailToArr,
    emailCopyToArr,
    emailCopyToString,
    emailSubject,
    sendTypeValue,
    dateValue,
    endDateValue,
    cronExp,
    timeZoneValue,
    promptText,
    openError,
    sendLoading,
    annexesList,
    validateAttrFunc,
    setPromptText,
    setTimeZoneValue,
    setCronError,
    setCronExp,
    setEndDateValue,
    setDateValue,
    showErrorPrompt,
    setSendTypeValue,
    setEmailSubject,
    setEmailCopyToArr,
    setEmailToArr,
    setEmailToString,
    setEmailCopyToString,
    setIsShowCopyto,
    validateEmail,
    setEditor,
    setHtml,
    setEmailFrom,
    clickSendRecord,
    handleClickSend,
    handleKeyDown,
    handleChange,
    handleBlur,
    handleAnnexDelete,
  };
};

export default useAction;
