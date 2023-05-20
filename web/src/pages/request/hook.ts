import { useBoolean } from "ahooks";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { PostMessageSend } from "../../api/enterprise";
import {
  ISendMessageCommand,
  IUpdateMessageCommand,
} from "../../dtos/enterprise";
import { ModalBoxRef } from "../../dtos/modal";

export const judgeDataIsCorrect = (
  data: ISendMessageCommand | IUpdateMessageCommand,
  showErrorPrompt: (text: string) => void,
  setAlertType?: React.Dispatch<React.SetStateAction<"error" | "success">>
) => {
  const { sendHttpRequest, jobSetting, metadata } = data;

  let isCorrect: boolean = false;

  if (sendHttpRequest) {
    const { url } = sendHttpRequest;

    if (url === undefined || url?.length <= 0) {
      showErrorPrompt("Http Url is not filled!");
      setAlertType && setAlertType("error");
      isCorrect = false;

      return;
    } else {
      const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
      const isValid = pattern.test(url);

      if (!isValid) {
        showErrorPrompt("URL format is incorrect!");
        setAlertType && setAlertType("error");
        isCorrect = false;

        return;
      }
    }
  }

  if (jobSetting) {
    const { delayedJob, recurringJob } = jobSetting;

    if (recurringJob) {
      const { cronExpression, endDate } = recurringJob;

      if (cronExpression.trim().split(" ").length !== 5) {
        showErrorPrompt("Please select the sending period!");
        setAlertType && setAlertType("error");

        isCorrect = false;

        return;
      } else if (endDate && moment(endDate).isBefore(new Date(), "minute")) {
        showErrorPrompt("The end time cannot exceed the current time!");
        setAlertType && setAlertType("error");

        isCorrect = false;

        return;
      }
    }

    if (delayedJob) {
      const { enqueueAt } = delayedJob;
      if (enqueueAt === undefined || enqueueAt.length <= 0) {
        showErrorPrompt("Please select delivery time!");
        setAlertType && setAlertType("error");

        isCorrect = false;

        return;
      }
    }
  }

  if (metadata) {
    const title = metadata.filter((item) => item.key === "title");

    if (title.length <= 0 || title[0].value.length <= 0) {
      showErrorPrompt("Please fill in the title!");
      setAlertType && setAlertType("error");

      isCorrect = false;

      return;
    }
  }

  isCorrect = true;

  return isCorrect ? data : undefined;
};

export const useAction = () => {
  const [promptText, setPromptText] = useState<string>("");

  const [openError, openErrorAction] = useBoolean(false);

  const openHistoryRef = useRef<ModalBoxRef>(null);

  const [sendData, setSendData] = useState<ISendMessageCommand>({});

  const [whetherClear, setWhetherClear] = useState<boolean>(false);

  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const showErrorPrompt = (text: string) => {
    setPromptText(text);
    openErrorAction.setTrue();
  };

  const RequestSend = () => {
    const data = judgeDataIsCorrect(sendData, showErrorPrompt, setAlertType);

    if (data) {
      PostMessageSend(data as ISendMessageCommand)
        .then((res) => {
          setWhetherClear(true);
          setAlertType("success");
          showErrorPrompt("This request save success!");
        })
        .catch(() => {
          setAlertType("error");
          showErrorPrompt("This request save error!");
        });
    }
  };

  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse();
      }, 3000);
    }
  }, [openError]);

  useEffect(() => {
    if (whetherClear) {
      setTimeout(() => {
        setWhetherClear(false);
      }, 3000);
    }
  }, [whetherClear]);

  return {
    promptText,
    openError,
    RequestSend,
    openHistoryRef,
    setSendData,
    whetherClear,
    alertType,
  };
};
