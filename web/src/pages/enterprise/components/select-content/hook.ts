import { clone, isEmpty, uniqWith } from "ramda"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDeptsAndUserList,
  GetGroupDetail,
  GetGroupUsersDetail,
  GetTagsList,
  GetWeChatWorkCorpAppGroups,
  PostAttachmentUpload,
} from "../../../../api/enterprise"
import {
  DepartmentAndUserType,
  FileObject,
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IJobSettingDto,
  IMentionList,
  IMessageTypeData,
  ITagsList,
  ITagsListResponse,
  IWorkCorpAppGroup,
  MessageDataFileType,
  MessageJobSendType,
  PictureText,
  SendData,
  SendObject,
  SendObjOrGroup,
  SendParameter,
} from "../../../../dtos/enterprise"
import { messageTypeList, timeZone } from "../../../../dtos/send-message-job"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { SelectContentHookProps } from "./props"
import * as wangEditor from "@wangeditor/editor"
import { annexEditorConfig } from "../../../../uilts/wangEditor"
import { useBoolean } from "ahooks"

type InsertImageFnType = (url: string, alt: string, href: string) => void

export const defaultAppValue = {
  appId: "",
  id: "",
  name: "",
  workWeChatCorpId: "",
  display: true,
  agentId: 0,
}

