import {
  IGetWhiteListsRequest,
  IIWhiteListsDto,
  IPostAddWhiteListsRequest,
  IPostUpdateWhiteListsRequest,
  IWhiteListsResponse,
} from "../../dtos/white-list";
import { Get, Post } from "../http-client";

import queryString from "query-string";

export const GetWhiteLists = async (data: IGetWhiteListsRequest) => {
  const res = queryString.stringify(data);
  return await Get<IWhiteListsResponse>(
    `/api/WeChat/work/meeting/whitelists?${res}`
  );
};

export const PostAddWhiteList = async (data: IPostAddWhiteListsRequest) => {
  return await Post<IIWhiteListsDto>(
    "/api/WeChat/work/meeting/whitelist/add",
    data
  );
};

export const PostUpdateWhiteList = async (
  data: IPostUpdateWhiteListsRequest
) => {
  return await Post<IIWhiteListsDto>(
    "/api/WeChat/work/meeting/whitelist/update",
    data
  );
};

export const PostDeleteWhiteList = async (id: string) => {
  return await Post("/api/WeChat/work/meeting/whitelist/delete", { Ids: [id] });
};
