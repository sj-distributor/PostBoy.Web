import { useBoolean } from "ahooks";
import { clone } from "ramda";
import { useEffect, useState } from "react";
import {
  IJobSettingDto,
  ILastShowTableData,
  ISendMessageCommand,
  IUpdateMessageCommand,
  MessageJobSendType,
  SendHttpRequestDto,
  SendHttpRequestHeaderDto,
} from "../../../../dtos/enterprise";
import { timeZone } from "../../../../dtos/send-message-job";

export enum ChangeHeaderStatus {
  Add,
  Edit,
  Delete,
}

export const useAction = ({
  addOrUpdate,
  setSendData,
  whetherClear,
  updateMessageJobInformation,
  setRequestUpdateData,
}: {
  addOrUpdate: string;
  setSendData?: React.Dispatch<React.SetStateAction<ISendMessageCommand>>;
  whetherClear?: boolean;
  updateMessageJobInformation?: ILastShowTableData;
  setRequestUpdateData?: React.Dispatch<
    React.SetStateAction<IUpdateMessageCommand | undefined>
  >;
}) => {
  const [title, setTitle] = useState<string>("");

  const [method, setMethod] = useState<string>("GET");

  const [url, setUrl] = useState<string>("");

  const [jsonBody, setJsonBody] = useState<string>("");

  const [headers, setHeaders] = useState<SendHttpRequestHeaderDto[]>([
    { key: "", value: "" },
  ]);

  const [sendTypeValue, setSendTypeValue] = useState<MessageJobSendType>(
    MessageJobSendType.Fire
  );

  const [timeZoneValue, setTimeZoneValue] = useState<number>(
    timeZone.filter((x) => !x.disable)[0].value
  );

  const [dateValue, setDateValue] = useState<string>("");

  const [cronExp, setCronExp] = useState<string>("0 0 * * *");

  const [cronError, setCronError] = useState<string>("");

  const [endDateValue, setEndDateValue] = useState<string>("");

  const [promptText, setPromptText] = useState<string>("");

  const [openError, openErrorAction] = useBoolean(false);

  const [sendHttpRequestData, setSendHttpRequestData] =
    useState<SendHttpRequestDto>({});

  const [jobSettingData, setJobSettingData] = useState<IJobSettingDto>({
    timezone: timeZone[timeZoneValue].convertTimeZone,
  });

  const [metadata, setMetaData] = useState<{ key: string; value: string }[]>(
    []
  );

  const handleChangeMethod = (text: string) => {
    setMethod(text);
  };

  const handleChangeUrl = (text: string) => {
    setUrl(text);
  };

  const handleChangeJsonBody = (text: string) => {
    setJsonBody(text);
  };

  const handleChangeHeaders = (
    status: ChangeHeaderStatus,
    index?: number,
    value?: string,
    key?: keyof SendHttpRequestHeaderDto
  ) => {
    setHeaders((prev) => {
      let newArray = clone(prev);

      switch (status) {
        case ChangeHeaderStatus.Add: {
          newArray.push({ key: "", value: "" });

          break;
        }
        case ChangeHeaderStatus.Edit: {
          if (index !== undefined && key !== undefined && value !== undefined) {
            newArray[index][key] = value;
          }

          break;
        }
        case ChangeHeaderStatus.Delete: {
          newArray = prev.filter((item, i) => index !== i);

          break;
        }
      }

      return newArray;
    });
  };

  const showErrorPrompt = (text: string) => {
    setPromptText(text);
    openErrorAction.setTrue();
  };

  useEffect(() => {
    if (updateMessageJobInformation) {
      const { title, sendHttpRequest, jobSettingJson } =
        updateMessageJobInformation;

      setTitle(title);
      if (sendHttpRequest) {
        const { headers, jsonBody, method, url } = sendHttpRequest;

        setUrl(url ? url : "");

        setMethod(method ? method : "Get");

        setHeaders(
          headers
            ? headers.length > 0
              ? headers
              : [{ key: "", value: "" }]
            : [{ key: "", value: "" }]
        );

        setJsonBody(jsonBody ? jsonBody : "");
      }

      const jobSetting = JSON.parse(jobSettingJson);

      const oldTimeZone = timeZone.find(
        (item) => item.title === JSON.parse(jobSettingJson).Timezone
      )?.value;

      oldTimeZone !== undefined && setTimeZoneValue(oldTimeZone);

      if (jobSetting.DelayedJob !== null) {
        setSendTypeValue(MessageJobSendType.Delayed);
        setDateValue(jobSetting.DelayedJob.EnqueueAt);
      } else if (jobSetting.RecurringJob !== null) {
        setSendTypeValue(MessageJobSendType.Recurring);
        setEndDateValue(jobSetting.RecurringJob.EndDate);
        setCronExp(jobSetting.RecurringJob.CronExpression);
      } else {
        setSendTypeValue(MessageJobSendType.Fire);
      }
    }
  }, [updateMessageJobInformation]);

  useEffect(() => {
    const jobSetting: IJobSettingDto = {
      timezone: timeZone[timeZoneValue].convertTimeZone,
    };

    switch (sendTypeValue) {
      case MessageJobSendType.Fire: {
        break;
      }
      case MessageJobSendType.Delayed: {
        jobSetting.delayedJob = {
          enqueueAt: dateValue,
        };

        break;
      }
      case MessageJobSendType.Recurring: {
        jobSetting.recurringJob = {
          cronExpression: cronExp,
        };

        if (!!endDateValue) jobSetting.recurringJob.endDate = endDateValue;

        break;
      }
    }

    setJobSettingData(jobSetting);
  }, [sendTypeValue, timeZoneValue, dateValue, cronExp, endDateValue]);

  useEffect(() => {
    const sendHttpRequest: SendHttpRequestDto = {
      url: url,
      method: method,
      headers: headers.filter((item) => !!item.key && !!item.value),
    };

    if (method === "POST") sendHttpRequest["jsonBody"] = jsonBody;

    setSendHttpRequestData(sendHttpRequest);
  }, [method, url, jsonBody, headers]);

  useEffect(() => {
    setMetaData([
      {
        key: "title",
        value: title,
      },
      {
        key: "cleanContent",
        value: url,
      },
    ]);
  }, [title, url]);

  useEffect(() => {
    if (addOrUpdate === "Add") {
      setSendData &&
        setSendData({
          jobSetting: jobSettingData,
          sendHttpRequest: sendHttpRequestData,
          metadata: metadata,
        });
    } else {
      setRequestUpdateData &&
        setRequestUpdateData({
          messageJobId: !!updateMessageJobInformation?.id
            ? updateMessageJobInformation?.id
            : "",
          jobSetting: jobSettingData,
          metadata: metadata,
          sendHttpRequest: sendHttpRequestData,
        });
    }
  }, [sendHttpRequestData, jobSettingData, metadata, addOrUpdate]);

  useEffect(() => {
    if (whetherClear) {
      setMethod("Get");
      setUrl("");
      setJsonBody("");
      setHeaders([{ key: "", value: "" }]);
      setSendTypeValue(MessageJobSendType.Fire);
      setTimeZoneValue(timeZone.filter((x) => !x.disable)[0].value);
      setDateValue("");
      setCronExp("0 0 * * *");
      setEndDateValue("");
      setTitle("");
    }
  }, [whetherClear]);

  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse();
      }, 3000);
    }
  }, [openError]);

  return {
    method,
    url,
    handleChangeMethod,
    handleChangeUrl,
    jsonBody,
    handleChangeJsonBody,
    headers,
    handleChangeHeaders,
    ChangeHeaderStatus,
    sendTypeValue,
    setSendTypeValue,
    timeZoneValue,
    setTimeZoneValue,
    dateValue,
    setDateValue,
    cronExp,
    setCronExp,
    setCronError,
    endDateValue,
    setEndDateValue,
    title,
    setTitle,
    promptText,
    openError,
    showErrorPrompt,
  };
};
