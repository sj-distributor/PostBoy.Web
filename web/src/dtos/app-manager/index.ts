export interface ICorpData {
  id: string
  corpId: string
  corpName: string
  contactSecret: string
}

export interface IAppData {
  id: string
  appId: string
  workWeChatCorpId: string
  name: string
  secret: string
  agentId: number
  display: boolean
}

export enum RowDataType {
  Application,
  Corp,
}

export enum RowActionType {
  Add,
  Modify,
}
