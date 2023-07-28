import { useMap } from "ahooks"
import { useMemo, useState } from "react"
import {
  DepartmentAndUserType,
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  IDeptAndUserList,
  IDeptUserDataHookProp,
  ISearchList,
} from "../../dtos/enterprise"

const useDeptUserData = ({ appId }: IDeptUserDataHookProp) => {
  // 部门和用户数组
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])
  //
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentKeyControl[]
  >([])

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find((e) => e.key === appId)
    return result as IDepartmentKeyControl
  }, [departmentAndUserList, appId])

  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find((e) => e.key === appId)
    return result?.data as IDepartmentAndUserListValue[]
  }, [flattenDepartmentList, appId])

  const recursiveSearchDeptOrUser = (
    dataList: IDepartmentAndUserListValue[],
    callback: (e: IDepartmentAndUserListValue) => void
  ) => {
    for (const key in dataList) {
      callback(dataList[key])
      dataList[key].children.length > 0 &&
        recursiveSearchDeptOrUser(dataList[key].children, callback)
    }
    return dataList
  }

  const recursiveTransformList = (
    sourceList: IDeptAndUserList[],
    resultList: IDepartmentAndUserListValue[],
    flattenList: IDepartmentAndUserListValue[],
    idRoute: number[]
  ): IDepartmentAndUserListValue[] => {
    sourceList.forEach((source) => {
      const department: IDepartmentAndUserListValue = {
        id: source.department.id,
        name: source.department.name,
        type: DepartmentAndUserType.Department,
        parentid: source.department.parentid,
        selected: false,
        isCollapsed: false,
        idRoute: [...idRoute, source.department.id],
        children: [],
      }
      const users = source.users.map((user) => ({
        id: user.userid,
        name: user.userid,
        type: DepartmentAndUserType.User,
        parentid: user.department,
        selected: false,
        isCollapsed: false,
        idRoute: [...idRoute, source.department.id],
        children: [],
      }))
      department.children.push(...users)
      flattenList.push({ ...department }, ...users)
      resultList.unshift(department)
      source.childrens.length > 0 &&
        recursiveTransformList(
          source.childrens,
          department.children,
          flattenList,
          [...idRoute, source.department.id]
        )
    })

    return resultList
  }

  const loadDeptUsersFromWebWorker = (data: {
    AppId: string
    workWeChatUnits: IDeptAndUserList[]
  }) => {
    const flattenList: IDepartmentAndUserListValue[] = []
    const dataList = recursiveTransformList(
      data.workWeChatUnits,
      [],
      flattenList,
      []
    )
    return new Promise((resolve) => {
      setDepartmentAndUserList((prev) => [
        ...prev,
        { key: data.AppId, data: dataList },
      ])
      setFlattenDepartmentList((prev) => [
        ...prev,
        {
          key: data.AppId,
          data: flattenList,
        },
      ])
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
    loadDeptUsersFromWebWorker,
  }
}
export default useDeptUserData
