import {
  ICorpData,
  ICorpAppListApiData,
  ICorpAppData,
  IDepartmentListApiData,
  IDepartmentUsersListApiData,
  IDepartmentResponse,
  IDepartmentUsersResonse,
  ITagsListResponse,
  ISendMsgData,
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

export const SendMessage = async (data: ISendMsgData) => {
  return await Post("/api/Message/send", data)
}
