import {
  IGetWhiteListsRequest,
  IIWhiteListsDto,
  IPostAddOrUpdateWhiteListsRequest,
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

export const PostAddWhiteList = async (
  data: IPostAddOrUpdateWhiteListsRequest
) => {
  return await Post<IIWhiteListsDto>(
    "/api/WeChat/work/meeting/whitelists/add",
    data
  );
};

export const PostUpdateWhiteList = async (
  data: IPostAddOrUpdateWhiteListsRequest
) => {
  return await Post<IIWhiteListsDto>(
    "/api/WeChat/work/meeting/whitelists/update",
    data
  );
};

export const PostDeleteWhiteList = async (id: string) => {
  return await Post("/api/WeChat/work/meeting/whitelist/delete", {
    meetingCode: id,
  });
};
