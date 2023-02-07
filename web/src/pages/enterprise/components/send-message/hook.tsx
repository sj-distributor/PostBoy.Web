import { useEffect, useMemo, useRef, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetMessageJob,
  GetTagsList,
} from "../../../../api/enterprise"
import {
  DepartmentAndUserType,
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IMessageTypeData,
  ISearchList,
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
  MessageJobDestination,
} from "../../../../dtos/enterprise"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { useBoolean } from "ahooks"
import { ModalBoxRef } from "../../../../dtos/modal"
import { clone, flatten, uniqWith, isEmpty } from "ramda"

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
        enterprise: {
          name: item.metadata.filter((item) => item.key === "enterpriseName")[0]
            ?.value,
          id: item.metadata.filter((item) => item.key === "enterpriseId")[0]
            ?.value,
        },
        app: {
          name: item.metadata.filter((item) => item.key === "appName")[0]
            ?.value,
          id: item.metadata.filter((item) => item.key === "appId")[0]?.value,
          appId: item.metadata.filter((item) => item.key === "weChatAppId")[0]
            ?.value,
        },
      })
    )
  }
  return array
}

export const sendTypeList: SendTypeCustomListDto[] = [
  { title: "即时发送", value: SendType.InstantSend },
  { title: "指定日期", value: SendType.SpecifiedDate },
  { title: "周期发送", value: SendType.SendPeriodically },
]

export const timeZone: TimeZoneCustomListDto[] = [
  { title: "UTC", value: TimeType.UTC },
  { title: "America/Los_Angeles", value: TimeType.America },
]

