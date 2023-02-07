import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetTagsList
} from "../../../../api/enterprise"
import {
  DepartmentAndUserType,
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
import { clone, flatten, uniqWith } from "ramda"

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
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result as IDepartmentKeyControl
  }, [departmentAndUserList])

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
      } else if (e.children.length > 0) {
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
        children: []
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
        DepartmentId: department.id
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
                children: []
              }))
          }
          return newValue
        })
        setFlattenDepartmentList((prev) => {
          return [
            ...prev,
            {
              id: department.id,
              name: department.name,
              parentid: department.name,
              type: DepartmentAndUserType.Department,
              selected: false,
              children: []
            },
            ...flatten(
              userList.userlist.map((item) => ({
                id: item.userid,
                name: item.name,
                parentid: department.name,
                type: DepartmentAndUserType.User,
                selected: false,
                children: []
              }))
            )
          ]
        })
        index === deptListResponse.length - 1 && setIsTreeViewLoading(false)
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

  const handleSubmit = async () => {
    const selectedList = uniqWith(
      (a: IDepartmentAndUserListValue, b: IDepartmentAndUserListValue) => {
        return a.id === b.id
      }
    )(recursiveGetSelectedList(departmentKeyValue.data, []))

    const data: ISendMsgData = {
      appId: corpAppValue?.appId,
      toTags: tagsValue.map((e) => String(e.tagId)),
      toUsers: selectedList
        .filter((e) => e.type === DepartmentAndUserType.User)
        .map((e) => String(e.id)),
      toParties: selectedList
        .filter((e) => e.type === DepartmentAndUserType.Department)
        .map((e) => String(e.id))
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
    setTagsValue
  }
}

export default useAction
