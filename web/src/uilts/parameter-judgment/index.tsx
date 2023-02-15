import {
  ISendMessageCommand,
  IUpdateMessageCommand,
  MessageDataFileType,
} from "../../dtos/enterprise"

export const parameterJudgment = (
  data: ISendMessageCommand | IUpdateMessageCommand | undefined,
  showErrorPrompt: (text: string) => void
) => {
  if (!!data) {
    if (
      data.jobSetting !== undefined &&
      data.jobSetting.delayedJob !== undefined &&
      !data.jobSetting.delayedJob.enqueueAt
    ) {
      showErrorPrompt("Please select delivery time!")
    } else if (
      data.jobSetting !== undefined &&
      data.jobSetting.recurringJob !== undefined &&
      Array.from(data.jobSetting.recurringJob.cronExpression.trim()).length ===
        5
    ) {
      showErrorPrompt("Please select the sending period!")
    } else if (
      data.workWeChatAppNotification.toTags === undefined &&
      data.workWeChatAppNotification.toUsers === undefined &&
      data.workWeChatAppNotification.toParties === undefined
    ) {
      showErrorPrompt("Please select an object to send!")
    } else if (
      data.workWeChatAppNotification.text === undefined &&
      data.workWeChatAppNotification.mpNews === undefined &&
      data.workWeChatAppNotification.file === undefined
    ) {
      showErrorPrompt("Please fill in the sending information!")
    } else if (!data.metadata.find((x) => x.key === "title")?.value) {
      showErrorPrompt("Please fill in the title!")
    } else if (
      data.workWeChatAppNotification.text !== undefined &&
      !data.workWeChatAppNotification.text.content
    ) {
      showErrorPrompt("Please fill in the sending text!")
    } else if (
      data.workWeChatAppNotification !== undefined &&
      data.workWeChatAppNotification.mpNews !== undefined &&
      data.workWeChatAppNotification.mpNews.articles.length <= 0
    ) {
      showErrorPrompt("Please fill in the graphic information!")
    } else if (
      data.workWeChatAppNotification !== undefined &&
      data.workWeChatAppNotification.file !== undefined &&
      data.workWeChatAppNotification.file.fileName.length <= 0 &&
      data.workWeChatAppNotification.file.fileType !== MessageDataFileType.Text
    ) {
      showErrorPrompt("Please upload the files to be sent!")
    } else {
      return true
    }
  } else {
    return false
  }
}
