import { clone, flatten, uniqWith } from "ramda"
import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetTagsList,
} from "../../../../api/enterprise"
import {
  DepartmentAndUserType,
  FileObject,
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IJobSettingDto,
  IMessageTypeData,
  ISearchList,
  ITagsList,
  MessageDataFileType,
  MessageJobSendType,
  PictureText,
  SendData,
  SendObject,
  SendParameter,
} from "../../../../dtos/enterprise"
import { messageTypeList, timeZone } from "../../../../dtos/send-message-job"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { SelectContentHookProps } from "./props"
import { v4 as uuidv4 } from "uuid"
import { useBoolean } from "ahooks"

export const useAction = (props: SelectContentHookProps) => {
  const {
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    setWhetherToCallAPI,
  } = props

  // 拿到的企业对象
  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  // 拿到的App对象
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()
  // 获取的企业数组
  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  // 获取的App数组
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  // 发送的Tags数组
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
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  // 弹出选择对象框 boolean
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  // 部门和用户数组
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  //
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([])
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
  // 图文
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
  //  is JobSetting true
  const [isJobSetting, setIsJobSetting] = useState<boolean>(false)
  // workWeChatAppNotification SendParameter
  const [sendParameter, setSendParameter] = useState<SendParameter>()
  //
  const [isSendParameter, setIsSendParameter] = useState<boolean>(false)
  // workWeChatAppNotification SendParameter
  const [sendData, setSendData] = useState<SendData>()
  //
  const [isSendData, setIsSendData] = useState<boolean>(false)
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

  // 初始化企业数组
  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        const array: { id: string; corpName: string }[] = []
        data.forEach((item) =>
          array.push({ id: item.id, corpName: item.corpName })
        )
        setCorpsList(array)
      }
    })
  }, [])

  // 默认选择第一个企业对象
  useEffect(() => {
    if (corpsValue === undefined) {
      setCorpsValue(corpsList[0])
    }
  }, [corpsList])

  // 初始化App数组
  useEffect(() => {
    !!corpsValue &&
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
        }
      })
  }, [corpsValue?.id])

  // 获取Tags数组
  useEffect(() => {
    corpAppValue?.appId !== undefined &&
      GetTagsList({ AppId: corpAppValue.appId }).then((tagsData) => {
        tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist)
      })
  }, [corpAppValue?.appId])

  // 默认选择第一个App对象
  useEffect(() => {
    setCorpAppValue(corpAppList[0])
  }, [corpAppList])

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

      if (index === deptListResponse.length - 1) {
        setIsLoadStop(true)
      }
    }
  }

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

  const recursiveDeptOrUserToSelectedList = (
    sourceData: IDepartmentAndUserListValue[],
    selectedList: string[]
  ) => {
    for (const key in sourceData) {
      const e = sourceData[key]
      if (selectedList.some((item) => item === e.id)) e.selected = true
      if (e.children.length > 0) {
        recursiveDeptOrUserToSelectedList(e.children, [...selectedList])
      }
    }
    return sourceData
  }

  useEffect(() => {
    if (isLoadStop && sendObject !== undefined && !!sendObject) {
      const array = departmentAndUserList.filter((x) => x)
      array.map((item) => {
        if (item.key === corpAppValue?.appId) {
          item.data = recursiveDeptOrUserToSelectedList(
            departmentKeyValue?.data,
            [...sendObject.toParties, ...sendObject.toUsers]
          )
        }
        return item
      })
      setDepartmentAndUserList(array)
    }
  }, [isLoadStop])

  useEffect(() => {
    if (isLoadStop) {
      const selectedList = uniqWith(
        (a: IDepartmentAndUserListValue, b: IDepartmentAndUserListValue) => {
          return a.id === b.id
        }
      )(recursiveGetSelectedList(departmentKeyValue?.data, []))
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
    }
  }, [departmentAndUserList])

  useEffect(() => {
    setDepartmentAndUserList([])
    setFlattenDepartmentList([])
    setIsLoadStop(false)
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

  // 判断文件大小
  const judgingFileSize = (
    type: string,
    files: File[],
    fileType?: MessageDataFileType
  ) => {
    if (type === "图文") {
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
  const fileUpload = async (files: FileList, type: string) => {
    if (type === "图文") {
      const array = Array.from(files)
      const isExceedSize = judgingFileSize("图文", array)
      if (isExceedSize) {
      } else {
        if (array.length > 0) {
          const objectList: PictureText[] = []
          for (const key in array) {
            const base64 = await convertBase64(array[key])
            objectList.push({
              title: title,
              content: content,
              fileContent: base64 as string,
              contentSourceUrl: "",
            })
          }
          setPictureText(objectList)
        }
      }
    } else {
      if (Array.from(files).length > 0) {
        const isExceedSize = judgingFileSize(
          "图文",
          Array.from(files),
          messageTypeValue.type
        )
        if (isExceedSize) {
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
          return "application/*"
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
      setFile((prev) => ({
        ...prev,
        fileType: messageTypeValue.type,
      }))
    }
  }, [messageTypeValue])

  // 图文上传时 标题内容自动更新
  useEffect(() => {
    if (messageTypeValue.groupBy === "" && messageTypeValue.title === "图文") {
      if (pictureText.length > 0) {
        const arr = pictureText.map((item) => {
          item.content = content
          item.title = title
          return item
        })
        setPictureText(arr)
      }
    }
  }, [content, title])

  // jobSetting参数
  useEffect(() => {
    switch (sendTypeValue) {
      case MessageJobSendType.Fire: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title,
        })
        break
      }
      case MessageJobSendType.Delayed: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title,
          delayedJob: {
            enqueueAt: dateValue,
          },
        })
        break
      }
      default: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title,
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

  //判断jobSetting是否正确
  useEffect(() => {
    if (jobSetting !== undefined) {
      switch (sendTypeValue) {
        case MessageJobSendType.Fire: {
          setIsJobSetting(jobSetting !== undefined && !!jobSetting.timezone)
          break
        }
        case MessageJobSendType.Delayed: {
          setIsJobSetting(
            jobSetting !== undefined &&
              !!jobSetting.timezone &&
              jobSetting.delayedJob !== undefined &&
              !!jobSetting.delayedJob.enqueueAt
          )
          break
        }
        default: {
          setIsJobSetting(
            jobSetting !== undefined &&
              !!jobSetting.timezone &&
              jobSetting.recurringJob !== undefined &&
              !!jobSetting.recurringJob.cronExpression
          )
          break
        }
      }
    }
  }, [jobSetting, sendTypeValue])

  // sendData
  useEffect(() => {
    switch (messageTypeValue.title) {
      case "文本": {
        setSendData({
          text: {
            content: content,
          },
        })
        break
      }
      case "图文": {
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
        setSendData({
          file:
            isNewOrUpdate === "new"
              ? file
              : !!file.fileName && !!file.fileContent
              ? file
              : lastTimeFile,
        })
        break
      }
    }
  }, [
    messageTypeValue.title,
    content,
    pictureText,
    file,
    isNewOrUpdate,
    lastTimePictureText,
    lastTimeFile,
  ])

  // 判断sendData是否正确
  useEffect(() => {
    switch (messageTypeValue.title) {
      case "文本": {
        setIsSendData(sendData !== undefined)
        break
      }
      case "图文": {
        setIsSendData(
          sendData !== undefined &&
            sendData.mpNews !== undefined &&
            sendData.mpNews.articles.length > 0
        )
        break
      }
      default: {
        setIsSendData(
          sendData !== undefined &&
            sendData.file !== undefined &&
            sendData.file.fileName.length > 0 &&
            sendData.file.fileType !== MessageDataFileType.Text
        )
        break
      }
    }
  }, [sendData, messageTypeValue.title])

  // sendParameter
  useEffect(() => {
    setSendParameter({
      appId: !!corpAppValue?.id ? corpAppValue?.id : "",
      toTags: tagsNameList,
      toUsers: sendObject.toUsers,
      toParties: sendObject.toParties,
    })
  }, [corpAppValue?.id, tagsNameList, sendObject])

  // 判断sendParameter是否正确
  useEffect(() => {
    setIsSendParameter(
      sendParameter !== undefined &&
        !!sendParameter.appId &&
        ((sendParameter.toTags !== undefined &&
          sendParameter.toTags.length > 0) ||
          (sendParameter.toUsers !== undefined &&
            sendParameter.toUsers.length > 0) ||
          (sendParameter.toParties !== undefined &&
            sendParameter.toParties.length > 0))
    )
  }, [sendParameter])

  useEffect(() => {
    if (updateMessageJobInformation !== undefined) {
      setCorpsValue(updateMessageJobInformation.enterprise)
      setCorpAppValue(updateMessageJobInformation.app)
      setSendTypeValue(updateMessageJobInformation.jobType)

      setTitle(updateMessageJobInformation.title)

      const workWeChatAppNotification =
        updateMessageJobInformation.workWeChatAppNotification
      if (workWeChatAppNotification.text !== null) {
        setMessageTypeValue(messageTypeList[0])
        setContent(
          updateMessageJobInformation?.content !== undefined
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
          workWeChatAppNotification.mpNews?.articles.map((item) =>
            arr.push({
              title: item.title,
              content: item.content,
              fileUrl: item.fileUrl,
            })
          )
          setLastTimePictureText(arr)
        } else {
          setLastTimePictureText([])
        }
        setLastTimePictureText(workWeChatAppNotification.mpNews?.articles)
        setMessageTypeValue(messageTypeList[1])
        setContent(workWeChatAppNotification.mpNews?.articles[0].content)
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
    }
  }, [updateMessageJobInformation])

  // 返回最终的数据给外层
  useEffect(() => {
    if (isJobSetting && isSendParameter && isSendData && !!title) {
      if (jobSetting !== undefined && sendParameter !== undefined)
        if (isNewOrUpdate === "new") {
          getSendData !== undefined &&
            getSendData({
              correlationId: uuidv4(),
              jobSetting: jobSetting,
              metadata: [
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
                  key: "appName",
                  value: `${corpAppValue?.name}`,
                },
                {
                  key: "weChatAppId",
                  value: `${corpAppValue?.appId}`,
                },
                {
                  key: "appId",
                  value: `${corpAppValue?.id}`,
                },
              ],
              workWeChatAppNotification: {
                ...sendParameter,
                ...sendData,
              },
            })
        } else {
          getUpdateData !== undefined &&
            getUpdateData({
              messageJobId: !!updateMessageJobInformation?.id
                ? updateMessageJobInformation?.id
                : "",
              jobSetting: jobSetting,
              metadata: [
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
                  key: "appName",
                  value: `${corpAppValue?.name}`,
                },
                {
                  key: "weChatAppId",
                  value: `${corpAppValue?.appId}`,
                },
                {
                  key: "appId",
                  value: `${corpAppValue?.id}`,
                },
              ],
              workWeChatAppNotification: {
                ...sendParameter,
                ...sendData,
              },
            })
        }
      setWhetherToCallAPI.setTrue()
    } else {
      setWhetherToCallAPI.setFalse()
    }
  }, [
    title,
    isJobSetting,
    isSendParameter,
    isSendData,
    jobSetting,
    sendParameter,
    sendData,
    corpsValue,
    corpAppValue,
    isNewOrUpdate,
  ])

  return {
    corpsValue,
    setCorpsValue,
    corpAppValue,
    setCorpAppValue,
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
    setTagsValue,
    title,
    setTitle,
    content,
    setContent,
    fileUpload,
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
  }
}
