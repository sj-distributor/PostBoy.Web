import { flatten, isEmpty } from "ramda"
import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetMessageJob,
  GetTagsList,
  PostMessageSend,
} from "../../../../api/enterprise"
import {
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IMessageTypeData,
  ITagsList,
  MessageDataType,
  MessageWidgetShowStatus,
  IDtoExtend,
  IJobSettingDto,
  ILastShowTableData,
  IMessageJob,
  FileDto,
  ISendMessageCommand,
  IWorkWeChatAppNotificationDto,
  SendType,
  SendTypeCustomListDto,
  TimeType,
  TimeZoneCustomListDto,
  ITargetDialogValue,
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
  const [dto, setDto] = useState<IDtoExtend>({
    loading: true,
    messageJobs: [],
    rowCount: 0,
    pageSize: 10,
    page: 0,
  })

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

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll)
  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)
  const [isShowParameterOrTable, setIsShowParameterOrTable] =
    useState<boolean>(false)

  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()
  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([])
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([])
  const [departmentPage, setDepartmentPage] = useState(0)

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  const [cronExp, setCronExp] = useState<string>("0 0 * * *") //mark 初始值应该为null
  const [cronError, setCronError] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [dateValue, setDateValue] = useState<string>()
  const [sendTypeValue, setSendTypeValue] = useState<number>(
    sendTypeList[0].value
  )
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  const [fileList, setFileList] = useState<FileDto>()
  const [openError, openErrorAction] = useBoolean(false)
  const [openSuccess, openSuccessAction] = useBoolean(false)
  setTimeout(() => {
    openErrorAction.setFalse()
    openSuccessAction.setFalse()
  }, 4000)

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result as IDepartmentKeyControl
  }, [departmentAndUserList])

  const onScrolling = (
    scrollHeight: number,
    scrollTop: number,
    clientHeight: number
  ) => {
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      setDepartmentPage((prev) =>
        prev + 10 >= departmentList.length ? departmentList.length : prev + 10
      )
    }
  }

  const loadDeptUsers = async (
    departmentPage: number,
    AppId: string,
    deptListResponse: IDepartmentData[]
  ) => {
    const limit =
      departmentPage + 10 >= deptListResponse.length
        ? deptListResponse.length
        : departmentPage + 10

    for (let index = departmentPage; index < limit; index++) {
      const department = deptListResponse[index]
      const userList = await GetDepartmentUsersList({
        AppId,
        DepartmentId: department.id,
      })
      if (!!userList && userList.errcode === 0) {
        setDepartmentAndUserList((prev) => {
          let newValue = prev.filter((e) => !!e)
          const hasData = newValue.find((e) => e.key === AppId)
          const insertNewData = {
            ...department,
            departmentUserList: userList.userlist.map((e) => ({
              ...e,
              selected: false,
            })),
            selected: false,
          }
          hasData
            ? hasData.data.push(insertNewData)
            : newValue.push({
                key: AppId,
                data: [insertNewData],
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
        index === limit - 1 && setIsTreeViewLoading(false)
      }
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

  const handleSubmit = async (sendType: number) => {
    let toUsers: string[] = []
    const toParties = departmentKeyValue.data
      .filter((e) => e.selected)
      .map((e) => String(e.id))
    departmentKeyValue.data.forEach((department) => {
      toUsers = toUsers.concat(
        department.departmentUserList
          .filter((user) => user.selected)
          .map((e) => e.userid)
      )
    })

    if (isEmpty(toUsers)) {
      openErrorAction.setTrue()
    } else {
      let workWeChatAppNotification: IWorkWeChatAppNotificationDto = {
        appId: corpAppValue?.appId,
        toUsers,
      }

      if (!isEmpty(tagsValue)) {
        workWeChatAppNotification.toTags = tagsValue.map((e) => String(e.tagId))
      } else if (toParties) {
        workWeChatAppNotification.toParties = toParties
      }

      messageTypeValue.type === MessageDataType.Image &&
      !messageTypeValue.groupBy
        ? (workWeChatAppNotification.mpNews = {
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
          })
        : messageTypeValue.type === MessageDataType.Text
        ? (workWeChatAppNotification.text = {
            content: messageParams,
          })
        : (workWeChatAppNotification.file = fileList)

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
            value: `${!!toUsers && toUsers}${!!toParties && toParties}`,
          },
        ],
        workWeChatAppNotification,
      }

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

      console.log("send", data)
      openSuccessAction.setTrue()

      // PostMessageSend(data)
      //   .then((res) => openSuccessAction.setTrue())
      //   .catch((error) => console.log("error1", error.message))
    }
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
    setDepartmentAndUserList([])
    setFlattenDepartmentList([])
    setDepartmentPage(0)
    const loadDepartment = async (AppId: string) => {
      const deptListResponse = await GetDepartmentList({ AppId })
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        setDepartmentList(deptListResponse.department)
        loadDeptUsers(0, AppId, deptListResponse.department)
      }
    }
    if (!!corpAppValue) {
      setIsTreeViewLoading(true)
      loadDepartment(corpAppValue.appId)
    }
  }, [corpAppValue])

  const setDialogValue = { deptAndUserValueList: departmentList, tagsValue }

  const getDialogValue = (dialogData: ITargetDialogValue) => {
    setDepartmentList(dialogData.deptAndUserValueList)
    setTagsValue(dialogData.tagsValue)
  }

  useEffect(() => {
    corpAppValue &&
      departmentPage !== 0 &&
      loadDeptUsers(departmentPage, corpAppValue.appId, departmentList)
  }, [departmentPage])

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
          }, 500)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          updateData("rowCount", 0)
          updateData("messageJobs", [])
          updateData("loading", false)
        }, 500)
      })
  }

  useEffect(() => {
    if (isShowParameterOrTable) getMessageJob()
  }, [dto.page, dto.pageSize, , isShowParameterOrTable])

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
    isShowMessageParams,
    departmentAndUserList,
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
    departmentKeyValue,
    setDepartmentAndUserList,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
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
    onScrolling,
    setTagsValue,
    setDialogValue,
    isShowParameterOrTable,
    setIsShowParameterOrTable,
  }
}

export default useAction