export const messageTypeList: IMessageTypeData[] = [
  { title: "文本", groupBy: "", type: MessageDataType.Text },
  { title: "图文", groupBy: "", type: MessageDataType.Image },
  { title: "图片", groupBy: "文件", type: MessageDataType.Image },
  { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
  { title: "视频", groupBy: "文件", type: MessageDataType.Video },
  { title: "文件", groupBy: "文件", type: MessageDataType.File },
]

const useAction = () => {
  const [dto, setDto] = useState<IDtoExtend>({
    loading: true,
    messageJobs: [],
    rowCount: 0,
    pageSize: 10,
    page: 0,
  })

  const [messageParams, setMessageParams] = useState<string>("")
  const [titleParams, setTitleParams] = useState<string>("")

  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  )

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll)
  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  const [cronExp, setCronExp] = useState<string>("") //mark 初始值应该为null
  const [cronError, setCronError] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [dateValue, setDateValue] = useState<string>("")
  const [sendTypeValue, setSendTypeValue] = useState<number>(
    sendTypeList[0].value
  )
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  const [fileList, setFileList] = useState<FileDto>()
  const [openError, openErrorAction] = useBoolean(false)
  const [openSuccess, openSuccessAction] = useBoolean(false)
  const sendRecordRef = useRef<ModalBoxRef>(null)
  const [promptText, setPromptText] = useState<string>("")
  setTimeout(() => {
    openErrorAction.setFalse()
    openSuccessAction.setFalse()
  }, 3000)

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result as IDepartmentKeyControl
  }, [departmentAndUserList])

  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result?.data as IDepartmentAndUserListValue[]
  }, [flattenDepartmentList])

  const recursiveDeptList = (
    hasData: IDepartmentAndUserListValue[],
    defaultChild: IDepartmentAndUserListValue,
    department: IDepartmentData,
    parentRouteId: number[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      parentRouteId.push(Number(e.id))
      if (e.id === department.parentid) {
        e.children.push(defaultChild)
        return parentRouteId
      }
      if (e.children.length > 0) {
        const idList: number[] = recursiveDeptList(
          e.children,
          defaultChild,
          department,
          [...parentRouteId]
        )
        if (idList.length !== parentRouteId.length) return idList
        parentRouteId.pop()
      } else {
        parentRouteId.pop()
      }
    }
    return parentRouteId
  }

  const loadDeptUsers = async (
    departmentPage: number,
    AppId: string,
    deptListResponse: IDepartmentData[]
  ) => {
    for (let index = departmentPage; index < deptListResponse.length; index++) {
      const department = deptListResponse[index]
      // referIndexList储存从嵌套数组顶部到当前部门的ID路径
      let referIndexList: number[] = []
      const defaultChild = {
        id: department.id,
        name: department.name,
        type: DepartmentAndUserType.Department,
        parentid: String(department.parentid),
        selected: false,
        children: [],
      }
      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev)
        const hasData = newValue.find((e) => e.key === AppId)
        if (hasData && hasData.data.length > 0) {
          // 实现查找parentid等于当前部门id后插入chilrden
          const idList = recursiveDeptList(
            hasData.data,
            defaultChild,
            department,
            []
          )
          referIndexList = referIndexList.concat(idList, [department.id])
        } else {
          referIndexList = referIndexList.concat(department.id)
          newValue.push({ key: AppId, data: [defaultChild] })
        }
        return newValue
      })

      const userList = await GetDepartmentUsersList({
        AppId,
        DepartmentId: department.id,
      })
      if (!!userList && userList.errcode === 0) {
        setDepartmentAndUserList((prev) => {
          const newValue = clone(prev)
          const hasData = newValue.find((e) => e.key === AppId)
          if (hasData) {
            let result: IDepartmentAndUserListValue | undefined
            referIndexList.forEach((number, index) => {
              if (index !== 0) {
                result = result?.children.find((item) => number === item.id)
              } else {
                result = hasData.data.find(
                  (item) => referIndexList[0] === item.id
                )
              }
            })
            if (result)
              result.children = userList.userlist.map((e) => ({
                id: e.userid,
                name: e.name,
                type: DepartmentAndUserType.User,
                parentid: String(department.id),
                selected: false,
                children: [],
              }))
          }
          return newValue
        })
        setFlattenDepartmentList((prev) => {
          const newValue = clone(prev)
          let hasData = newValue.find((e) => e.key === AppId)
          const insertData = [
            {
              id: department.id,
              name: department.name,
              parentid: department.name,
              type: DepartmentAndUserType.Department,
              selected: false,
              children: [],
            },
            ...flatten(
              userList.userlist.map((item) => ({
                id: item.userid,
                name: item.name,
                parentid: department.name,
                type: DepartmentAndUserType.User,
                selected: false,
                children: [],
              }))
            ),
          ]
          if (hasData) {
            hasData.data = [...hasData.data, ...insertData]
          } else {
            newValue.push({
              key: AppId,
              data: insertData,
            })
          }
          return newValue
        })
        index === deptListResponse.length - 1 && setIsTreeViewLoading(false)
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

  const showErrorPrompt = (text: string) => {
    setPromptText(text)
    openErrorAction.setTrue()
  }

  // const handleSubmit = async (sendType: number) => {

  //   if (isEmpty(toUsers)) {
  //     showErrorPrompt("Please choose who to send!")
  //   } else if (sendType === SendType.SpecifiedDate && !dateValue) {
  //     showErrorPrompt("Please select a delivery date!")
  //   } else if (sendType === SendType.SendPeriodically && !cronExp) {
  //     showErrorPrompt("Please select the sending cycle!")
  //   } else {
  //     let workWeChatAppNotification: IWorkWeChatAppNotificationDto = {
  //       appId: corpAppValue?.appId,
  //       toUsers,
  //     }

  //     if (!isEmpty(tagsValue)) {
  //       workWeChatAppNotification.toTags = tagsValue.map((e) => String(e.tagId))
  //     } else if (!isEmpty(toParties)) {
  //       workWeChatAppNotification.toParties = toParties
  //     }

  //     messageTypeValue.type === MessageDataType.Image &&
  //     !messageTypeValue.groupBy
  //       ? (workWeChatAppNotification.mpNews = {
  //           articles: [
  //             {
  //               title: titleParams,
  //               author: "string",
  //               digest: "string", //图文消息的描述
  //               content: messageParams, //图文消息的内容
  //               fileContent: "string", //图文消息缩略图的BASE64
  //               contentSourceUrl: "string", //图文消息点击“阅读原文”之后的页面链接
  //             },
  //           ],
  //         })
  //       : messageTypeValue.type === MessageDataType.Text
  //       ? (workWeChatAppNotification.text = {
  //           content: messageParams,
  //         })
  //       : (workWeChatAppNotification.file = fileList)

  //     const data: ISendMessageCommand = {
  //       correlationId: uuidv4(),
  //       metadata: [
  //         {
  //           key: "title",
  //           value: titleParams,
  //         },
  //         {
  //           key: "content",
  //           value: messageParams,
  //         },
  //         {
  //           key: "to",
  //           value: `${!!toUsers && toUsers}${!!toParties && toParties}`,
  //         },
  //       ],
  //       workWeChatAppNotification,
  //     }

  //     const timezone = timeZone[timeZoneValue].title
  //     let jobSetting: IJobSettingDto = {
  //       timezone,
  //     }
  //     if (sendType === SendType.SpecifiedDate) {
  //       jobSetting.delayedJob = {
  //         enqueueAt: moment(dateValue).toDate(),
  //       }
  //     } else if (sendType === SendType.SendPeriodically) {
  //       jobSetting.recurringJob = {
  //         cronExpression: `0 ${cronExp}`,
  //       }
  //     }
  //     data.jobSetting = jobSetting

  //     console.log("send", data)
  //     openSuccessAction.setTrue()

  //     // PostMessageSend(data)
  //     //   .then((res) => openSuccessAction.setTrue())
  //     //   .catch((error) => console.log("error1", error.message))
  //   }
  // }

  const recursiveGetSelectedList = (
    hasData: IDepartmentAndUserListValue[],
    selectedList: IDepartmentAndUserListValue[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      if (e.selected) {
        selectedList.push(e)
      }
      if (e.children.length > 0) {
        selectedList = recursiveGetSelectedList(e.children, [...selectedList])
      }
    }
    return selectedList
  }

  const handleSubmit = async (sendType: number) => {
    const selectedList = uniqWith(
      (a: IDepartmentAndUserListValue, b: IDepartmentAndUserListValue) => {
        return a.id === b.id
      }
    )(recursiveGetSelectedList(departmentKeyValue.data, []))

    const sendData: IWorkWeChatAppNotificationDto = {
      appId: corpAppValue?.appId,
      toTags: tagsValue.map((e) => String(e.tagId)),
      toUsers: selectedList
        .filter((e) => e.type === DepartmentAndUserType.User)
        .map((e) => String(e.id)),
      toParties: selectedList
        .filter((e) => e.type === DepartmentAndUserType.Department)
        .map((e) => String(e.id)),
    }
    messageTypeValue.type === MessageDataType.Image && !messageTypeValue.groupBy
      ? (sendData.mpNews = {
          articles: [
            {
              title: "",
              author: "",
              digest: "",
              content: "",
              fileContent: "",
              contentSourceUrl: "",
            },
          ],
        })
      : messageTypeValue.type === MessageDataType.Text
      ? (sendData.text = {
          content: "",
        })
      : (sendData.file = {
          fileName: "",
          fileContent: "",
          fileType: messageTypeValue.type,
        })
    // TODO 发送接口
    // const response = await SendMessage(data);

    if (isEmpty(sendData.toUsers)) {
      showErrorPrompt("Please choose who to send!")
    } else if (sendType === SendType.SpecifiedDate && !dateValue) {
      showErrorPrompt("Please select a delivery date!")
    } else if (sendType === SendType.SendPeriodically && !cronExp) {
      showErrorPrompt("Please select the sending cycle!")
    } else {
      let workWeChatAppNotification: IWorkWeChatAppNotificationDto = {
        appId: corpAppValue?.appId,
        toUsers: sendData.toUsers,
      }

      if (!isEmpty(tagsValue)) {
        workWeChatAppNotification.toTags = tagsValue.map((e) => String(e.tagId))
      } else if (!isEmpty(sendData.toParties)) {
        workWeChatAppNotification.toParties = sendData.toParties
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
            value: `${!!sendData.toUsers && sendData.toUsers}${
              !!sendData.toParties && sendData.toParties
            }`,
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
    }
  }

  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        const array: { id: string; corpName: string }[] = []
        data.forEach((item) =>
          array.push({ id: item.id, corpName: item.corpName })
        )
        setCorpsList(array)
        setCorpsValue(array[0])
      }
    })
  }, [])

  useEffect(() => {
    corpsValue &&
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        if (corpAppResult) {
          const array: { id: string; name: string; appId: string }[] = []
          corpAppResult.forEach((item) =>
            array.push({
              id: item.id,
              name: item.name,
              appId: item.appId,
            })
          )

          setCorpAppList(array)
          setCorpAppValue(array[0])
          GetTagsList({ AppId: array[0].appId }).then((tagsData) => {
            tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist)
          })
        }
      })
  }, [corpsValue?.id])

  useEffect(() => {
    setDepartmentAndUserList([])
    setFlattenDepartmentList([])
    const loadDepartment = async (AppId: string) => {
      const deptListResponse = await GetDepartmentList({ AppId })
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        loadDeptUsers(0, AppId, deptListResponse.department)
      }
    }
    if (!!corpAppValue) {
      setIsTreeViewLoading(true)
      loadDepartment(corpAppValue.appId)
    }
  }, [corpAppValue?.appId])

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
    GetMessageJob(dto.page + 1, dto.pageSize, MessageJobDestination.WorkWeChat)
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

  const sendRecordOpen = () => {
    sendRecordRef?.current?.open()
  }

  const sendRecordClose = () => {
    sendRecordRef?.current?.close()
  }

  useEffect(() => {
    getMessageJob()
  }, [dto.page, dto.pageSize])

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
    timeZone,
    timeZoneValue,
    titleParams,
    dto,
    openError,
    openSuccess,
    searchKeyValue,
    departmentKeyValue,
    promptText,
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
    setTagsValue,
    sendRecordRef,
    sendRecordOpen,
    sendRecordClose,
  }
}

export default useAction
