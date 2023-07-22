import { useMap } from "ahooks"
import { clone, difference, remove } from "ramda"
import { Key, useEffect, useState } from "react"
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"
import useDeptUserData from "../../hooks/deptUserData"
import { ITreeViewHookProps } from "./props"

const useAction = ({
  appId,
  defaultSelectedList,
  flattenData,
  foldData,
  idRouteMap,
  settingSelectedList,
}: ITreeViewHookProps) => {
  const {
    departmentAndUserList,
    flattenDepartmentList,
    departmentKeyValue,
    searchKeyValue,
    setDepartmentAndUserList,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
  } = useDeptUserData({ appId })

  const [selectedList, setSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [collapsedList, setCollapsedList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [foldList, setFoldList] = useState<IDepartmentAndUserListValue[]>(
    clone(foldData)
  )

  const [flattenList, setFlattenList] = useState<IDepartmentAndUserListValue[]>(
    clone(flattenData)
  )

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

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedItem: IDepartmentAndUserListValue,
    value?: boolean
  ) => {
    const idRouteArr = idRouteMap.get(
      String(
        clickedItem.type === DepartmentAndUserType.User
          ? clickedItem.parentid
          : clickedItem.name
      )
    )
    const data = [...foldList]
    const routeArr =
      idRouteArr && idRouteArr.idRoute ? [...idRouteArr.idRoute] : []
    let innerItem: IDepartmentAndUserListValue | undefined = data.find(
      (cell) => routeArr?.[0] === cell.id
    )
    routeArr.shift()
    routeArr.forEach((item) => {
      innerItem = innerItem?.children.find((cell) => cell.id === item)
    })
    innerItem =
      clickedItem.type === DepartmentAndUserType.Department
        ? innerItem
        : innerItem?.children.find((cell) => cell.id === clickedItem.id)
    innerItem &&
      (type === ClickType.Select
        ? (innerItem.selected = value ?? !innerItem.selected)
        : (innerItem.isCollapsed = !innerItem.isCollapsed))

    setFoldList(data)
    setSelectedList((prev) => {
      return clickedItem.selected
        ? remove(
            prev.findIndex((item) => item.id === clickedItem.id),
            1,
            prev
          )
        : [...prev, clickedItem]
    })
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    const diff = difference(valueArr, selectedList)
    const diffReverse = difference(selectedList, valueArr)
    diff.length > 0 &&
      diff.forEach((item) =>
        handleDeptOrUserClick(ClickType.Select, item, true)
      )
    diffReverse.length > 0 &&
      diffReverse.forEach((item) =>
        handleDeptOrUserClick(ClickType.Select, item, false)
      )

    setSelectedList(valueArr)
  }

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList)
  }, [selectedList])

  useEffect(() => {
    selectedList.forEach((item) => {
      // 同步到map数据
    })
  }, [defaultSelectedList])

  return {
    foldList,
    flattenList,
    selectedList,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
  }
}

export default useAction
