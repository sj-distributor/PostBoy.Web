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

  function findNodeByIdRoute(
    node: IDepartmentAndUserListValue,
    idRoute: number[]
  ): IDepartmentAndUserListValue | undefined {
    if (idRoute.length === 0 || node.id !== idRoute[0]) {
      return undefined
    }

    if (idRoute.length === 1 && idRoute[0] === node.id) {
      return node
    }

    for (const child of node.children) {
      const foundNode = findNodeByIdRoute(child, idRoute.slice(1))
      if (foundNode) {
        return foundNode
      }
    }

    return undefined
  }

  // 处理部门列表点击选择或者展开
  const handleDeptOrUserClick = (
    type: ClickType,
    clickedItem: IDepartmentAndUserListValue,
    value?: boolean
  ) => {
    const idRouteItem = idRouteMap.get(
      Number(
        clickedItem.type === DepartmentAndUserType.User
          ? clickedItem.parentid
          : clickedItem.id
      )
    )

    const copyFoldList: IDepartmentAndUserListValue[] = foldList.map(
      (item) => ({ ...item })
    )

    console.log(
      clickedItem.type === DepartmentAndUserType.User
        ? clickedItem.parentid
        : clickedItem.id,
      idRouteMap,
      idRouteItem,
      copyFoldList
    )

    const routeArr = idRouteItem?.idRoute ?? []

    const innerItem: IDepartmentAndUserListValue | undefined =
      findNodeByIdRoute(copyFoldList[0], routeArr)

    const finalInnerItem =
      clickedItem.type === DepartmentAndUserType.Department
        ? innerItem
        : innerItem?.children.find((cell) => cell.id === clickedItem.id)

    finalInnerItem &&
      (type === ClickType.Select
        ? (finalInnerItem.selected = value ?? !finalInnerItem.selected)
        : (finalInnerItem.isCollapsed = !finalInnerItem.isCollapsed))

    setFoldList(copyFoldList)
    setSelectedList((prev) => {
      return type === ClickType.Select
        ? clickedItem.selected
          ? remove(
              prev.findIndex((item) => item.id === clickedItem.id),
              1,
              prev
            )
          : [...prev, clickedItem]
        : prev
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
