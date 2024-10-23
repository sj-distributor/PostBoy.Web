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

export interface IMeetingGroupsDto {
  meetingCode: string;
  whitelists: IIWhiteListsDto;
}

export interface IWhiteListsResponse {
  groups: IMeetingGroupsDto[];
  count: number;
}

export interface IPostAddOrUpdateWhiteListsRequest {
  meetingCode: string;
  notifyUserIds: string[];
}
