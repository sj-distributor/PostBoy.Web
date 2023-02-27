import {
  ILastShowTableData,
  ISendMessageCommand,
  IUpdateMessageCommand
} from "../../../../dtos/enterprise"

export interface SelectContentProps {
  sendData?: ISendMessageCommand
  getSendData?: React.Dispatch<
    React.SetStateAction<ISendMessageCommand | undefined>
  >
  getUpdateData?: React.Dispatch<
    React.SetStateAction<IUpdateMessageCommand | undefined>
  >
  updateMessageJobInformation?: ILastShowTableData
  isNewOrUpdate: string
  showErrorPrompt: (text: string) => void
  clearData?: boolean
  isFromNoticeSetting?: boolean
}

export interface SelectContentHookProps {
  outerSendData: ISendMessageCommand | undefined
  getSendData?: React.Dispatch<
    React.SetStateAction<ISendMessageCommand | undefined>
  >
  getUpdateData?: React.Dispatch<
    React.SetStateAction<IUpdateMessageCommand | undefined>
  >
  updateMessageJobInformation?: ILastShowTableData
  isNewOrUpdate: string
  showErrorPrompt: (text: string) => void
  clearData?: boolean
}
