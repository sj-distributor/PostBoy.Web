import {
  CancelMeetingResponse,
  CancelWorkWeChatMeetingDto,
  CreateMeetingResponse,
  CreateOrUpdateWorkWeChatMeetingDto,
  GetAllMeetingDto,
  GetAllMeetingResponse,
  UpdateMeetingResponse,
} from "../../dtos/meeting-seetings";
import { Get, Post } from "../http-client";

export const createMeeting = async (data: {
  createWorkWeChatMeeting: CreateOrUpdateWorkWeChatMeetingDto;
}) => {
  return await Post<CreateMeetingResponse>(
    "/api/WeChat/work/meeting/create",
    data
  );
};

export const updateMeeting = async (data: {
  updateWorkWeChatMeeting: CreateOrUpdateWorkWeChatMeetingDto;
}) => {
  return await Post<UpdateMeetingResponse>(
    "/api/WeChat/work/meeting/update",
    data
  );
};

export const getAllMeetingData = async (data: GetAllMeetingDto) => {
  return await Get<GetAllMeetingResponse>(
    `/api/WeChat/work/meetings?PageIndex=${data.PageIndex}&PageSize=${
      data.PageSize
    }${data.KeyWord ? "&KeyWord=" + data.KeyWord : ""}`
  );
};

export const cancelMeeting = async (data: CancelWorkWeChatMeetingDto) => {
  return await Post<CancelMeetingResponse>(
    "/api/WeChat/work/meeting/cancel",
    data
  );
};
