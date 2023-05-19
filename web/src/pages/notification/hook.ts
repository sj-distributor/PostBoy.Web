import { useBoolean } from "ahooks"
import { clone } from "ramda"
import { useEffect, useRef, useState } from "react"
import {
  GetMessageJob,
  GetMessageJobRecords,
  PostMessageJobDelete,
  PostMessageJobUpdate,
} from "../../api/enterprise"
import {
  IDtoExtend,
  ILastShowTableData,
  IMessageJob,
  IMessageJobRecord,
  ISendRecordDto,
  IUpdateMessageCommand,
  IWorkWeChatAppNotificationDto,
  MessageJobDestination,
  messageJobSendType,
  MessageJobSendType,
  messageSendResultType,
} from "../../dtos/enterprise"
import { ModalBoxRef } from "../../dtos/modal"
import { convertType } from "../../uilts/convert-type"
import { parameterJudgment } from "../../uilts/parameter-judgment"
import { judgeDataIsCorrect } from "../request/hook"

const judgeContent = (
  workWeChatAppNotification: IWorkWeChatAppNotificationDto,
  cleanContent: string
) => {
  if (cleanContent !== undefined && !!cleanContent) {
    return cleanContent
  } else if (workWeChatAppNotification.text !== null) {
    return workWeChatAppNotification.text?.content.replace(/<.*?>/g, "")
  } else if (workWeChatAppNotification.mpNews !== null) {
    return workWeChatAppNotification.mpNews?.articles[0].content.replace(
      /<.*?>/g,
      ""
    )
  } else {
    return "文件"
  }
}

// 转换数组类型返回
const messageJobConvertType = (
  arr: IMessageJob[],
  recordType: MessageJobDestination
) => {
  const isRecordTypeEmail = recordType === MessageJobDestination.Email

  const array: ILastShowTableData[] = []
  if (arr.length > 0) {
    arr.forEach((item) => {
      const data = {
        id: item.id,
        jobId: item.jobId,
        createdDate: item.createdDate,
        correlationId: item.correlationId,
        userAccountId: item.userAccountId,
        isDelete: item.isDelete,
        jobType: item.jobType,
        sendType: messageJobSendType[item.jobType],
        jobSettingJson: item.jobSettingJson,
        jobCronExpressionDesc: item.jobCronExpressionDesc,
        destination: item.destination,
        workWeChatAppNotification: item.workWeChatAppNotification,
        metadata: item.metadata,
        cleanContent: item.metadata.filter(
          (item) => item.key === "cleanContent"
        )[0]?.value,
        hasException: item.hasException,
        content: isRecordTypeEmail
          ? item.metadata.filter((item) => item.key === "cleanContent")[0]
              ?.value ?? item.emailNotification?.body.replace(/<.*?>/g, "")
          : judgeContent(
              item.workWeChatAppNotification,
              item.metadata.filter((item) => item.key === "cleanContent")[0]
                ?.value
            ),
        emailNotification: item?.emailNotification,
        title: isRecordTypeEmail
          ? item.emailNotification
            ? item.emailNotification.subject
            : ""
          : item.metadata.filter((item) => item.key === "title")[0]?.value,
        groupName: item.metadata.filter((item) => item.key === "groupName")[0]
          ?.value,
        groupId: item.metadata.filter((item) => item.key === "groupId")[0]
          ?.value,
        enterprise: {
          corpName: item.metadata.filter(
            (item) => item.key === "enterpriseName"
          )[0]?.value,
          id: item.metadata.filter((item) => item.key === "enterpriseId")[0]
            ?.value,
          corpId: item.metadata.filter(
            (item) => item.key === "enterpriseCorpId"
          )[0]?.value,
        },
        app: {
          name: item.metadata.filter((item) => item.key === "appName")[0]
            ?.value,
          id: item.metadata.filter((item) => item.key === "appId")[0]?.value,
          appId: item.metadata.filter((item) => item.key === "weChatAppId")[0]
            ?.value,
          workWeChatCorpId: item.metadata.filter(
            (item) => item.key === "enterpriseId"
          )[0]?.value,
          agentId: Number(
            item.metadata.filter((item) => item.key === "agentId")[0]?.value
          ),
          display: Boolean(
            item.metadata.filter((item) => item.key === "display")[0]?.value
          ),
        },
        sendHttpRequest: item.sendHttpRequest
          ? item.sendHttpRequest
          : undefined,
      }

      isRecordTypeEmail
        ? item.emailNotification && array.push(data)
        : array.push(data)
    })
  }

  return array
}

