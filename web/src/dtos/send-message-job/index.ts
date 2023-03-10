import {
  IMessageTypeData,
  MessageDataFileType,
  MessageJobSendType,
  SendTypeCustomListDto,
  TimeType,
  TimeZoneCustomListDto,
} from "../enterprise"

export const messageTypeList: IMessageTypeData[] = [
  { title: "文本", groupBy: "", type: MessageDataFileType.Text },
  { title: "图文", groupBy: "", type: MessageDataFileType.Image },
  { title: "图片", groupBy: "文件", type: MessageDataFileType.Image },
  { title: "语音", groupBy: "文件", type: MessageDataFileType.Voice },
  { title: "视频", groupBy: "文件", type: MessageDataFileType.Video },
  { title: "文件", groupBy: "文件", type: MessageDataFileType.File },
]

export const sendTypeList: SendTypeCustomListDto[] = [
  { title: "即时发送", value: MessageJobSendType.Fire },
  { title: "指定日期", value: MessageJobSendType.Delayed },
  { title: "周期发送", value: MessageJobSendType.Recurring },
]

export const timeZone: TimeZoneCustomListDto[] = [
  { title: "UTC", value: TimeType.UTC, disable: true },
  { title: "PST", value: TimeType.America, disable: false },
]
