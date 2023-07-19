import { useMemo, useState } from "react"
import {
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  IDeptAndUserList,
  IDeptUserDataHookProp,
  ISearchList,
} from "../../dtos/enterprise"
import { MyWorker } from "./webWorker"

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

  const loadDeptUsersFromWebWorker = (data: {
    AppId: string
    workWeChatUnits: IDeptAndUserList[]
  }) => {
    return new Promise((resolve) => {
      const worker = MyWorker()

      worker.postMessage(data)

      worker.onmessage = function (this: Worker, ev: MessageEvent<any>) {
        const { copyDepartmentAndUserList, copyFlattenDepartmentList } = ev.data

        setDepartmentAndUserList((prev) => [
          ...prev,
          { key: data.AppId, data: copyDepartmentAndUserList },
        ])
        setFlattenDepartmentList((prev) => [
          ...prev,
          { key: data.AppId, data: copyFlattenDepartmentList },
        ])

        resolve(true)

        worker.terminate()
      }
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
