import {
  IManagerAppData,
  IManagerCorpData,
  IRequestAppAdd,
  IRequestCorpAdd,
  ISecretData,
  ISecretRequset,
} from "../../dtos/app-manager";
import { Post } from "../http-client";

export const AddCorp = async (data: IRequestCorpAdd[]) => {
  return await Post<IManagerCorpData[]>("/api/Wechat/work/corps/add", {
    addWorkWeChatCorps: data,
  });
};

export const AddApplication = async (data: IRequestAppAdd[]) => {
  return await Post<IManagerAppData[]>("/api/Wechat/work/corp/apps/add", {
    addWorkWeChatCorpApplications: data,
  });
};

export const ModifyCorp = async (data: IManagerCorpData[]) => {
  return await Post("/api/Wechat/work/corps/update", {
    updateWorkWeChatCorps: data,
  });
};

export const ModifyApplication = async (data: IManagerAppData[]) => {
  return await Post("/api/Wechat/work/corp/apps/update", {
    updateWorkWeChatCorpApplications: data,
  });
};

export const PostSecretData = async (data: ISecretRequset) => {
  return await Post<ISecretData[]>("/api/Wechat/work/secrets", data);
};
