import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetTagsList,
  SendMessage
} from "../../../../api/enterprise"
import {
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IMessageTypeData,
  ISendMsgData,
  ITagsList,
  MessageDataType,
  MessageWidgetShowStatus
} from "../../../../dtos/enterprise"
import { flatten } from "ramda"

const useAction = () => {
  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "文件", groupBy: "文件", type: MessageDataType.File }
  ]
  const [messageParams, setMessageParams] = useState<string>("")

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
        DepartmentId: department.id
      })
      if (!!userList && userList.errcode === 0) {
        setDepartmentAndUserList((prev) => {
          let newValue = prev.filter((e) => !!e)
          const hasData = newValue.find((e) => e.key === AppId)
          const insertNewData = {
            ...department,
            departmentUserList: userList.userlist.map((e) => ({
              ...e,
              selected: false
            })),
            selected: false
          }
          hasData
            ? hasData.data.push(insertNewData)
            : newValue.push({
                key: AppId,
                data: [insertNewData]
              })
          return newValue
        })
        setFlattenDepartmentList((prev) => {
          return [
            ...prev,
            ...flatten(userList.userlist).map((item) => ({
              id: item.userid,
              name: item.name,
              parentid: department.name
            }))
          ]
        })
        index === limit - 1 && setIsTreeViewLoading(false)
      }
    }
  }

  const handleSubmit = async () => {
    let toUsers: string[] = []
    let toParties: string[] = []
    toParties = departmentKeyValue.data
      .filter((e) => e.selected)
      .map((e) => String(e.id))
    departmentKeyValue.data.forEach((department) => {
      toUsers = toUsers.concat(
        department.departmentUserList
          .filter((user) => user.selected)
          .map((e) => e.userid)
      )
    })
    const data: ISendMsgData = {
      appId: corpAppValue?.appId,
      toTags: tagsValue.map((e) => String(e.tagId)),
      toUsers,
      toParties
    }

    messageTypeValue.type === MessageDataType.Image && !messageTypeValue.groupBy
      ? (data.mpNews = {
          articles: [
            {
              content: "",
              fileContent: ""
            }
          ]
        })
      : messageTypeValue.type === MessageDataType.Text
      ? (data.text = {
          content: ""
        })
      : (data.file = {
          fileName: "",
          fileContent: "",
          fileType: messageTypeValue.type
        })

    // TODO 发送接口
    // const response = await SendMessage(data);
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
  }, [corpAppValue?.appId])

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
    departmentKeyValue,
    setDepartmentAndUserList,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    setIsShowMessageParams,
    onScrolling,
    setTagsValue
  }
}

export default useAction
