export interface ICorpsData {
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

export interface IMessageType {
  title: string;
  groupBy: string;
  type: MessageType;
}

export enum MessageType {
  Text,
  ImageText,
  Audio,
  Image
}
