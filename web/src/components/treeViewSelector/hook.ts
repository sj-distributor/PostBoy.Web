import { clone, difference, remove } from "ramda"
import { useEffect, useState } from "react"
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
  >(defaultSelectedList ?? [])

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
    clickedList: IDepartmentAndUserListValue | IDepartmentAndUserListValue[],
    value?: boolean
  ) => {
    const clickedItem = !Array.isArray(clickedList)
      ? clickedList
      : clickedList[0]
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

    const copyFoldList: IDepartmentAndUserListValue[] = foldList.map(
      (item) => ({ ...item })
    )

    clickedList = Array.isArray(clickedList) ? clickedList : [clickedList]

    for (const clickedItem of clickedList) {
      const routeArr = clickedItem.idRoute ?? []

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
    }

    setFoldList(copyFoldList)
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    const diff = difference(valueArr, selectedList)
    const diffReverse = difference(selectedList, valueArr)

    diff.length > 0 && handleDeptOrUserClick(ClickType.Select, diff, true)
    diffReverse.length > 0 &&
      handleDeptOrUserClick(ClickType.Select, diffReverse, false)

    setSelectedList(valueArr)
  }

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList)
  }, [selectedList])

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