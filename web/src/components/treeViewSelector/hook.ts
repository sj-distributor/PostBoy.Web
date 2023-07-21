import { useMap } from "ahooks"
import { clone } from "ramda"
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
    // setFoldList((prev) => {
    //   const newValue = prev.slice()

    //   recursiveSearchDeptOrUser(newValue, (e) => {
    //     e.id === clickedItem.id &&
    //       (type === ClickType.Collapse
    //         ? (e.isCollapsed = !e.isCollapsed)
    //         : (e.selected = !e.selected))
    //   })
    //   return newValue
    // })
    const idRouteArr = idRouteMap.get(
      Number(
        clickedItem.type === DepartmentAndUserType.User
          ? clickedItem.parentid
          : clickedItem.id
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

    console.log(data)
    setFoldList(data)
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    setSelectedList(valueArr)
    valueArr.forEach((item) => {
      handleDeptOrUserClick(ClickType.Select, item)
    })
    // setFoldList((prev) => {
    //   const newValue = prev.slice()
    //   recursiveSearchDeptOrUser(newValue, (user) => {
    //     user.selected = !!valueArr.find((e) => e.id === user.id)
    //   })
    //   return newValue
    // })
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
