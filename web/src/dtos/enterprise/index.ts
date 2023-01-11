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
