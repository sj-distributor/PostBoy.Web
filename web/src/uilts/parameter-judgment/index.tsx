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
    const { jobSetting, metadata, workWeChatAppNotification, ...props } = data
    if (jobSetting && metadata && workWeChatAppNotification) {
      if (
        jobSetting.delayedJob !== undefined &&
        (!jobSetting.delayedJob.enqueueAt ||
          jobSetting.delayedJob.enqueueAt === "")
      ) {
        showErrorPrompt("Please select delivery time!")
      } else if (
        jobSetting.recurringJob !== undefined &&
        Array.from(jobSetting.recurringJob.cronExpression.trim()).length !== 5
      ) {
        showErrorPrompt("Please select the sending period!")
      } else if (
        (!metadata?.find((x) => x.key === "title")?.value &&
          metadata?.find((x) => x.key === "title") === undefined) ||
        (metadata?.find((x) => x.key === "title") !== undefined &&
          metadata?.find((x) => x.key === "title")?.value.length === 0)
      ) {
        showErrorPrompt("Please fill in the title!")
      } else if (
        workWeChatAppNotification.text !== undefined &&
        (workWeChatAppNotification.text.content === "" ||
          workWeChatAppNotification.text.content.length - 4 ===
            metadata?.find((x) => x.key === "title")?.value.length)
      ) {
        showErrorPrompt("Please fill in the sending text!")
      } else if (
        workWeChatAppNotification.file !== undefined &&
        (workWeChatAppNotification.file.fileName.length <= 0 ||
          workWeChatAppNotification.file.fileType === MessageDataFileType.Text)
      ) {
        showErrorPrompt("Please upload the files to be sent!")
      } else if (
        workWeChatAppNotification.mpNews !== undefined &&
        (workWeChatAppNotification.mpNews.articles.length <= 0 ||
          workWeChatAppNotification.mpNews.articles.some(
            (x) =>
              x.content === "<p><br></p>" ||
              x.content === "" ||
              x.content === "<p></p>"
          ) ||
          workWeChatAppNotification.mpNews.articles.some((x) => x.title === ""))
      ) {
        showErrorPrompt("Please fill in the graphic information!")
      } else if (
        (workWeChatAppNotification.toTags === undefined ||
          workWeChatAppNotification.toTags.length <= 0) &&
        (workWeChatAppNotification.toUsers === undefined ||
          workWeChatAppNotification.toUsers.length <= 0) &&
        (workWeChatAppNotification.toParties === undefined ||
          workWeChatAppNotification.toParties.length <= 0) &&
        workWeChatAppNotification.chatId === undefined
      ) {
        showErrorPrompt("Please select an object to send!")
      } else {
        return true
      }
    }
  } else {
    return false
  }
}
