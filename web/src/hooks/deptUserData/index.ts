import { useMap } from "ahooks"
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

  const [idRouteMap, { setAll: idRouteMapSetAll }] = useMap<
    number,
    IDepartmentAndUserListValue
  >()

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

  const loadDeptUsersFromWebWorker = (data: {
    AppId: string
    workWeChatUnits: IDeptAndUserList[]
  }) => {
    return new Promise((resolve) => {
      const worker = MyWorker()

      worker.postMessage(data)

      worker.onmessage = function (this: Worker, ev: MessageEvent<any>) {
        const {
          copyDepartmentAndUserList,
          copyFlattenDepartmentList,
          idRouteMap,
        } = ev.data

        setDepartmentAndUserList((prev) => [
          ...prev,
          { key: data.AppId, data: copyDepartmentAndUserList },
        ])
        setFlattenDepartmentList((prev) => [
          ...prev,
          { key: data.AppId, data: copyFlattenDepartmentList },
        ])

        idRouteMapSetAll(idRouteMap)

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
    idRouteMap,
    setDepartmentAndUserList,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
    loadDeptUsersFromWebWorker,
  }
}
export default useDeptUserData
