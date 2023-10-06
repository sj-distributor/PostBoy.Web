import {
  ICorpData,
  ICorpAppListApiData,
  ICorpAppData,
  IDepartmentListApiData,
  IDepartmentUsersListApiData,
  IDepartmentResponse,
  IDepartmentUsersResonse,
  ITagsListResponse,
  IMessageJobRecord,
  IMessageJobDto,
  ISendMessageCommand,
  MessageJobDestination,
  IUpdateMessageCommand,
  IWorkCorpAppGroup,
  IWorkGroupCreate,
  IGetDeptAndUsersResponse,
  ICreateGroupResonse,
  UploadAttachmentResponseData,
  IGroupUserResponse,
  IGroupDetailResponse,
  WorkWeChatTreeStructureType,
} from "../../dtos/enterprise";
import { Get, Post } from "../http-client";

export const GetCorpsList = async () => {
  return await Get<ICorpData[]>("/api/WeChat/work/corps");
};

export const GetCorpAppList = async (params: ICorpAppListApiData) => {
  return await Get<ICorpAppData[]>(
    `/api/WeChat/work/corp/apps?CorpId=${params.CorpId}`
  );
};

export const GetDepartmentList = async (params: IDepartmentListApiData) => {
  return await Get<IDepartmentResponse>(
    `/api/WeChat/work/departments?AppId=${params.AppId}${
      !!params.Id ? `&Id=${params.Id}` : ``
    }`
  );
};

export const GetDepartmentUsersList = async (
  params: IDepartmentUsersListApiData
) => {
  return await Get<IDepartmentUsersResonse>(
    `/api/WeChat/work/department/users?DepartmentId=${params.DepartmentId}&AppId=${params.AppId}`
  );
};

export const GetTagsList = async (params: { AppId: string }) => {
  return await Get<ITagsListResponse>(
    `/api/WeChat/work/tags?AppId=${params.AppId}`
  );
};

export const GetMessageJob = async (
  pageIndex: number,
  pageSize: number,
  destination: MessageJobDestination
) => {
  return await Get<IMessageJobDto>(
    `/api/Message/jobs?PageIndex=${pageIndex}&PageSize=${pageSize}&Destination=${destination}`
  );
};

export const GetMessageJobRecords = async (correlationId: string) => {
  return await Get<IMessageJobRecord[]>(
    `/api/Message/job/records?CorrelationId=${correlationId}`
  );
};

export const PostMessageSend = async (data: ISendMessageCommand) => {
  return await Post(`/api/Message/send`, data);
};

export const PostMessageJobDelete = async (data: { MessageJobId: string }) => {
  return await Post(`/api/Message/job/delete`, data);
};

export const PostMessageJobUpdate = async (data: IUpdateMessageCommand) => {
  return await Post(`/api/Message/job/update`, data);
};

export const PostWeChatWorkGroupCreate = async (data: IWorkGroupCreate) => {
  return await Post<ICreateGroupResonse>(`/api/WeChat/work/group/create`, data);
};

export const GetWeChatWorkCorpAppGroups = async (
  corpApplicationId: string,
  page = 1,
  pageSize = 15,
  keyword?: string
) => {
  return await Get<IWorkCorpAppGroup[]>(
    `/api/WeChat/work/corp/app/groups?corpApplicationId=${corpApplicationId}&pageIndex=${page}&pageSize=${pageSize}&Keyword=${
      keyword ?? ""
    }`
  );
};

export const GetDeptTreeList = async (
  AppId: string,
  WorkWechatTreeStructureType: WorkWeChatTreeStructureType
) => {
  return await Get<IGetDeptAndUsersResponse>(
    `/api/WeChat/work/depts/users/tree?AppId=${AppId}&WorkWechatTreeStructureType=${WorkWechatTreeStructureType}`
  );
};

export const PostAttachmentUpload = async (data: FormData) => {
  return await Post<UploadAttachmentResponseData>(
    "/api/Attachment/upload",
    data
  );
};

export const GetGroupDetail = async (AppId: string, ChatId: string) => {
  return await Get<IGroupDetailResponse>(
    `/api/Wechat/work/group?AppId=${AppId}&ChatId=${ChatId}`
  );
};

export const GetGroupUsersDetail = async (data: {
  appId: string;
  userIds: string[];
}) => {
  return await Post<IGroupUserResponse[]>("/api/Wechat/work/users", data);
};
