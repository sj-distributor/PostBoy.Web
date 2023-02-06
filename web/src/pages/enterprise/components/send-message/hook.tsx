import { flatten } from "ramda"
import { useEffect, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetMessageJob,
  GetTagsList,
} from "../../../../api/enterprise"
import {
  FileDto,
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDtoExtend,
  IJobSettingDto,
  ILastShowTableData,
  IMessageJob,
  IMessageTypeData,
  ISendMessageCommand,
  ITagsList,
  ITargetDialogValue,
  IWorkWeChatAppNotificationDto,
  MessageDataType,
  MessageWidgetShowStatus,
  SendType,
  SendTypeCustomListDto,
  TextDto,
  TimeType,
  TimeZoneCustomListDto,
} from "../../../../dtos/enterprise"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { useBoolean } from "ahooks"

// 转换数组类型返回
const messageJobConvertType = (arr: IMessageJob[]) => {
  const array: ILastShowTableData[] = []
  if (arr.length > 0) {
    arr.forEach((item) =>
      array.push({
        id: item.id,
        jobId: item.jobId,
        createdDate: item.createdDate,
        correlationId: item.correlationId,
        userAccountId: item.userAccountId,
        commandJson: item.commandJson,
        jobType: item.jobType,
        jobSettingJson: item.jobSettingJson,
        // 待定
        cronExpressionDescriptor: item.cronExpressionDescriptor,
        // ----------------

        destination: item.destination,
        title: item.metadata.filter((item) => item.key === "title")[0]?.value,
        content: item.metadata.filter((item) => item.key === "content")[0]
          ?.value,
        toUsers: item.metadata.filter((item) => item.key === "to")[0]?.value,
      })
    )
  }
  return array
}

