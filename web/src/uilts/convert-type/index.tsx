import { IWorkWeChatAppNotificationDto } from "../../dtos/enterprise"

export const convertType = (data: IWorkWeChatAppNotificationDto) => {
  if (data.file !== undefined) {
    data.file.fileContent = data.file.fileContent?.split("base64,")[1]
  }
  if (data.mpNews !== undefined) {
    data.mpNews.articles = data.mpNews.articles.map((item) => {
      if (item.fileContent !== undefined && item.fileContent !== null) {
        item.fileContent = item.fileContent.split("base64,")[1]
      }
      return item
    })
  }
  return data
}
