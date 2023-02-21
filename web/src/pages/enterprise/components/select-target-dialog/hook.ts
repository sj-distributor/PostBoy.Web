import { clone } from "ramda"
import { useEffect, useState } from "react"
import { PostWeChatWorkGroupCreate } from "../../../../api/enterprise"
import {
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList,
  IDepartmentKeyControl,
  ClickType,
  DeptUserCanSelectStatus,
  IWorkGroupCreate,
  IWorkCorpAppGroup
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
  setGroupArr: React.Dispatch<React.SetStateAction<IWorkCorpAppGroup[]>>
  setOpenFunction: (open: boolean) => void
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
}) => {
  const {
    departmentAndUserList,
    departmentKeyValue,
    AppId,
    open,
    isLoading,
    tagsList,
    clickName,
    setGroupArr,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    lastTagsValue
  } = props

  const defaultGroupOwner = {
    id: "-1",
    name: "No Option",
    type: DepartmentAndUserType.User,
    parentid: "",
    selected: false,
    children: []
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
    msg: ""
  })
  const [groupDeptUserList, setGroupDeptUserList] =
    useState<IDepartmentAndUserListValue[]>()

  const [createLoading, setCreateLoading] = useState(false)

  const recursiveSeachDeptOrUser = (
    hasData: IDepartmentAndUserListValue[],
    item: IDepartmentAndUserListValue,
    callback: (
      e: IDepartmentAndUserListValue,
      item: IDepartmentAndUserListValue
    ) => void
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      callback(e, item)
      e.children.length > 0 &&
        recursiveSeachDeptOrUser(e.children, item, callback)
    }
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
            children: []
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
            recursiveSeachDeptOrUser(
              activeData.data,
              clickedItem,
              (e, item) => {
                e.id === item.id &&
                  (type === ClickType.Collapse
                    ? (e.isCollapsed = !e.isCollapsed)
                    : (e.selected = !e.selected))
              }
            )
          return newValue
        })
      : setGroupDeptUserList((prev) => {
          const newValue = prev?.filter((e) => !!e)
          newValue &&
            recursiveSeachDeptOrUser(newValue, clickedItem, (e, item) => {
              e.id === item.id &&
                (type === ClickType.Collapse
                  ? (e.isCollapsed = !e.isCollapsed)
                  : (e.selected = !e.selected))
            })
          return newValue
        })
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    if (clickName === "创建群组") {
      setGroupDeptUserSelectedList(valueArr)
      // 如果选择的department User list没有当前的用户之后置空群主选择
      setGroupOwner((prev) => {
        if (valueArr.some((item) => item.id === prev.id)) {
          return prev
        }
        return defaultGroupOwner
      })
      setGroupDeptUserList((prev) => {
        const newValue = prev?.filter((e) => !!e)
        if (newValue) {
          valueArr.length > 0
            ? valueArr.forEach((item) => {
                recursiveSeachDeptOrUser(newValue, item, (user) => {
                  user.selected = !!valueArr.find((e) => e.id === user.id)
                })
              })
            : recursiveSeachDeptOrUser(
                newValue,
                newValue[0],
                (user) => (user.selected = false)
              )
        }
        return newValue
      })
    } else {
      setDepartmentSelectedList(valueArr)
      setDeptUserList((prev) => {
        const newValue = prev.filter((e) => !!e)
        const activeData = newValue.find(
          (e) => e.key === departmentKeyValue.key
        )
        if (activeData) {
          valueArr.length > 0
            ? valueArr.forEach((item) => {
                recursiveSeachDeptOrUser(activeData.data, item, (user) => {
                  user.selected = !!valueArr.find((e) => e.id === user.id)
                })
              })
            : recursiveSeachDeptOrUser(
                activeData.data,
                activeData.data[0],
                (user) => (user.selected = false)
              )
        }
        return newValue
      })
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
    !groupOwner?.id
      ? setTipsObject({ show: true, msg: "Please select a valid group owner" })
      : !groupName
      ? setTipsObject({ show: true, msg: "Please input a valid group name" })
      : groupDeptUserSelectedList.length <= 0
      ? setTipsObject({ show: true, msg: "Please select multiple valid users" })
      : !AppId
      ? setTipsObject({ show: true, msg: "Error for no AppId provided" })
      : (() => {
          requestData = {
            appId: AppId,
            name: groupName,
            owner: groupOwner.id as string,
            userList: groupDeptUserSelectedList.map((item) => item.id as string)
          }
          setOpenFunction(false)
          PostWeChatWorkGroupCreate(requestData).then((data) => {
            if (data && data.errmsg === "ok") {
              setTipsObject({ msg: "创建成功", show: true })
              setGroupArr((prev) => [
                ...prev,
                {
                  chatId: data.chatid,
                  chatName: groupName
                }
              ])
              setTimeout(() => {
                setCreateLoading(false)
              }, 500)
              // 清空数据
              setGroupDeptUserSelectedList([])
              setGroupOwner(defaultGroupOwner)
              setGroupName("")
            }
          })
        })()
  }

  useEffect(() => {
    // 限制条件下群组部门列表变化同步到群组搜索选择列表
    !isLoading &&
      groupDeptUserList &&
      groupDeptUserList.length > 0 &&
      setGroupDeptUserSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e)
        recursiveDeptList(groupDeptUserList, newValue)
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
    departmentAndUserList &&
      (!groupDeptUserList ||
        departmentKeyValue?.data[0] !== groupDeptUserList[0]) &&
      setGroupDeptUserList(clone(departmentKeyValue?.data))
  }, [departmentAndUserList, AppId])

  useEffect(() => {
    // 切换应用时清空上次应用数据
    setDepartmentSelectedList([])
    setTagsValue([])
  }, [AppId])

  useEffect(() => {
    setOuterTagsValue(tagsValue)
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
    handleCreateGroup
  }
}
export default useAction
