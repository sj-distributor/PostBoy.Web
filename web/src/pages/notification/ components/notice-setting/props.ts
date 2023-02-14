import {
  ILastShowTableData,
  IUpdateMessageCommand,
} from "../../../../dtos/enterprise"

export interface NoticeSettingProps {
  updateMessageJobInformation: ILastShowTableData
  onNoticeCancel: () => void
  onUpdateMessageJob: (data: IUpdateMessageCommand) => void
  showErrorPrompt: (text: string) => void
}

export interface NoticeSettingHookProps {
  onUpdateMessageJob: (data: IUpdateMessageCommand) => void
}
