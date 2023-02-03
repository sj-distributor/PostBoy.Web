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
} from "../../dtos/enterprise"
import { Get, Post } from "../http-client"

export const GetCorpsList = async () => {
  return await Get<ICorpData[]>("/api/WeChat/work/corps")
}

export const GetCorpAppList = async (params: ICorpAppListApiData) => {
  return await Get<ICorpAppData[]>(
    `/api/WeChat/work/corp/apps?CorpId=${params.CorpId}`
  )
}

export const GetDepartmentList = async (params: IDepartmentListApiData) => {
  return await Get<IDepartmentResponse>(
    `/api/WeChat/work/departments?AppId=${params.AppId}${
      !!params.Id ? `&Id=${params.Id}` : ``
    }`
  )
}

export const GetDepartmentUsersList = async (
  params: IDepartmentUsersListApiData
) => {
  return await Get<IDepartmentUsersResonse>(
    `/api/WeChat/work/department/users?DepartmentId=${params.DepartmentId}&AppId=${params.AppId}`
  )
}

export const GetTagsList = async (params: { AppId: string }) => {
  return await Get<ITagsListResponse>(
    `/api/WeChat/work/tags?AppId=${params.AppId}`
  )
}

export const GetMessageJob = async (
  pageIndex: number,
  pageSize: number,
  destination: number
) => {
  return await Get<IMessageJobDto>(
    `/api/Message/jobs?PageIndex=${pageIndex}&PageSize=${pageSize}&Destination=${destination}`
  )
}

export const GetMessageJobRecords = async (correlationId: string) => {
  return await Get<IMessageJobRecord[]>(
    `/api/Message/job/records?CorrelationId=${correlationId}`
  )
}

export const PostMessageSend = async (data: ISendMessageCommand) => {
  return await Post<any>(`/api/Message/send`, data)
}

export const PostMessagejobDelete = async (data: { MessageJobId: string }) => {
  return await Post(`/api/Message/job/delete`, data)
}