const useAction = () => {
  const sendTypeList: SendTypeCustomListDto[] = [
    { title: "即时发送", value: SendType.InstantSend },
    { title: "指定日期", value: SendType.SpecifiedDate },
    { title: "周期发送", value: SendType.SendPeriodically },
  ]

  const timeZone: TimeZoneCustomListDto[] = [
    { title: "UTC", value: TimeType.UTC },
    { title: "America/Los_Angeles", value: TimeType.America },
  ]

  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "文件", groupBy: "文件", type: MessageDataType.File },
  ]

  const [messageParams, setMessageParams] = useState<string>("")
  const [titleParams, setTitleParams] = useState<string>("")

  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  )

  const [tagsValue, setTagsValue] = useState<ITagsList>()

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll)
  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()
  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])

  const [cronExp, setCronExp] = useState<string>("0 0 * * *") //mark 初始值应该为null
  const [cronError, setCronError] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [dateValue, setDateValue] = useState<string>()
  const [sendTypeValue, setSendTypeValue] = useState<number>(
    sendTypeList[0].value
  )
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  const [selectUserList, setSelectUserList] = useState<string[]>([])
  const [selectPartiesList, setSelectPartiesList] = useState<string[]>([])
  const [fileList, setFileList] = useState<FileDto>()
  const [openError, openErrorAction] = useBoolean(false)
  const [openSuccess, openSuccessAction] = useBoolean(false)
  setTimeout(() => {
    openErrorAction.setFalse()
    openSuccessAction.setFalse()
  }, 4000)

  const handleSubmit = (sendType: SendType, correlationId?: string) => {
    console.log("selectUserList", selectUserList)
    if (selectUserList) {
      openErrorAction.setTrue()
    } else {
      let workWeChatAppNotification: IWorkWeChatAppNotificationDto = {
        appId: "c1sAspdXz3ok",
        toUsers: selectUserList,
      }

      let text: TextDto = {
        content: messageParams,
      }

      const data: ISendMessageCommand = {
        correlationId: uuidv4(),
        metadata: [
          {
            key: "title",
            value: titleParams,
          },
          {
            key: "content",
            value: messageParams,
          },
          {
            key: "to",
            value: `${!!selectUserList && selectUserList}${
              !!selectPartiesList && selectPartiesList
            }`,
          },
        ],
        workWeChatAppNotification,
      }

      if (messageTypeValue.type === MessageDataType.Text) {
        // 文字
        const timezone = timeZone[timeZoneValue].title
        let jobSetting: IJobSettingDto = {
          timezone,
        }
        if (sendType === SendType.SpecifiedDate) {
          jobSetting.delayedJob = {
            enqueueAt: moment(dateValue).toDate(),
          }
        } else if (sendType === SendType.SendPeriodically) {
          jobSetting.recurringJob = {
            cronExpression: `0 ${cronExp}`,
          }
        }
        data.jobSetting = jobSetting
        workWeChatAppNotification.text = text
      } else if (messageTypeValue.type === MessageDataType.Image) {
        // 图文
        if (messageTypeValue.groupBy === "") {
          workWeChatAppNotification.mpNews = {
            articles: [
              {
                title: titleParams,
                author: "string",
                digest: "string", //图文消息的描述
                content: messageParams, //图文消息的内容
                fileContent: "string", //图文消息缩略图的BASE64
                contentSourceUrl: "string", //图文消息点击“阅读原文”之后的页面链接
              },
            ],
          }
        }
        // 文件
        workWeChatAppNotification.file = fileList
      }
      data.workWeChatAppNotification = workWeChatAppNotification

      console.log("send", data)
      openSuccessAction.setTrue()

      // PostMessageSend(data)
      //   .then((res) => openSuccessAction.setTrue())
      //   .catch((error) => console.log("error1", error.message))
    }
  }

  const onUploadFile = async (files: FileList) => {
    const file = files[0]
    const base64 = await convertBase64(file)
    setFileList({
      fileName: file.name,
      fileContent: base64 as string,
      fileType: messageTypeValue.type,
    })
  }

  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        setCorpsList(data)
        setCorpsValue(data[0])
      }
    })
  }, [])

  useEffect(() => {
    corpsValue &&
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        if (corpAppResult) {
          setCorpAppList(corpAppResult)
          setCorpAppValue(corpAppResult[0])
          GetTagsList({ AppId: corpAppResult[0].appId }).then((tagsData) => {
            tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist)
          })
        }
      })
  }, [corpsValue?.id])

  useEffect(() => {
    const loadDeptUsers = async (AppId: string) => {
      setDepartmentList([])
      const deptListResponse = await GetDepartmentList({ AppId })
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        for (const department of deptListResponse.department) {
          const userList = await GetDepartmentUsersList({
            AppId,
            DepartmentId: department.id,
          })
          if (!!userList && userList.errcode === 0) {
            setDepartmentList((prev) => {
              const newValue = prev.filter((e) => !!e)
              newValue.push({
                ...department,
                departmentUserList: userList.userlist.map((e) => {
                  e.selected = false
                  return e
                }),
                selected: false,
              })
              return newValue
            })
            setFlattenDepartmentList((prev) => {
              return [
                ...prev,
                ...flatten(userList.userlist).map((item) => ({
                  id: item.userid,
                  name: item.name,
                  parentid: department.name,
                })),
              ]
            })

            deptListResponse.department[
              deptListResponse.department.length - 1
            ] === department && setIsTreeViewLoading(false)
          }
        }
        // 选择的群组
        setSelectPartiesList(
          deptListResponse.department
            .filter((x) => x.selected === true)
            .map((item) => item.name)
        )
        // 选择的用户
        deptListResponse?.department?.forEach((item) => {
          const useridList: string[] = []
          item?.departmentUserList?.forEach((item) => {
            if (item.selected === true) {
              useridList.push(item.userid)
            }
          })
          setSelectUserList(useridList)
        })
      }
    }
    if (!!corpAppValue) {
      setIsTreeViewLoading(true)
      loadDeptUsers(corpAppValue.appId)
    }
  }, [corpAppValue])

  const setDialogValue = { deptAndUserValueList: departmentList, tagsValue }

  const getDialogValue = (dialogData: ITargetDialogValue) => {
    setDepartmentList(dialogData.deptAndUserValueList)
    setTagsValue(dialogData.tagsValue)
  }

  useEffect(() => {
    messageTypeValue.type === MessageDataType.Image && !messageTypeValue.groupBy
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowAll)
      : messageTypeValue.type === MessageDataType.Text
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowInput)
      : (() => {
          setIsShowInputOrUpload(MessageWidgetShowStatus.ShowUpload)
          setMessageParams("")
        })()
  }, [messageTypeValue])

  // 获取MessageJob 数组
  const getMessageJob = () => {
    updateData("loading", true)
    GetMessageJob(dto.page + 1, dto.pageSize, 0)
      .then((res) => {
        if (!!res) {
          setTimeout(() => {
            updateData("rowCount", res.count)
            updateData("messageJobs", messageJobConvertType(res.messageJobs))
            updateData("loading", false)
          }, 100)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          updateData("rowCount", 0)
          updateData("messageJobs", [])
          updateData("loading", false)
        }, 100)
      })
  }

  const [dto, setDto] = useState<IDtoExtend>({
    loading: true,
    messageJobs: [],
    rowCount: 0,
    pageSize: 10,
    page: 0,
  })

  useEffect(() => {
    if (
      sendTypeValue === SendType.SendPeriodically ||
      sendTypeValue === SendType.SpecifiedDate
    )
      getMessageJob()
  }, [dto.page, dto.pageSize, sendTypeValue])

  // 更新MessageJob table参数
  const updateData = (k: keyof IDtoExtend, v: any) => {
    setDto((prev) => ({ ...prev, [k]: v }))
  }

  return {
    corpsList,
    corpAppList,
    corpsValue,
    corpAppValue,
    messageTypeList,
    messageParams,
    messageTypeValue,
    isShowDialog,
    isShowInputOrUpload,
    setDialogValue,
    isShowMessageParams,
    departmentList,
    isTreeViewLoading,
    tagsList,
    flattenDepartmentList,
    sendTypeList,
    sendTypeValue,
    cronExp,
    isAdmin,
    dateValue,
    timeZone,
    timeZoneValue,
    titleParams,
    dto,
    openError,
    openSuccess,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    getDialogValue,
    setIsShowMessageParams,
    setSendTypeValue,
    setCronExp,
    setCronError,
    setDateValue,
    setTimeZoneValue,
    setTitleParams,
    updateData,
    getMessageJob,
    onUploadFile,
  }
}

export default useAction