export const useAction = (recordType: MessageJobDestination) => {
  const noticeSettingRef = useRef<ModalBoxRef>(null)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const deleteConfirmRef = useRef<ModalBoxRef>(null)

  const [showEmail, setShowEmail] = useState(false)

  const [dto, setDto] = useState<IDtoExtend>({
    loading: true,
    messageJobs: [],
    rowCount: 0,
    pageSize: 10,
    page: 0,
  })

  const [deleteId, setDeleteId] = useState<string>("")
  const [sendRecordList, setSendRecordList] = useState<ISendRecordDto[]>([])
  const [alertShow, setAlertShow] = useBoolean(false)
  const [deleteShow, setDeleteShow] = useBoolean(false)
  const [loading, setLoading] = useBoolean(false)

  const [promptText, setPromptText] = useState<string>("")

  const [openError, openErrorAction] = useBoolean(false)

  const [failSend, failSendAction] = useBoolean(false)

  const [updateMessageJobInformation, setUpdateMessageJobInformation] =
    useState<ILastShowTableData>()

  const [emailUpdateData, setEmailUpdateData] =
    useState<() => IUpdateMessageCommand | undefined>()

  const [recordRowLoading, setRecordRowLoading] = useState(false)

  const [showRequest, setShowRequest] = useState<boolean>(false)

  const [requestUpdateData, setRequestUpdateData] =
    useState<IUpdateMessageCommand>()

  const onNoticeCancel = () => {
    noticeSettingRef.current?.close()
  }

  const onSendCancel = () => {
    sendRecordRef.current?.close()
  }

  const onSetting = (item: ILastShowTableData) => {
    if (item.jobType !== MessageJobSendType.Fire) {
      setUpdateMessageJobInformation(item)
      noticeSettingRef.current?.open()
      return
    }
    if (item.isDelete) {
      setDeleteShow.setTrue()
      return
    }
    setAlertShow.setTrue()
  }

  const onEmailSetting = (item: ILastShowTableData) => {
    if (item.jobType === MessageJobSendType.Fire) {
      setAlertShow.setTrue()
      return
    }
    setUpdateMessageJobInformation(item)
    setShowEmail(true)
  }

  const onRequestSetting = (item: ILastShowTableData) => {
    if (item.jobType === MessageJobSendType.Fire) {
      setAlertShow.setTrue()
      return
    }

    setUpdateMessageJobInformation(item)
    setShowRequest(true)
  }

  const outterGetUpdateData = (
    callback: () => IUpdateMessageCommand | undefined
  ) => {
    setEmailUpdateData(() => callback)
  }

  const handleEmailConfirm = () => {
    const data = emailUpdateData && emailUpdateData()
    data &&
      PostMessageJobUpdate(
        Object.assign(data, {
          messageJobId: updateMessageJobInformation?.id,
        })
      ).then((data) => {
        data && getMessageJob()
      })
    data && handleEmailCancel()
  }

  const handleRequestConfirm = () => {
    if (requestUpdateData) {
      const data = judgeDataIsCorrect(requestUpdateData, showErrorPrompt)

      if (data) {
        PostMessageJobUpdate(data as IUpdateMessageCommand)
          .then((res) => {
            getMessageJob()
            handleRequestState(false)
          })
          .catch((err) => {
            showErrorPrompt("Update request error!")
          })
      }
    }
  }

  const handleEmailCancel = () => {
    setShowEmail(false)
  }

  const handleRequestState = (state: boolean) => {
    setShowRequest(state)
  }

  // 弹出警告
  const showErrorPrompt = (text: string) => {
    setPromptText(text)
    openErrorAction.setTrue()
  }

  const messageRecordConvertType = (
    arr: IMessageJobRecord[],
    toObject: string
  ) => {
    const sendRecordArray: ISendRecordDto[] = []
    arr.length > 0 &&
      arr.forEach((item) => {
        const sendToEmailNotification = dto.messageJobs.find((cellItem) => {
          return cellItem.correlationId === item.correlationId
        })?.emailNotification
        const sendTo = sendToEmailNotification
          ? sendToEmailNotification?.to?.join(";") +
            (!!sendToEmailNotification?.cc?.join(";")
              ? ", " + sendToEmailNotification?.cc?.join(";")
              : "")
          : ""
        sendRecordArray.push({
          id: item.id,
          createdDate: item.createdDate,
          correlationId: item.correlationId,
          result: item.result,
          state: messageSendResultType[item.result],
          sendTheObject:
            item.target !== null
              ? item.target
              : recordType === MessageJobDestination.WorkWeChat
              ? toObject
              : sendTo,
          errorSendtheobject:
            item.exception !== null
              ? item.exception
              : JSON.parse(item.responseJson).invaliduser !== null &&
                JSON.parse(item.responseJson).invaliduser !== undefined
              ? "未发送成功的对象:" + JSON.parse(item.responseJson).invaliduser
              : "",
        })
      })
    return sendRecordArray
  }

  const onSend = async (toObject: string, id: string) => {
    sendRecordRef.current?.open()
    setRecordRowLoading(true)
    await GetMessageJobRecords(id).then((res) => {
      if (!!res) {
        setRecordRowLoading(false)
        setSendRecordList(messageRecordConvertType(res, toObject))
      } else {
        setRecordRowLoading(false)
      }
    })
  }

  const onDeleteMessageJob = (id: string) => {
    deleteConfirmRef.current?.close()
    PostMessageJobDelete({
      MessageJobId: id,
    })
      .then((res) => {
        getMessageJob()
      })
      .catch((err) => {
        throw Error(err)
      })
  }

  const onUpdateMessageJob = (data: IUpdateMessageCommand) => {
    const cloneData = clone(data)
    cloneData.workWeChatAppNotification =
      cloneData.workWeChatAppNotification &&
      convertType(cloneData.workWeChatAppNotification)
    if (parameterJudgment(cloneData, showErrorPrompt)) {
      PostMessageJobUpdate(cloneData)
        .then(() => {
          noticeSettingRef.current?.close()
          setTimeout(() => {
            getMessageJob()
          }, 500)
        })
        .catch((err) => {
          failSendAction.setTrue()
          throw Error(err)
        })
    }
  }

  // 获取MessageJob 数组
  const getMessageJob = () => {
    updateData("loading", true)
    GetMessageJob(dto.page + 1, dto.pageSize, recordType)
      .then((res) => {
        if (!!res) {
          setTimeout(() => {
            updateData("rowCount", res.count)
            updateData(
              "messageJobs",
              messageJobConvertType(res.messageJobs, recordType)
            )
            updateData("loading", false)
          }, 500)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          updateData("rowCount", 0)
          updateData("messageJobs", [])
          updateData("loading", false)
        }, 500)
      })
  }

  useEffect(() => {
    getMessageJob()
  }, [dto.page, dto.pageSize])

  // 更新MessageJob table参数
  const updateData = (k: keyof IDtoExtend, v: any) => {
    setDto((prev) => ({ ...prev, [k]: v }))
  }

  const onDeleteMessageJobConfirm = (id: string, isDelete: boolean) => {
    if (isDelete) {
      setDeleteShow.setTrue()
      return
    }
    deleteConfirmRef.current?.open()
    setDeleteId(id)
  }

  useEffect(() => {
    if (alertShow) {
      setTimeout(() => {
        setAlertShow.setFalse()
      }, 1200)
    }
  }, [alertShow])

  useEffect(() => {
    if (deleteShow) {
      setTimeout(() => {
        setDeleteShow.setFalse()
      }, 1200)
    }
  }, [deleteShow])

  // 延迟关闭警告提示
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse()
      }, 3000)
    }
  }, [openError])

  return {
    noticeSettingRef,
    sendRecordRef,
    deleteConfirmRef,
    onSetting,
    onSend,
    onSendCancel,
    onNoticeCancel,
    onDeleteMessageJob,
    onDeleteMessageJobConfirm,
    sendRecordList,
    updateMessageJobInformation,
    alertShow,
    deleteShow,
    deleteId,
    loading,
    setLoading,
    dto,
    getMessageJob,
    updateData,
    onUpdateMessageJob,
    failSend,
    promptText,
    openError,
    showErrorPrompt,
    onEmailSetting,
    setShowEmail,
    showEmail,
    handleEmailConfirm,
    handleEmailCancel,
    outterGetUpdateData,
    recordRowLoading,
    showRequest,
    handleRequestState,
    onRequestSetting,
    handleRequestConfirm,
    setRequestUpdateData,
  }
}
