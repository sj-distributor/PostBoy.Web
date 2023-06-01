export interface IOriginCorpData {
  corpId: string
  corpName: string
  contactSecret: string
}

export interface IOriginAppData {
  appId: string
  workWeChatCorpId: string
  name: string
  secret: string
  agentId: number
  display: boolean
}
export interface IManagerCorpData extends IOriginCorpData {
  id: string
  order: number
}

export interface IManagerCorpKeyData {
  data: IManagerCorpData
  key: RowDataType.Corporation
}

export interface IManagerAppData extends IOriginAppData {
  id: string
}

export interface IManagerAppKeyData {
  data: IManagerAppData
  key: RowDataType.Application
}

export interface ISecretData {
  id: string
  secret: string
}

export interface IRequestCorpAdd extends IOriginCorpData {
  id?: string
  order: number
}

export interface IRequestAppAdd extends IOriginAppData {
  id?: string
}

export interface ISecretRequset {
  ids: string[]
  secretType: number
}

export enum RowDataType {
  Corporation,
  Application,
}

export enum AddOrModify {
  Add = "Add",
  Modify = "Modify",
}
