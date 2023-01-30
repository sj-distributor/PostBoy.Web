import { useRef } from "react";
import { ModalBoxRef } from "../../dtos/modal";

export const useAction = () => {
  const noticeSettingRef = useRef<ModalBoxRef>(null);
  const sendRecordRef = useRef<ModalBoxRef>(null);

  const onNoticeCancel = () => {
    noticeSettingRef.current?.close();
  };

  const onSendCancel = () => {
    sendRecordRef.current?.close();
  };

  const onConfirm = () => {
    alert("click");
  };

  const onSetting = () => {
    noticeSettingRef.current?.open();
  };

  const onSend = () => {
    sendRecordRef.current?.open();
  };

  return {
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    noticeSettingRef,
    sendRecordRef,
  };
};
