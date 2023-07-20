import { useMap } from "ahooks"
import { useEffect, useState } from "react"
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
} from "../../dtos/enterprise"
import useDeptUserData from "../../hooks/deptUserData"
import { ISelectedItem, ITreeViewHookProps } from "./props"

const useAction = ({
  appId,
  defaultSelectedList,
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
    loadDeptUsersFromWebWorker,
  } = useDeptUserData({ appId })

  const [
    sourceMap,
    { set: sourceMapSetter, get: sourceMapGetter, setAll: sourceMapSetAll },
  ] = useMap<string, IDepartmentAndUserListValue>()

  const [selectedList, setSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [collapsedList, setCollapsedList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [defaultFold, setDefaultFold] = useState<IDepartmentAndUserListValue[]>(
    []
  )

  const [flattenList, setFlattenList] = useState<IDepartmentAndUserListValue[]>(
    []
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
    clickedItem: IDepartmentAndUserListValue
  ) => {
    type === ClickType.Collapse
      ? sourceMapSetter(String(clickedItem.id), clickedItem)
      : sourceMapSetter(String(clickedItem.id), clickedItem)
  }

  // 搜索框变化时同步到部门列表
  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    setSelectedList(valueArr)
  }

  useEffect(() => {
    flattenList.forEach((item) => {
      sourceMapSetter(String(item.id), item)
    })
  }, [])

  useEffect(() => {
    // 同步外部selectedList
    settingSelectedList(selectedList)
  }, [selectedList])

  return {
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
    sourceMapGetter,
  }
}

export default useAction
