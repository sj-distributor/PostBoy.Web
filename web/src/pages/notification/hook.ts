import { useBoolean } from "ahooks"
import { useEffect, useRef, useState } from "react"
import {
  GetMessageJobRecords,
  PostMessagejobDelete,
} from "../../api/enterprise"
import {
  ILastShowTableData,
  IMessageJobRecord,
  ISendRecordDto,
  MessageJobType,
  messageSendResultType,
} from "../../dtos/enterprise"
import { ModalBoxRef } from "../../dtos/modal"
import { HookProps } from "./props"

export const useAction = ({ getMessageJob }: HookProps) => {
  const noticeSettingRef = useRef<ModalBoxRef>(null)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const deleteConfirmRef = useRef<ModalBoxRef>(null)

  const [deleteId, setDeleteId] = useState<string>("")
  const [sendRecordList, setSendRecordList] = useState<ISendRecordDto[]>([])
  const [clickSendRecordItemUsers, setClickSendRecordItemUsers] =
    useState<string>("")

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
    if (item.jobType !== MessageJobType.Fire) {
      setUpdateMessageJobInformation(item)
      noticeSettingRef.current?.open()
      return
    }
    setAlertShow.setTrue()
  }

  const messageRecordConvertType = (arr: IMessageJobRecord[]) => {
    const sendRecordArray: ISendRecordDto[] = []
    if (arr.length > 0) {
      arr.forEach((item) => {
        sendRecordArray.push({
          id: item.id,
          createdDate: item.createdDate,
          correlationId: item.correlationId,
          result: item.result,
          state: messageSendResultType[item.result],
          sendTheObject: clickSendRecordItemUsers,
          errorSendtheobject:
            JSON.parse(item.responseJson).invaliduser !== null
              ? "未发送成功的对象:" + JSON.parse(item.responseJson).invaliduser
              : "",
        })
      })
    }
    return sendRecordArray
  }

  const onSend = (toUsers: string, id: string) => {
    sendRecordRef.current?.open()
    setClickSendRecordItemUsers(toUsers)
    GetMessageJobRecords(id).then((res) => {
      if (!!res) {
        setSendRecordList(messageRecordConvertType(res))
      }
    })
  }

  const onDeleteMessageJob = (id: string) => {
    deleteConfirmRef.current?.close()
    PostMessagejobDelete(id)
      .then((res) => {
        getMessageJob()
      })
      .catch((err) => {
        throw Error(err)
      })
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
  }
}
