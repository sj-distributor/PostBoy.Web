import { useMemo, useRef, useState } from "react"
import {
  GetMessageJobRecords,
  PostMessagejobDelete,
} from "../../api/enterprise"
import {
  ILastShowTableData,
  IMessageJobRecord,
  ISendRecordDto,
} from "../../dtos/enterprise"
import { ModalBoxRef } from "../../dtos/modal"

export interface HookProps {
  getMessageJob: () => void
}

export const useAction = ({ getMessageJob }: HookProps) => {
  const noticeSettingRef = useRef<ModalBoxRef>(null)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const [sendRecordList, setSendRecordList] = useState<IMessageJobRecord[]>([])
  const [clickSendRecordItemUsers, setClickSendRecordItemUsers] = useState<
    string[]
  >([])

  const onNoticeCancel = () => {
    noticeSettingRef.current?.close()
  }

  const onSendCancel = () => {
    sendRecordRef.current?.close()
  }

  const onConfirm = () => {
    alert("click")
  }

  const onSetting = () => {
    noticeSettingRef.current?.open()
  }

  const onSend = (item: ILastShowTableData) => {
    sendRecordRef.current?.open()
    // setClickSendRecordItemUsers(
    //   JSON.parse(item.commandJson)?.WorkWeChatAppNotification?.ToUsers
    // )
    console.log(
      JSON.parse(item.commandJson)?.WorkWeChatAppNotification?.ToUsers
    )
    GetMessageJobRecords(item.correlationId).then((res) => {
      if (!!res) {
        setSendRecordList(res)
      }
    })
  }

  const onDeleteMessageJob = (id: string) => {
    console.log(id)
    PostMessagejobDelete({ MessageJobId: id })
      .then((res) => {
        console.log("删除成功")
        getMessageJob()
      })
      .catch((err) => {
        throw Error(err)
      })
  }

  const sendRecord = useMemo(() => {
    const sendRecordArray: ISendRecordDto[] = []
    if (sendRecordList.length > 0) {
      sendRecordList.forEach((item) => {
        sendRecordArray.push({
          id: item.id,
          createdDate: item.createdDate,
          correlationId: item.correlationId,
          result: item.result,
          sendTheObject: clickSendRecordItemUsers,
          errorSendtheobject:
            JSON.parse(item.responseJson).invaliduser !== null
              ? JSON.parse(item.responseJson).invaliduser
              : [],
        })
      })
    }
    return sendRecordArray
  }, [sendRecordList, clickSendRecordItemUsers])

  return {
    noticeSettingRef,
    sendRecordRef,
    sendRecord,
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    onDeleteMessageJob,
  }
}
