import { debounce } from "@material-ui/core"
import { useDebounceEffect, useDebounceFn } from "ahooks"
import { clone, uniq } from "ramda"
import { useCallback, useEffect, useState } from "react"
import {
  GetWeChatWorkCorpAppGroups,
  PostWeChatWorkGroupCreate,
} from "../../../../api/enterprise"
import {
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList,
  IDepartmentKeyControl,
  ClickType,
  DeptUserCanSelectStatus,
  IWorkGroupCreate,
  SendObjOrGroup,
  IFirstState,
  IWorkCorpAppGroup,
} from "../../../../dtos/enterprise"

const useAction = (props: {
  departmentAndUserList: IDepartmentKeyControl[]
  departmentKeyValue: IDepartmentKeyControl
  AppId: string
  isLoading: boolean
  open: boolean
  lastTagsValue: string[] | undefined
  tagsList: ITagsList[]
  clickName: string
  chatId: string
  chatName: string
  outerTagsValue?: ITagsList[]
  isUpdatedDeptUser: boolean
  sendType?: SendObjOrGroup
  CorpId: string
  targetSelectedList: IDepartmentAndUserListValue[]
  setSendType?: React.Dispatch<React.SetStateAction<SendObjOrGroup>>
  setOpenFunction: (open: boolean) => void
  setChatId?: React.Dispatch<React.SetStateAction<string>>
  setChatName?: React.Dispatch<React.SetStateAction<string>>
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
  setGroupList: React.Dispatch<React.SetStateAction<IWorkCorpAppGroup[]>>
  settingSelectedList: (valueList: IDepartmentAndUserListValue[]) => void
}) => {
  const {
    departmentAndUserList,
    departmentKeyValue,
    AppId,
    open,
    isLoading,
    tagsList,
    clickName,
    chatId,
    chatName,
    outerTagsValue,
    isUpdatedDeptUser,
    lastTagsValue,
    sendType,
    CorpId,
    targetSelectedList,
    setSendType,
    setChatId,
    setChatName,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    setGroupList,
    settingSelectedList,
  } = props

  const defaultGroupOwner = {
    id: "-1",
    name: "随机群主",
    type: DepartmentAndUserType.User,
    parentid: -1,
    selected: false,
    isCollapsed: false,
    children: [],
  }
  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[] | undefined
  >()
  const [groupDeptUserSelectedList, setGroupDeptUserSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [groupOwner, setGroupOwner] =
    useState<IDepartmentAndUserListValue>(defaultGroupOwner)
  const [groupName, setGroupName] = useState("")
  const [tipsObject, setTipsObject] = useState({
    show: false,
    msg: "",
  })
  const [groupDeptUserList, setGroupDeptUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  const [sendList, setSendList] = useState([
    SendObjOrGroup.Object,
    SendObjOrGroup.Group,
  ])

  const [firstState, setFirstState] = useState<IFirstState>()

  const [createLoading, setCreateLoading] = useState(false)

  const [groupPage, setGroupPage] = useState<number>(2)

  const [groupIsNoData, setGroupIsNoData] = useState<boolean>(false)

  const [keyword, setKeyword] = useState<string>("")

  const [searchValue, setSearchValue] = useState<IWorkCorpAppGroup | null>(null)

  const recursiveSeachDeptOrUser = (
    hasData: IDepartmentAndUserListValue[],
    callback: (e: IDepartmentAndUserListValue) => void
  ) => {
    for (const key in hasData) {
      callback(hasData[key])
      hasData[key].children.length > 0 &&
        recursiveSeachDeptOrUser(hasData[key].children, callback)
    }
    return hasData
  }

  const recursiveDeptList = (
    hasData: IDepartmentAndUserListValue[],
    changeList: IDepartmentAndUserListValue[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      const hasItemIndex = changeList.findIndex((item) => item.id === e.id)
      e.selected
        ? hasItemIndex <= -1 &&
          changeList.push({
            id: e.id,
            name: e.name,
            type: DepartmentAndUserType.User,
            parentid: e.parentid,
            selected: e.selected,
            isCollapsed: false,
            children: [],
          })
        : hasItemIndex > -1 && changeList.splice(hasItemIndex, 1)
      e.children.length > 0 && recursiveDeptList(e.children, changeList)
    }
  }

  // 处理部门列表能否被选择
  const handleTypeIsCanSelect = (
    canSelect: DeptUserCanSelectStatus,
    type: DepartmentAndUserType
  ) => {
    if (canSelect === DeptUserCanSelectStatus.Both) return true
    return type === DepartmentAndUserType.Department
      ? canSelect === DeptUserCanSelectStatus.Department
      : canSelect === DeptUserCanSelectStatus.User
  }

  // 处理点击创建群组
  const handleCreateGroup = () => {
    let requestData: IWorkGroupCreate
    !groupName
      ? setTipsObject({ show: true, msg: "Please input a valid group name" })
      : (departmentSelectedList ?? []).length <= 1
      ? setTipsObject({
          show: true,
          msg: "Please select 2 or more valid users",
        })
      : !AppId
      ? setTipsObject({ show: true, msg: "Error for no AppId provided" })
      : (() => {
          setCreateLoading(true)
          requestData = {
            appId: AppId,
            name: groupName,
            owner: groupOwner.id as string,
            userList: (departmentSelectedList ?? []).map(
              (item) => item.id as string
            ),
          }
          if (requestData.owner === defaultGroupOwner.id)
            delete requestData.owner
          setOpenFunction(false)
          PostWeChatWorkGroupCreate(requestData).then((data) => {
            if (data && data.errmsg === "ok") {
              setTipsObject({ msg: "创建成功", show: true })
              setCreateLoading(false)
              // 清空数据
              setDepartmentSelectedList([])
              setGroupOwner(defaultGroupOwner)
              setGroupName("")
              GetWeChatWorkCorpAppGroups(CorpId).then((result) => {
                result && setGroupList(result)
              })
            } else {
              data && setTipsObject({ msg: data.errmsg, show: true })
            }
          })
        })()
  }

  const handleConfirm = () => {
    setOpenFunction(false)
    setOuterTagsValue(tagsValue)
    departmentSelectedList && settingSelectedList(departmentSelectedList)
    setFirstState(undefined)
  }

  const handleCancel = () => {
    setOpenFunction(false)
    clearSelected()
  }

  const onListBoxScrolling = (
    scrollHeight: number,
    scrollTop: number,
    clientHeight: number
  ) => {
    scrollTop + clientHeight >= scrollHeight - 2 &&
      !groupIsNoData &&
      setGroupPage((prev) => prev + 1)
  }

  useDebounceEffect(
    () => {
      if (CorpId && !groupIsNoData) {
        GetWeChatWorkCorpAppGroups(CorpId, groupPage, 15, keyword).then(
          (result) => {
            result &&
              setGroupList((prev) =>
                groupPage === 1 ? result : uniq([...prev, ...result])
              )
          }
        )
      }
    },
    [groupPage, keyword],
    { wait: 500 }
  )

  useEffect(() => {
    // 限制条件下群组部门列表变化同步到群组搜索选择列表
    !isLoading &&
      !!groupDeptUserList &&
      groupDeptUserList.length > 0 &&
      setGroupDeptUserSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e)
        const activeData = groupDeptUserList.find((x) => x.key === AppId)
        activeData && recursiveDeptList(activeData.data, newValue)
        return newValue
      })
  }, [groupDeptUserList])

  useEffect(() => {
    // 当第一次拿到选择目标部门列表复制给群组部门列表
    departmentKeyValue &&
      departmentAndUserList.length > 0 &&
      (!groupDeptUserList
        ? setGroupDeptUserList(clone(departmentAndUserList))
        : groupDeptUserList.every((item) => item.key !== AppId) &&
          setGroupDeptUserList((prev) => [...prev, clone(departmentKeyValue)]))
  }, [departmentAndUserList, AppId])

  const clearSelected = () => {
    if (firstState) {
      setTagsValue(firstState.tagsValue)
      setChatId && setChatId(firstState.chatId)
      setChatName && setChatName(firstState.chatName)
      setSendType && setSendType(firstState.sendType)
      setFirstState(undefined)
    }
  }

  useEffect(() => {
    clearSelected()
  }, [AppId])

  useEffect(() => {
    if (!isShowDialog && !!chatId && !!chatName) {
      setKeyword(chatName)
      setSearchValue({ chatId, chatName })
    }
  }, [chatName, chatId, isShowDialog])

  useEffect(() => {
    isUpdatedDeptUser && setDepartmentSelectedList(targetSelectedList)
  }, [isUpdatedDeptUser, open, targetSelectedList])

  useEffect(() => {
    open &&
      isUpdatedDeptUser &&
      setFirstState({
        tagsValue: outerTagsValue ?? [],
        chatId,
        deptUserList: clone(departmentAndUserList),
        sendType: sendType ?? SendObjOrGroup.Object,
        chatName,
      })
  }, [open, isUpdatedDeptUser])

  useEffect(() => {
    const handleData = (
      prev: IDepartmentAndUserListValue[],
      listData: IDepartmentKeyControl[]
    ) => {
      const newValue = prev.filter((x) => x)
      const hasData = listData.find((x) => x.key === AppId)
      hasData &&
        recursiveSeachDeptOrUser(hasData.data, (e) => {
          e.selected && newValue.push(e)
        })
      return newValue
    }
    // 打开时load上次选中的数据
    open
      ? clickName !== "选择发送目标" &&
        setGroupDeptUserSelectedList((prev) =>
          handleData(prev, groupDeptUserList)
        )
      : // 关闭时清空上次选中数据
        (() => {
          // setDepartmentSelectedList([])
          setGroupDeptUserSelectedList([])
          setGroupIsNoData(false)
        })()
  }, [open])

  useEffect(() => {
    // 3s关闭提示
    const number = setTimeout(() => {
      if (tipsObject.show) {
        setTipsObject({ msg: "", show: false })
      }
    }, 3000)
    return () => {
      clearTimeout(number)
    }
  }, [tipsObject.show])

  useEffect(() => {
    if (!!tagsList && !!lastTagsValue && lastTagsValue?.length > 0) {
      const selectTagsList: ITagsList[] = []
      lastTagsValue.forEach((item) => {
        const findItem = tagsList.find((i) => i.tagId === Number(item))
        !!findItem && selectTagsList.push(findItem)
      })

      setTagsValue(selectTagsList)
    }
  }, [tagsList, lastTagsValue])

  return {
    departmentSelectedList,
    tagsValue,
    isShowDialog,
    groupOwner,
    groupName,
    tipsObject,
    defaultGroupOwner,
    groupDeptUserList,
    createLoading,
    sendList,
    keyword,
    groupPage,
    searchValue,
    setSearchValue,
    setGroupPage,
    setKeyword,
    setGroupIsNoData,
    setCreateLoading,
    setGroupName,
    setGroupOwner,
    handleTypeIsCanSelect,
    setIsShowDialog,
    setTagsValue,
    handleCreateGroup,
    handleConfirm,
    handleCancel,
    onListBoxScrolling,
    setDepartmentSelectedList,
  }
}
export default useAction
