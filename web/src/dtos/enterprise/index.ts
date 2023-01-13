export interface ICorpData {
  corpId: string;
  corpName: string;
  id: string;
}

export interface ICorpAppData {
  agentId: number;
  appId: string;
  id: string;
  name: string;
  secret: string;
  workWeChatCorpId: string;
}

export interface ICorpAppListApiData {
  CorpId: string;
}

export interface IMessageTypeData {
  title: string;
  groupBy: string;
  type: MessageDataType;
}

export enum MessageDataType {
  Image,
  Voice,
  Video,
  File,
  Text
}

export interface ITargetDialogProps {
  open: boolean;
  setDialogValue: ITargetDialogValue;
  setOpenFunction: (open: boolean) => void;
  getDialogValue: (data: ITargetDialogValue) => void;
}

export interface ITargetDialogValue {
  memberValue: string;
  departmentValue: string;
  tagsValue: string;
}

export enum MessageWidgetShowStatus {
  ShowInput,
  ShowUpload,
  ShowAll
}
