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
  setSendType?: React.Dispatch<React.SetStateAction<SendObjOrGroup>>
  setOpenFunction: (open: boolean) => void
  setChatId?: React.Dispatch<React.SetStateAction<string>>
  setChatName?: React.Dispatch<React.SetStateAction<string>>
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
  setGroupList: React.Dispatch<React.SetStateAction<IWorkCorpAppGroup[]>>
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
    setSendType,
    setChatId,
    setChatName,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    setGroupList,
  } = props

  const defaultGroupOwner = {
    id: "-1",
    name: "随机群主",
    type: DepartmentAndUserType.User,
    parentid: "",
    selected: false,
    isCollapsed: false,
    children: [],
  }
  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])
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
            parentid: String(e.parentid),
            selected: e.selected,
            isCollapsed: false,
            children: [],
          })
        : hasItemIndex > -1 && changeList.splice(hasItemIndex, 1)
      e.children.length > 0 && recursiveDeptList(e.children, changeList)
    }
  }

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedItem: IDepartmentAndUserListValue
  ) => {
    clickName === "选择发送目标"
      ? setDeptUserList((prev) => {
          const newValue = prev.filter((e) => !!e)
          const activeData = newValue.find(
            (e) => e.key === departmentKeyValue.key
          )
          activeData &&
            recursiveSeachDeptOrUser(activeData.data, (e) => {
              e.id === clickedItem.id &&
                (type === ClickType.Collapse
                  ? (e.isCollapsed = !e.isCollapsed)
                  : (e.selected = !e.selected))
            })
          return newValue
        })
      : setGroupDeptUserList((prev) => {
          const newValue = prev.filter((e) => !!e)
          const activeData = newValue.find(
            (e) => e.key === departmentKeyValue.key
          )
          activeData &&
            recursiveSeachDeptOrUser(activeData.data, (e) => {
              e.id === clickedItem.id &&
                (type === ClickType.Collapse
                  ? (e.isCollapsed = !e.isCollapsed)
                  : (e.selected = !e.selected))
            })
          return newValue
        })
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    const handleDataUpdate = (prev: IDepartmentKeyControl[]) => {
      const newValue = prev.filter((e) => !!e)
      const activeData = newValue.find((e) => e.key === departmentKeyValue.key)
      if (activeData) {
        valueArr.length > 0
          ? valueArr.forEach((item) => {
              recursiveSeachDeptOrUser(activeData.data, (user) => {
                user.selected = !!valueArr.find((e) => e.id === user.id)
              })
            })
          : recursiveSeachDeptOrUser(
              activeData.data,
              (user) => (user.selected = false)
            )
      }
      return newValue
    }
    if (clickName === "创建群组") {
      setGroupDeptUserSelectedList(valueArr)
      // 如果选择的department User list没有当前的用户之后置空群主选择
      setGroupOwner((prev) => {
        if (valueArr.some((item) => item.id === prev.id)) {
          return prev
        }
        return defaultGroupOwner
      })
      setGroupDeptUserList(handleDataUpdate)
    } else {
      setDepartmentSelectedList(valueArr)
      setDeptUserList(handleDataUpdate)
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
      : groupDeptUserSelectedList.length <= 1
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
            userList: groupDeptUserSelectedList.map(
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
              setGroupDeptUserList((prev) => {
                const newValue = prev.filter((x) => x)
                const hasData = newValue.find((x) => x.key === AppId)
                hasData &&
                  recursiveSeachDeptOrUser(hasData.data, (e) => {
                    e.selected = false
                  })
                return newValue
              })
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
    // 限制条件下发送列表部门列表变化同步到发送搜索选择列表
    !isLoading &&
      departmentKeyValue?.data.length > 0 &&
      setDepartmentSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e)
        recursiveDeptList(departmentKeyValue.data, newValue)
        return newValue
      })
  }, [departmentAndUserList])

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
      setDeptUserList(firstState.deptUserList)
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
      ? clickName === "选择发送目标"
        ? setDepartmentSelectedList((prev) =>
            handleData(prev, departmentAndUserList)
          )
        : setGroupDeptUserSelectedList((prev) =>
            handleData(prev, groupDeptUserList)
          )
      : // 关闭时清空上次选中数据
        (() => {
          setDepartmentSelectedList([])
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
    groupDeptUserSelectedList,
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
    setGroupDeptUserList,
    setGroupDeptUserSelectedList,
    setGroupName,
    setGroupOwner,
    handleTypeIsCanSelect,
    setIsShowDialog,
    setTagsValue,
    handleDeptOrUserClick,
    setSearchToDeptValue,
    handleCreateGroup,
    handleConfirm,
    handleCancel,
    onListBoxScrolling,
  }
}
export default useAction
