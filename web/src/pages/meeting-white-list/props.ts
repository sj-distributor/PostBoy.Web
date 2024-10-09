export interface IAddEditWhiteListDto {
  MeetingCode: string;
  NotifyUserId: string;
  type: "add" | "edit";
  Id: string;
}

export interface IWhiteListsRequest {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  keyword: string;
}
