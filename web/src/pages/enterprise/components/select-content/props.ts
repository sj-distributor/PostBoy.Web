import {
  ICorpAppData,
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  IDeptAndUserList,
  ILastShowTableData,
  ISearchList,
  ISendMessageCommand,
  IUpdateMessageCommand,
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
  setIsShowPage?: React.Dispatch<React.SetStateAction<boolean>>
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
  setIsShowPage?: React.Dispatch<React.SetStateAction<boolean>>
  corpAppValue: ICorpAppData
  setCorpAppValue: React.Dispatch<React.SetStateAction<ICorpAppData>>
}

export interface IDeptUserWebWorkerProps {
  AppId: string
  workWeChatUnits: IDeptAndUserList[]
}
