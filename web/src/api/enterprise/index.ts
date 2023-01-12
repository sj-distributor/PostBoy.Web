import {
  ICorpsData,
  ICorpAppListApiData,
  ICorpAppData
} from "../../dtos/enterprise";
import { Get, Post } from "../http-client";

export const GetcCorpsList = async () => {
  return await Get<ICorpsData[]>("/api/WeChat/work/corps");
};

export const GetCorpAppList = async (params: ICorpAppListApiData) => {
  return await Get<ICorpAppData[]>(
    "/api/WeChat/work/corp/apps?CorpId=" + params.CorpId
  );
};
