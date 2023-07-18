import { clone, flatten } from "ramda"
import { useMemo, useState } from "react"
import {
  DepartmentAndUserType,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  IDepartmentUsersData,
  IDeptAndUserList,
  IDeptUserDataHookProp,
  ISearchList,
  UpdateListType,
} from "../../dtos/enterprise"

const useDeptUserData = ({ appId }: IDeptUserDataHookProp) => {
  // 部门和用户数组
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  //
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([])

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find((e) => e.key === appId)
    return result as IDepartmentKeyControl
  }, [departmentAndUserList, appId])

  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find((e) => e.key === appId)
    return result?.data as IDepartmentAndUserListValue[]
  }, [flattenDepartmentList, appId])

  const updateDeptUserList = (
    AppId: string,
    department: IDepartmentData,
    users: IDepartmentUsersData[],
    defaultChild: IDepartmentAndUserListValue,
    type: UpdateListType
  ) => {
    type !== UpdateListType.Flatten &&
      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev)
        const hasData = newValue.find((e) => e.key === AppId)
        let idList = []
        // 是否现有key的数据
        hasData && hasData.data.length > 0
          ? (idList = recursiveDeptList(
              hasData.data,
              defaultChild,
              department,
              []
            ))
          : newValue.push({ key: AppId, data: [defaultChild] })
        idList.length === 0 && hasData?.data.push(defaultChild)
        return newValue
      })

    type !== UpdateListType.Fold &&
      setFlattenDepartmentList((prev) => {
        const newValue = clone(prev)
        let hasData = newValue.find((e) => e.key === AppId)
        const insertData = [
          {
            id: department.id,
            name: department.name,
            parentid: department.name,
            type: DepartmentAndUserType.Department,
            selected: false,
            children: [],
          },
          ...flatten(
            users.map((item) => ({
              id: item.userid,
              name: item.userid,
              parentid: department.name,
              type: DepartmentAndUserType.User,
              selected: false,
              canSelect: true,
              children: [],
            }))
          ),
        ]

        hasData
          ? (hasData.data = [...hasData.data, ...insertData])
          : newValue.push({
              key: AppId,
              data: insertData,
            })
        return newValue
      })
  }

  const recursiveDeptList = (
    hasData: IDepartmentAndUserListValue[],
    defaultChild: IDepartmentAndUserListValue,
    department: IDepartmentData,
    parentRouteId: number[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      parentRouteId.push(Number(e.id))
      if (e.id === department.parentid) {
        e.children.push(defaultChild)
        return parentRouteId
      }
      if (e.children.length > 0) {
        const idList: number[] = recursiveDeptList(
          e.children,
          defaultChild,
          department,
          [...parentRouteId]
        )
        if (idList.length !== parentRouteId.length) return idList
        parentRouteId.pop()
      } else {
        parentRouteId.pop()
      }
    }
    return parentRouteId
  }

  const recursiveSearchDeptOrUser = (
    hasData: IDepartmentAndUserListValue[],
    callback: (e: IDepartmentAndUserListValue) => void
  ) => {
    for (const key in hasData) {
      callback(hasData[key])
      hasData[key].children.length > 0 &&
        recursiveSearchDeptOrUser(hasData[key].children, callback)
    }
    return hasData
  }

  const loadDeptUsers = (
    AppId: string,
    deptListResponse: IDeptAndUserList[]
  ) => {
    return new Promise((resolve, reject) => {
      const copyDeptListResponse = deptListResponse.sort(
        (a, b) => a.department.id - b.department.id
      )
      const waitList = new Map()
      for (let index = 0; index < copyDeptListResponse.length; index++) {
        // 当前的部门
        const department = copyDeptListResponse[index].department
        // 当前的用户列表
        const users = copyDeptListResponse[index].users
        // 需要插入的数据
        const defaultChild: IDepartmentAndUserListValue = {
          id: department.id,
          name: department.name,
          type: DepartmentAndUserType.Department,
          parentid: String(department.parentid),
          selected: false,
          children: users.map((item) => ({
            id: `${item.userid}`,
            name: item.userid,
            type: DepartmentAndUserType.User,
            parentid: item.department,
            selected: false,
            isCollapsed: false,
            canSelect: true,
            children: [],
          })),
        }

        updateDeptUserList(
          AppId,
          department,
          users,
          defaultChild,
          UpdateListType.Flatten
        )

        let isContinue: boolean = false

        if (waitList.size > 0) {
          for (let [key, value] of waitList) {
            value.department.parentid === department.id &&
              defaultChild.children.push(value.defaultChild) &&
              waitList.delete(key)
            if (key === department.parentid) {
              value.defaultChild.children.push(defaultChild)
              isContinue = true
              break
            }
          }
        }

        if (isContinue) continue

        if (department.parentid > department.id) {
          waitList.set(department.id, { defaultChild, department, users })
          if (index !== copyDeptListResponse.length - 1) continue
        }

        if (waitList.size > 0 && index === copyDeptListResponse.length - 1) {
          for (let [key, value] of waitList) {
            updateDeptUserList(
              AppId,
              value.department,
              value.users,
              value.defaultChild,
              UpdateListType.Fold
            )
          }
          continue
        }

        updateDeptUserList(
          AppId,
          department,
          users,
          defaultChild,
          UpdateListType.Fold
        )
      }
      resolve(true)
    })
  }

  return {
    departmentAndUserList,
    flattenDepartmentList,
    departmentKeyValue,
    searchKeyValue,
    setDepartmentAndUserList,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
    loadDeptUsers,
  }
}
export default useDeptUserData
