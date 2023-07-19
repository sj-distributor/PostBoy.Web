import { useState } from "react"
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"
import useDeptUserData from "../../hooks/deptUserData"
import { ISelectedItem, ITreeViewHookProps } from "./props"

const useAction = ({ appId }: ITreeViewHookProps) => {
  const {
    departmentAndUserList,
    flattenDepartmentList,
    departmentKeyValue,
    searchKeyValue,
    setDepartmentAndUserList,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
    loadDeptUsersFromWebWorker,
  } = useDeptUserData({ appId })

  const [selectedList, setSelectedList] = useState<ISelectedItem[]>([])

  const [defaultFold, setDefaultFold] = useState<IDepartmentAndUserListValue[]>(
    []
  )

  const [defaultFlatten, setDefaultFlatten] = useState<
    IDepartmentAndUserListValue[]
  >([])

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
    clickedItem: IDepartmentAndUserListValue
  ) => {
    setDefaultFold((prev) => {
      const newValue = prev.filter((e) => !!e)
      newValue &&
        recursiveSearchDeptOrUser(newValue, (e) => {
          e.id === clickedItem.id &&
            (type === ClickType.Collapse
              ? (e.isCollapsed = !e.isCollapsed)
              : (e.selected = !e.selected))
        })
      return newValue
    })
  }

  return {
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
  }
}

export default useAction
