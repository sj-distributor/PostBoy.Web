import {
  ILastShowTableData,
  IUpdateMessageCommand,
} from "../../../../dtos/enterprise"

export interface NoticeSettingProps {
  updateMessageJobInformation: ILastShowTableData
  onNoticeCancel: () => void
  onUpdateMessageJob: (data: IUpdateMessageCommand) => void
}

export interface NoticeSettingHookProps {
  onUpdateMessageJob: (data: IUpdateMessageCommand) => void
}
