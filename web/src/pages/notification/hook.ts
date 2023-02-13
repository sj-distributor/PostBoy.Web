import { useBoolean } from "ahooks"
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
  ISendMessageCommand,
  ISendRecordDto,
  IUpdateMessageCommand,
  MessageJobDestination,
  MessageJobSendType,
  // MessageJobType,
  messageSendResultType,
} from "../../dtos/enterprise"
import { ModalBoxRef } from "../../dtos/modal"

// 转换数组类型返回
const messageJobConvertType = (arr: IMessageJob[]) => {
  const array: ILastShowTableData[] = []
  if (arr.length > 0) {
    arr.forEach((item) =>
      array.push({
        id: item.id,
        jobId: item.jobId,
        createdDate: item.createdDate,
        correlationId: item.correlationId,
        userAccountId: item.userAccountId,
        jobType: item.jobType,
        jobSettingJson: item.jobSettingJson,
        jobCronExpressionDesc: item.jobCronExpressionDesc,
        destination: item.destination,
        workWeChatAppNotification: item.workWeChatAppNotification,
        metadata: item.metadata,
        content: item.workWeChatAppNotification.text?.content,
        title: item.metadata.filter((item) => item.key === "title")[0]?.value,
        enterprise: {
          corpName: item.metadata.filter(
            (item) => item.key === "enterpriseName"
          )[0]?.value,
          id: item.metadata.filter((item) => item.key === "enterpriseId")[0]
            ?.value,
        },
        app: {
          name: item.metadata.filter((item) => item.key === "appName")[0]
            ?.value,
          id: item.metadata.filter((item) => item.key === "appId")[0]?.value,
          appId: item.metadata.filter((item) => item.key === "weChatAppId")[0]
            ?.value,
        },
      })
    )
  }
  return array
}

export const useAction = () => {
  const noticeSettingRef = useRef<ModalBoxRef>(null)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const deleteConfirmRef = useRef<ModalBoxRef>(null)

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
  const [loading, setLoading] = useBoolean(false)

  const [updateMessageJobInformation, setUpdateMessageJobInformation] =
    useState<ILastShowTableData>()

  const onNoticeCancel = () => {
    noticeSettingRef.current?.close()
  }

  const onSendCancel = () => {
    sendRecordRef.current?.close()
  }

  const onConfirm = () => {
    noticeSettingRef.current?.close()
  }

  const onSetting = (item: ILastShowTableData) => {
    if (item.jobType !== MessageJobSendType.Fire) {
      setUpdateMessageJobInformation(item)
      noticeSettingRef.current?.open()
      return
    }
    setAlertShow.setTrue()
  }

  const messageRecordConvertType = (
    arr: IMessageJobRecord[],
    toObject: string
  ) => {
    const sendRecordArray: ISendRecordDto[] = []
    if (arr.length > 0) {
      arr.forEach((item) => {
        sendRecordArray.push({
          id: item.id,
          createdDate: item.createdDate,
          correlationId: item.correlationId,
          result: item.result,
          state: messageSendResultType[item.result],
          sendTheObject: toObject,
          errorSendtheobject:
            JSON.parse(item.responseJson).invaliduser !== null
              ? "未发送成功的对象:" + JSON.parse(item.responseJson).invaliduser
              : "",
        })
      })
    }
    return sendRecordArray
  }

  const onSend = async (toObject: string, id: string) => {
    sendRecordRef.current?.open()
    await GetMessageJobRecords(id).then((res) => {
      if (!!res) {
        setSendRecordList(messageRecordConvertType(res, toObject))
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
    console.log(data, "data--")
    // PostMessageJobUpdate(data)
    //   .then(() => {
    //     console.log("成功")
    //     // ref.current.close()
    //   })
    //   .catch((err) => {
    //     console.log("失败")
    //     throw Error(err)
    //   })
  }

  // 获取MessageJob 数组
  const getMessageJob = () => {
    updateData("loading", true)
    GetMessageJob(dto.page + 1, dto.pageSize, MessageJobDestination.WorkWeChat)
      .then((res) => {
        if (!!res) {
          setTimeout(() => {
            updateData("rowCount", res.count)
            updateData("messageJobs", messageJobConvertType(res.messageJobs))
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

  const onDeleteMessageJobConfirm = (id: string) => {
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

  return {
    noticeSettingRef,
    sendRecordRef,
    deleteConfirmRef,
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    onDeleteMessageJob,
    onDeleteMessageJobConfirm,
    sendRecordList,
    updateMessageJobInformation,
    alertShow,
    deleteId,
    loading,
    setLoading,
    dto,
    getMessageJob,
    updateData,
    onUpdateMessageJob,
  }
}