export const useAction = (props: SelectContentHookProps) => {
  const {
    outerSendData,
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    showErrorPrompt,
    clearData,
    setIsShowPage,
    corpAppValue,
    setCorpAppValue,
    departmentAndUserList,
    flattenDepartmentList,
    departmentKeyValue,
    searchKeyValue,
    setDepartmentAndUserList,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
    loadDeptUsersFromWebWorker,
  } = props

  const defaultCorpValue = {
    corpName: "",
    corpId: "",
    id: "",
  }

  // 拿到的企业对象
  const [corpsValue, setCorpsValue] = useState<ICorpData>(defaultCorpValue)
  // 获取的企业数组
  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  // 获取的App数组
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  // 获取的Tags数组
  const [tagsList, setTagsList] = useState<ITagsList[]>([])
  // 消息类型选择
  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  )
  // 发送类型选择
  const [sendTypeValue, setSendTypeValue] = useState<MessageJobSendType>(
    MessageJobSendType.Fire
  )
  // 时区选择
  const [timeZoneValue, setTimeZoneValue] = useState<number>(
    timeZone.filter((x) => !x.disable)[0].value
  )
  // 弹出选择对象框 boolean
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  // TreeView显示展开
  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  // 发送标签
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])
  // 发送人员
  const [sendObject, setSendObject] = useState<SendObject>({
    toUsers: [],
    toParties: [],
  })
  // 标题
  const [title, setTitle] = useState<string>("")
  // 内容
  const [content, setContent] = useState<string>("")
  // 纯净内容
  const [cleanContent, setCleanContent] = useState<string>("")
  // 推文
  const [pictureText, setPictureText] = useState<PictureText[]>([])
  // 文件
  const [file, setFile] = useState<FileObject>({
    fileContent: "",
    fileName: "",
    fileType: messageTypeValue.type,
  })
  // 发送时间
  const [dateValue, setDateValue] = useState<string>("")
  // 终止时间
  const [endDateValue, setEndDateValue] = useState<string>("")
  // 循环周期
  const [cronExp, setCronExp] = useState<string>("0 0 * * *")
  // 输出周期报错
  const [cronError, setCronError] = useState<string>("")
  //  拉取数据旋转
  const [isLoadStop, setIsLoadStop] = useState<boolean>(false)
  //  jobSetting
  const [jobSetting, setJobSetting] = useState<IJobSettingDto>()
  // workWeChatAppNotification SendParameter
  const [sendParameter, setSendParameter] = useState<SendParameter>()
  // workWeChatAppNotification SendParameter
  const [sendData, setSendData] = useState<SendData>()
  // 判断是否拿到上次用户部门数据
  const [isGetLastTimeData, setIsGetLastTimeData] = useState<boolean>(false)
  // 上次上传的tagsList
  const [lastTimeTagsList, setLastTimeTagsList] = useState<string[]>([])
  // 上次上传的pictureText
  const [lastTimePictureText, setLastTimePictureText] = useState<PictureText[]>(
    []
  )
  // 上次上传的File
  const [lastTimeFile, setLastTimeFile] = useState<FileObject>()
  // 点击的是群组还是发送目标
  const [clickName, setClickName] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null)
  // 群组列表
  const [groupList, setGroupList] = useState<IWorkCorpAppGroup[]>([])
  const [chatId, setChatId] = useState<string>("")
  const [chatName, setChatName] = useState<string>("")

  const [sendType, setSendType] = useState<SendObjOrGroup>(
    SendObjOrGroup.Object
  )

  const [isUpdatedDeptUser, setIsUpdatedDeptUser] = useState(false)

  const [editor, setEditor] = useState<wangEditor.IDomEditor | null>(null)

  const [html, setHtml] = useState("")

  const [htmlText, setHtmlText] = useState("")

  const [isFocusing, focusAction] = useBoolean(false)

  const [mentionList, setMentionList] = useState<IMentionList[]>([])

  const [appLoading, setAppLoading] = useState<boolean>(true)

  const [groupLoading, setGroupLoading] = useState<boolean>(true)

  const editorConfig = {
    placeholder: "请输入内容...",
    autoFocus: false,
    hoverbarKeys: {
      ...annexEditorConfig.hoverbarKeys,
    },
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: InsertImageFnType) {
          if (file.size / 1024 > 20 * 1024) {
            showErrorPrompt("The Image size is too large!")
            return
          }
          const formData = new FormData()
          formData.append("file", file)
          PostAttachmentUpload(formData).then((res) => {
            if (res) insertFn(res?.fileUrl, res.fileName, res.filePath)
          })
        },
      },
    },
  }

  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const selectedShowArr = useMemo(() => {
    const result = []
    const partiesSelected = flattenDepartmentList.find(
      (e) => e.key === corpAppValue?.appId
    )?.data

    const workWeChatAppNotification =
      sendObject ??
      outerSendData?.workWeChatAppNotification ??
      updateMessageJobInformation?.workWeChatAppNotification

    if (sendType === SendObjOrGroup.Object) {
      workWeChatAppNotification?.toParties &&
        partiesSelected &&
        result.push(
          ...partiesSelected
            .filter((e) =>
              workWeChatAppNotification?.toParties?.some(
                (item) => item === String(e.id)
              )
            )
            .map((e) => e.name)
        )

      workWeChatAppNotification?.toUsers &&
        result.push(...workWeChatAppNotification.toUsers)
      tagsValue && result.push(...tagsValue.map((x) => x.tagName))
    } else {
      !!chatId &&
        !!chatName &&
        result.push({
          chatId: chatId,
          chatName: chatName,
        })
    }
    return result
  }, [
    sendObject,
    outerSendData?.workWeChatAppNotification,
    updateMessageJobInformation?.workWeChatAppNotification,
    groupList,
    chatId,
    corpAppValue,
  ])

  // 初始化企业数组
  useEffect(() => {
    GetCorpsList().then((data) => {
      data && setCorpsList(data)
    })
  }, [])

  // 默认选择第一个企业对象
  useEffect(() => {
    isNewOrUpdate === "new" &&
      !corpsValue.corpId &&
      corpsList.length > 0 &&
      setCorpsValue(corpsList[0])
  }, [corpsList])

  // 初始化App数组
  useEffect(() => {
    if (!!corpsValue.id) {
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        setAppLoading(false)
        corpAppResult && setCorpAppList(corpAppResult.filter((x) => x.display))
      })
    }
  }, [corpsValue?.id])

  // 获取Tags数组
  useEffect(() => {
    if (corpAppValue?.appId) {
      GetTagsList({ AppId: corpAppValue.appId }).then(
        (tagsData: ITagsListResponse | null | undefined) => {
          tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist)
        }
      )
      corpAppValue.id &&
        GetWeChatWorkCorpAppGroups(corpAppValue.id).then((data) => {
          setGroupLoading(false)
          data && setGroupList(data)
        })
      if (isNewOrUpdate === "new") {
        // 清空切换应用时的已选值
        setChatId("")
        setChatName("")
        setTagsValue([])
        setSendObject({
          toUsers: [],
          toParties: [],
        })
      }
    }
  }, [corpAppValue?.appId])

  // 默认选择第一个App对象
  useEffect(() => {
    corpAppList.length > 0
      ? setCorpAppValue(corpAppList[0])
      : (() => {
          setCorpAppValue(defaultAppValue)
          setGroupList([])
        })()
  }, [corpAppList])

  useEffect(() => {
    if (isLoadStop && sendObject !== undefined && !!sendObject) {
      const selectedList = [...sendObject.toParties, ...sendObject.toUsers]
      const array = departmentAndUserList.filter((x) => x)
      array.map((item) => {
        if (item.key === corpAppValue?.appId) {
          item.data = recursiveSearchDeptOrUser(
            departmentKeyValue?.data,
            (e) => {
              if (selectedList.some((item) => item === e.id)) e.selected = true
              else e.selected = false
            }
          )
        }
        return item
      })
      setIsUpdatedDeptUser(true)
      setDepartmentAndUserList(array)
    }
  }, [isLoadStop])

  useEffect(() => {
    if (!isShowDialog) {
      const noneHandleSelected: IDepartmentAndUserListValue[] = []
      recursiveSearchDeptOrUser(
        departmentKeyValue?.data,
        (e) => e.selected && noneHandleSelected.push(e)
      )
      const selectedList = uniqWith(
        (a: IDepartmentAndUserListValue, b: IDepartmentAndUserListValue) => {
          return a.id === b.id
        }
      )(noneHandleSelected)
      if (
        (isGetLastTimeData && isNewOrUpdate === "update") ||
        (!isGetLastTimeData &&
          updateMessageJobInformation === undefined &&
          isNewOrUpdate === "new")
      )
        setSendObject({
          toUsers: selectedList
            .filter((e) => e.type === DepartmentAndUserType.User)
            .map((e) => String(e.id)),
          toParties: selectedList
            .filter((e) => e.type === DepartmentAndUserType.Department)
            .map((e) => String(e.id)),
        })

      chatId &&
        corpAppValue?.appId &&
        GetGroupDetail(corpAppValue.appId, chatId).then((data) => {
          data &&
            data.errcode === 0 &&
            GetGroupUsersDetail({
              appId: corpAppValue.appId,
              userIds: data.chat_info.userlist,
            }).then((userList) => {
              userList &&
                userList.length > 0 &&
                setMentionList([
                  { id: `所有人(${userList.length})`, display: "所有人" },
                  ...userList.map((item) => ({
                    id: item.name,
                    display: item.name,
                  })),
                ])
            })
        })
    }
  }, [isShowDialog])

  useEffect(() => {
    const loadDepartment = async (AppId: string) => {
      setIsTreeViewLoading(true)
      const deptListResponse = await GetDeptsAndUserList(AppId)
      if (deptListResponse && deptListResponse.workWeChatUnits.length === 0)
        setIsTreeViewLoading(false)

      !!deptListResponse &&
        loadDeptUsersFromWebWorker({
          AppId,
          workWeChatUnits: deptListResponse.workWeChatUnits,
        }).then(() => {
          setIsTreeViewLoading(false)
          setIsLoadStop(true)
        })
    }
    if (
      isShowDialog &&
      !!corpAppValue &&
      !departmentAndUserList.find((e) => e.key === corpAppValue.appId)
    ) {
      // 设置相对应key的数据为空
      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev)
        const hasData = newValue.find((e) => e.key === corpAppValue.appId)
        hasData && (hasData.data = [])
        return newValue
      })
      setFlattenDepartmentList((prev) => {
        const newValue = clone(prev)
        const hasData = newValue.find((e) => e.key === corpAppValue.appId)
        hasData && (hasData.data = [])
        return newValue
      })

      !updateMessageJobInformation?.workWeChatAppNotification &&
        setSendObject({
          toUsers: [],
          toParties: [],
        })
      // 开始load数据
      setIsLoadStop(false)
      corpAppValue.appId && loadDepartment(corpAppValue.appId)
    }
  }, [corpAppValue?.appId, isShowDialog])

  // 判断文件大小
  const judgingFileSize = (
    type: string,
    files: File[],
    fileType?: MessageDataFileType
  ) => {
    if (type === "推文") {
      return files.some((item) => item.size / 1024 > 1024 * 10)
    } else {
      switch (fileType) {
        case MessageDataFileType.Image: {
          return files.some((item) => item.size / 1024 > 1024 * 10)
        }
        case MessageDataFileType.Voice: {
          return files.some((item) => item.size / 1024 > 1024 * 2)
        }
        case MessageDataFileType.Video: {
          return files.some((item) => item.size / 1024 > 1024 * 10)
        }
        case MessageDataFileType.File: {
          return files.some((item) => item.size / 1024 > 1024 * 20)
        }
      }
    }
  }

  // 文件上传
  const fileUpload = async (
    files: FileList,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (type === "推文") {
      const array =
        Array.from(files).length > 8
          ? Array.from(files).slice(-8)
          : Array.from(files)

      const isExceedSize = judgingFileSize("推文", array)
      if (isExceedSize) {
        e.target.value = ""
        showErrorPrompt("The file size is too large!")
      } else {
        if (array.length > 0) {
          const objectList: PictureText[] = []
          for (const key in array) {
            const base64 = await convertBase64(array[key])
            objectList.push({
              title: title,
              content: html,
              fileContent: base64 as string,
              fileName: array[key].name,
            })
          }
          setPictureText(objectList)
        }
      }
    } else {
      if (Array.from(files).length > 0) {
        const isExceedSize = judgingFileSize(
          "文件",
          Array.from(files),
          messageTypeValue.type
        )
        if (isExceedSize) {
          e.target.value = ""
          showErrorPrompt("The file size is too large！")
        } else {
          const file = files[0]
          const base64 = await convertBase64(file)

          setFile((prev) => ({
            ...prev,
            fileName: file.name,
            fileContent: base64 as string,
          }))
        }
      }
    }
  }

  // 文件删除
  const fileDelete = (name: string, index?: number) => {
    if (name === "file") {
      setFile({
        fileName: "",
        fileContent: "",
        fileType: 0,
      })
    } else {
      const arr = pictureText.filter((x, i) => i !== index)
      setPictureText(arr)
    }
  }

  // 文件标记
  const fileMark = useMemo(() => {
    switch (messageTypeValue.type) {
      case MessageDataFileType.File: {
        return "文件大小限制20MB!"
      }
      case MessageDataFileType.Image: {
        return "图片大小限制10MB,仅支持JPG和PNG格式!"
      }
      case MessageDataFileType.Video: {
        return "视频大小限制10MB,仅支持MP4格式!"
      }
      case MessageDataFileType.Voice: {
        return "语音大小限制2MB,仅支持AMR格式!"
      }
      default: {
        return ""
      }
    }
  }, [messageTypeValue.type])

  // 文件上传类型限制
  const fileAccept = useMemo(() => {
    if (messageTypeValue.groupBy === "文件")
      switch (messageTypeValue.type) {
        case MessageDataFileType.Image: {
          return "image/jpg,image/png"
        }
        case MessageDataFileType.Voice: {
          return "audio/amr"
        }
        case MessageDataFileType.Video: {
          return "video/mp4"
        }
        default: {
          return ""
        }
      }
  }, [messageTypeValue])

  // 切换时区Fun
  const switchTimeZone = (index: number) => {
    setTimeZoneValue(index)
  }

  const tagsNameList = useMemo(() => {
    return tagsValue.map((item) => item.tagName)
  }, [tagsValue])

  // 消息类型更换时替换文件的字段
  useEffect(() => {
    if (
      messageTypeValue.groupBy === "文件" &&
      messageTypeValue.type !== MessageDataFileType.Text
    ) {
      setFile({
        fileName: "",
        fileUrl: "",
        fileType: messageTypeValue.type,
      })
    }
    if (inputRef.current) inputRef.current.value = ""
  }, [messageTypeValue])

  // 图文上传时 标题内容自动更新
  useEffect(() => {
    if (messageTypeValue.groupBy === "" && messageTypeValue.title === "推文") {
      if (pictureText.length > 0) {
        const newArr = pictureText.map((item) => {
          item.content = html
          item.title = title
          return item
        })
        setPictureText(newArr)
      }
      if (lastTimePictureText.length > 0) {
        const lastArr = lastTimePictureText.map((item) => {
          item.content = html
          item.title = title
          return item
        })
        setLastTimePictureText(lastArr)
      }
    }
  }, [html, title])

  // jobSetting参数
  useEffect(() => {
    switch (sendTypeValue) {
      case MessageJobSendType.Fire: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
        })
        break
      }
      case MessageJobSendType.Delayed: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
          delayedJob: {
            enqueueAt: dateValue,
          },
        })
        break
      }
      default: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].convertTimeZone,
          recurringJob: !!endDateValue
            ? {
                cronExpression: cronExp,
                endDate: endDateValue,
              }
            : {
                cronExpression: cronExp,
              },
        })
        break
      }
    }
  }, [sendTypeValue, timeZoneValue, cronExp, dateValue, endDateValue])

  // sendData
  useEffect(() => {
    switch (messageTypeValue.title) {
      case "文本": {
        setSendData({
          text: {
            content:
              isNewOrUpdate === "new"
                ? `${title}\r\n${content}`
                : cleanContent !== undefined
                ? `${title}\r\n${content}`
                : content,
          },
        })
        break
      }
      case "推文": {
        setSendData({
          mpNews: {
            articles:
              isNewOrUpdate === "new"
                ? pictureText
                : pictureText.length <= 0
                ? lastTimePictureText
                : pictureText,
          },
        })
        break
      }
      default: {
        const send: SendData = {
          file:
            isNewOrUpdate === "new"
              ? file
              : !!file.fileName && !!file.fileContent
              ? file
              : lastTimeFile,
          text: {
            content: `${title}\r\n${content}`,
          },
        }

        setSendData(send)
        break
      }
    }
  }, [
    title,
    content,
    pictureText,
    file,
    lastTimePictureText,
    lastTimeFile,
    messageTypeValue.title,
    isNewOrUpdate,
    cleanContent,
  ])

  // sendParameter
  useEffect(() => {
    const a: SendParameter = {
      appId: !!corpAppValue?.appId ? corpAppValue?.appId : "",
    }
    if (!isEmpty(tagsNameList)) {
      a.toTags = tagsNameList
    }
    if (!isEmpty(sendObject.toUsers)) {
      a.toUsers = sendObject.toUsers
    }
    if (!isEmpty(sendObject.toParties)) {
      a.toParties = sendObject.toParties
    }
    if (!isEmpty(chatId)) {
      a.chatId = chatId
    }
    setSendParameter(a)
  }, [corpAppValue?.id, tagsNameList, sendObject])

  useEffect(() => {
    if (updateMessageJobInformation !== undefined) {
      setCorpsValue(updateMessageJobInformation.enterprise)
      setAppLoading(false)
      setCorpAppValue(updateMessageJobInformation.app)
      setSendTypeValue(updateMessageJobInformation.jobType)

      setTitle(
        updateMessageJobInformation.title !== undefined
          ? updateMessageJobInformation.title
          : ""
      )

      setCleanContent(updateMessageJobInformation.cleanContent)

      const workWeChatAppNotification =
        updateMessageJobInformation.workWeChatAppNotification
      if (workWeChatAppNotification.text !== null) {
        setMessageTypeValue(messageTypeList[0])
        setContent(
          updateMessageJobInformation.cleanContent !== undefined
            ? updateMessageJobInformation.cleanContent
            : updateMessageJobInformation?.content !== undefined
            ? updateMessageJobInformation?.content
            : ""
        )
      } else if (
        workWeChatAppNotification.mpNews !== null &&
        workWeChatAppNotification.mpNews?.articles !== undefined &&
        workWeChatAppNotification.mpNews?.articles.length > 0
      ) {
        if (workWeChatAppNotification.mpNews?.articles.length > 0) {
          const arr: PictureText[] = []
          workWeChatAppNotification.mpNews?.articles.map((item: PictureText) =>
            arr.push({
              title: item.title,
              content: item.content,
              fileUrl: item.fileUrl,
              fileName: item.fileName,
            })
          )
          setLastTimePictureText(arr)
        } else {
          setLastTimePictureText([])
        }
        setLastTimePictureText(workWeChatAppNotification.mpNews?.articles)
        setMessageTypeValue(messageTypeList[1])
        setHtml(workWeChatAppNotification.mpNews?.articles[0].content)
      } else if (workWeChatAppNotification.file !== null) {
        setLastTimeFile({
          fileName: !!workWeChatAppNotification.file?.fileName
            ? workWeChatAppNotification.file?.fileName
            : "",
          fileType:
            workWeChatAppNotification.file?.fileType !== undefined
              ? workWeChatAppNotification.file?.fileType
              : 0,
          fileUrl: workWeChatAppNotification.file?.fileUrl,
        })

        switch (workWeChatAppNotification.file?.fileType) {
          case MessageDataFileType.Image: {
            setMessageTypeValue(messageTypeList[2])
            break
          }
          case MessageDataFileType.Voice: {
            setMessageTypeValue(messageTypeList[3])
            break
          }
          case MessageDataFileType.Video: {
            setMessageTypeValue(messageTypeList[4])
            break
          }
          case MessageDataFileType.File: {
            setMessageTypeValue(messageTypeList[5])
            break
          }
        }
      }

      // 发送类型
      const jobSetting = JSON.parse(updateMessageJobInformation.jobSettingJson)
      const oldTimeZone = timeZone.find(
        (item) =>
          item.title ===
          JSON.parse(updateMessageJobInformation.jobSettingJson).Timezone
      )?.value
      oldTimeZone !== undefined && setTimeZoneValue(oldTimeZone)

      if (jobSetting.DelayedJob !== null) {
        setSendTypeValue(MessageJobSendType.Delayed)
        setDateValue(jobSetting.DelayedJob.EnqueueAt)
      } else if (jobSetting.RecurringJob !== null) {
        setSendTypeValue(MessageJobSendType.Recurring)
        setEndDateValue(jobSetting.RecurringJob.EndDate)
        setCronExp(jobSetting.RecurringJob.CronExpression)
      } else {
        setSendTypeValue(MessageJobSendType.Fire)
      }

      // sendObject
      setSendObject({
        toUsers:
          workWeChatAppNotification.toUsers !== undefined
            ? workWeChatAppNotification.toUsers
            : [],
        toParties:
          workWeChatAppNotification.toParties !== undefined
            ? workWeChatAppNotification.toParties
            : [],
      })

      updateMessageJobInformation.workWeChatAppNotification.toTags !==
        undefined &&
        setLastTimeTagsList(
          updateMessageJobInformation.workWeChatAppNotification.toTags
        )

      setIsGetLastTimeData(true)
      // 回显群组名称
      if (
        updateMessageJobInformation.groupId &&
        updateMessageJobInformation.groupName
      ) {
        setChatId(updateMessageJobInformation.groupId)
        setChatName(updateMessageJobInformation.groupName)
        setSendType(SendObjOrGroup.Group)
      }
    }
  }, [updateMessageJobInformation])

  // 返回最终的数据给外层
  useEffect(() => {
    if (jobSetting !== undefined && sendParameter !== undefined) {
      const metadata = [
        {
          key: "title",
          value: title,
        },
        {
          key: "enterpriseName",
          value: `${corpsValue?.corpName}`,
        },
        {
          key: "enterpriseId",
          value: `${corpsValue?.id}`,
        },
        {
          key: "enterpriseCorpId",
          value: `${corpsValue?.corpId}`,
        },
        {
          key: "appName",
          value: `${corpAppValue?.name}`,
        },
        {
          key: "display",
          value: `${corpAppValue?.display}`,
        },
        {
          key: "weChatAppId",
          value: `${corpAppValue?.appId}`,
        },
        {
          key: "agentId",
          value: `${corpAppValue?.agentId}`,
        },
        {
          key: "appId",
          value: `${corpAppValue?.id}`,
        },
        {
          key: "cleanContent",
          value: messageTypeValue.title === "推文" ? htmlText : content,
        },
      ]
      !isShowDialog &&
        sendType === SendObjOrGroup.Group &&
        chatId &&
        groupList.length > 0 &&
        metadata.push(
          {
            key: "groupName",
            value: chatName,
          },
          {
            key: "groupId",
            value: chatId,
          }
        )

      // 在传出去外层前做判断, 不清除无用已选项
      const handleSendParams = { ...sendParameter }
      sendType === SendObjOrGroup.Group
        ? (() => {
            delete handleSendParams.toParties
            delete handleSendParams.toUsers
            delete handleSendParams.toTags
          })()
        : delete handleSendParams.chatId

      const workWeChatAppNotification = {
        ...handleSendParams,
        ...sendData,
      }

      isNewOrUpdate === "new"
        ? getSendData !== undefined &&
          getSendData({
            jobSetting: jobSetting,
            metadata: metadata,
            workWeChatAppNotification: workWeChatAppNotification,
          })
        : getUpdateData !== undefined &&
          getUpdateData({
            messageJobId: !!updateMessageJobInformation?.id
              ? updateMessageJobInformation?.id
              : "",
            jobSetting: jobSetting,
            metadata: metadata,
            workWeChatAppNotification: workWeChatAppNotification,
          })
    }
  }, [
    title,
    content,
    jobSetting,
    sendParameter,
    sendData,
    corpsValue,
    corpAppValue,
    isNewOrUpdate,
    sendType,
    chatId,
    messageTypeValue.title,
    isShowDialog,
  ])

  useEffect(() => {
    if (clearData && isNewOrUpdate === "new") {
      setTitle("")
      setContent("")
      setCorpsValue(corpsList[0])
      setCorpAppValue(corpAppList[0])
      setTagsValue([])
      setMessageTypeValue(messageTypeList[0])
      setSendTypeValue(MessageJobSendType.Fire)
      setTimeZoneValue(timeZone.filter((x) => !x.disable)[0].value)
      setSendObject({
        toUsers: [],
        toParties: [],
      })
      setPictureText([])
      setFile({
        fileContent: "",
        fileName: "",
        fileType: messageTypeValue.type,
      })
      setDateValue("")
      setEndDateValue("")
      setCronExp("0 0 * * *")
      setChatId("")
      setChatName("")
      setDepartmentAndUserList((prev) => {
        return prev.map((item) => {
          recursiveSearchDeptOrUser(item.data, (e) => (e.selected = false))
          return item
        })
      })
      setHtml("")
      setEditor(null)
    }
  }, [clearData, isNewOrUpdate])

  const detectMentionToDelete = (value: string, key: string) => {
    const afterPattern = /[^@]+$/
    const beforePattern = /.*(?=@[^@]*$)/
    key === "Backspace" &&
      value.slice(-1) === " " &&
      mentionList.some(
        (item) => item.display === value.match(afterPattern)?.[0].trim()
      ) &&
      setContent(value.match(beforePattern)?.[0] ?? "")
  }

  useEffect(() => {
    setIsShowPage &&
      setIsShowPage(
        (isNewOrUpdate === "new" && corpsList.length > 0 && !appLoading) ||
          isNewOrUpdate !== "new"
      )
  }, [isNewOrUpdate, appLoading, corpsList])

  return {
    corpsValue,
    setCorpsValue,
    corpsList,
    corpAppList,
    messageTypeValue,
    setMessageTypeValue,
    sendTypeValue,
    setSendTypeValue,
    timeZoneValue,
    setTimeZoneValue,
    isShowDialog,
    setIsShowDialog,
    departmentAndUserList,
    setDepartmentAndUserList,
    departmentKeyValue,
    searchKeyValue,
    isTreeViewLoading,
    tagsList,
    chatId,
    chatName,
    sendType,
    selectedShowArr,
    setSendType,
    setChatId,
    setChatName,
    setTagsValue,
    title,
    setTitle,
    content,
    setContent,
    fileUpload,
    groupList,
    setGroupList,
    fileAccept,
    file,
    pictureText,
    dateValue,
    setDateValue,
    endDateValue,
    setEndDateValue,
    cronExp,
    setCronExp,
    setCronError,
    switchTimeZone,
    isLoadStop,
    lastTimeTagsList,
    lastTimePictureText,
    lastTimeFile,
    inputRef,
    fileDelete,
    fileMark,
    clickName,
    setClickName,
    setFlattenDepartmentList,
    editor,
    setEditor,
    editorConfig,
    html,
    setHtml,
    setHtmlText,
    isFocusing,
    focusAction,
    tagsValue,
    isUpdatedDeptUser,
    mentionList,
    detectMentionToDelete,
    appLoading,
    groupLoading,
  }
}
