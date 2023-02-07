import { useEffect, useState } from "react"
import {
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList,
  IDepartmentKeyControl,
  ClickType
} from "../../../../dtos/enterprise"

const useAction = (props: {
  departmentAndUserList: IDepartmentKeyControl[]
  departmentKeyValue: IDepartmentKeyControl
  AppId: string
  isLoading: boolean
  open: boolean
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
}) => {
  const {
    departmentAndUserList,
    departmentKeyValue,
    AppId,
    open,
    isLoading,
    setDeptUserList,
    setOuterTagsValue
  } = props
  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

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
      if (e.children.length > 0) {
        recursiveSeachDeptOrUser(e.children, item, callback)
      }
    }
    return
  }

  const handleDeptOrUserClick = (
    type: ClickType,
    clickedItem: IDepartmentAndUserListValue
  ) => {
    setDeptUserList((prev) => {
      const newValue = prev.filter((e) => !!e)
      const activeData = newValue.find((e) => e.key === departmentKeyValue.key)
      activeData &&
        recursiveSeachDeptOrUser(activeData.data, clickedItem, (e, item) => {
          if (e.id === item.id) {
            if (type === ClickType.Collapse) {
              e.isCollapsed = !e.isCollapsed
            } else {
              e.selected = !e.selected
            }
          }
        })
      return newValue
    })
  }

  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    valueArr.length <= 0
      ? setDepartmentSelectedList([])
      : setDepartmentSelectedList(valueArr)

    setDeptUserList((prev) => {
      const newValue = prev.filter((e) => !!e)
      const activeData = newValue.find((e) => e.key === departmentKeyValue.key)
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
              (user) => {
                user.selected = false
              }
            )
      }
      return newValue
    })
  }

  useEffect(() => {
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
      return
    }
    departmentKeyValue?.data.length > 0 &&
      !isLoading &&
      setDepartmentSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e)
        recursiveDeptList(departmentKeyValue.data, newValue)
        return newValue
      })
  }, [departmentAndUserList])

  useEffect(() => {
    setDepartmentSelectedList([])
    setTagsValue([])
  }, [AppId])

  useEffect(() => {
    setOuterTagsValue(tagsValue)
  }, [open])

  return {
    departmentSelectedList,
    tagsValue,
    setTagsValue,
    handleDeptOrUserClick,
    setSearchToDeptValue
  }
}
export default useAction
