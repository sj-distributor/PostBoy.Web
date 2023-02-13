import { Actions } from "ahooks/lib/useBoolean"
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
  setWhetherToCallAPI: Actions
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
  setWhetherToCallAPI: Actions
}
