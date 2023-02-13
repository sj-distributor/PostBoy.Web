import {
  ILastShowTableData,
  ISendMessageCommand,
  IUpdateMessageCommand,
} from "../../../../dtos/enterprise"

export interface SelectContentProps {
  getSendData?: React.Dispatch<
    React.SetStateAction<ISendMessageCommand | undefined>
  >
  getUpdateData?: React.Dispatch<
    React.SetStateAction<IUpdateMessageCommand | undefined>
  >
  updateMessageJobInformation?: ILastShowTableData
  isNewOrUpdate: string
  setWhetherToCallAPI: React.Dispatch<React.SetStateAction<boolean>>
}

export interface SelectContentHookProps {
  getSendData?: React.Dispatch<
    React.SetStateAction<ISendMessageCommand | undefined>
  >
  getUpdateData?: React.Dispatch<
    React.SetStateAction<IUpdateMessageCommand | undefined>
  >
  updateMessageJobInformation?: ILastShowTableData
  isNewOrUpdate: string
  setWhetherToCallAPI: React.Dispatch<React.SetStateAction<boolean>>
}
