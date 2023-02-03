import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { GetMessageJobRecords } from "../../api/enterprise";
import { IMessageJobDto } from "../../dtos/enterprise";
import { ModalBoxRef } from "../../dtos/modal";

export const useAction = (rowList: IMessageJobDto[]) => {
  const [rowListChange, setRowListChange] = useState<any[]>();
  const noticeSettingRef = useRef<ModalBoxRef>(null);
  const sendRecordRef = useRef<ModalBoxRef>(null);
  const [settingId, setSettingId] = useState<any>();
  const [list, setList] = useState<any>();

  const onNoticeCancel = () => {
    noticeSettingRef.current?.close();
  };

  const onSendCancel = () => {
    sendRecordRef.current?.close();
  };

  const onConfirm = () => {
    alert("click");
  };

  const onSetting = (item: any) => {
    noticeSettingRef.current?.open();
  };

  const onSend = (item: any) => {
    sendRecordRef.current?.open();
    GetMessageJobRecords(item.correlationId).then((res) => {
      setList(res);
      console.log("res", res);
    });
  };

  useEffect(() => {
    const newList: any[] = [];
    rowList?.forEach((item) => {
      newList.push({
        id: 13,
        title: item.messageJobs[0].metadata[0].key,
        content: item.messageJobs[0].metadata[0].value,
        cycle: item.messageJobs[0].jobSettingJson,
        createTime: moment
          .utc(item.messageJobs[0].createdDate)
          .local()
          .format("YYYY-MM-DD HH:mm"),
      });
    });
    !!newList && setRowListChange(newList);
  }, [rowList]);

  return {
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    noticeSettingRef,
    sendRecordRef,
    rowListChange,
    settingId,
    list,
  };
};
