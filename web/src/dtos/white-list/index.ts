export interface IGetWhiteListsRequest {
  PageIndex: number;
  PageSize: number;
  MeetingCode?: string;
  NotifyUserId?: string;
  KeyWord?: string;
}

export interface IIWhiteListsDto {
  id: string;
  meetingCode: string;
  notifyUserId: string;
  createdDate: string;
}

export interface IWhiteListsResponse {
  whitelist: IIWhiteListsDto[];
  count: number;
}

export interface IPostAddWhiteListsRequest {
  MeetingCode: string;
  NotifyUserId: string;
}

export interface IPostUpdateWhiteListsRequest
  extends IPostAddWhiteListsRequest {
  Id?: string;
}
