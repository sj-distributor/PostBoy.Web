import { clone, flatten, uniqWith } from "ramda"
import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetTagsList,
} from "../../../../api/enterprise"
import {
  DepartmentAndUserType,
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentKeyControl,
  ISearchList,
  ITagsList,
  PictureText,
} from "../../../../dtos/enterprise"
import { convertBase64 } from "../../../../uilts/convert-base64"
import { SelectContentHookProps } from "./props"

export const useAction = (props: SelectContentHookProps) => {
  const {
    corpsValue,
    corpAppValue,
    setCorpsValue,
    setCorpAppValue,
    setSendObject,
    setFile,
    setPictureText,
    title,
    content,
  } = props

  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  const [tagsList, setTagsList] = useState<ITagsList[]>([])

  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    ISearchList[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)

  const [cronError, setCronError] = useState<string>("")

  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([])

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

  const loadDeptUsers = async (
    departmentPage: number,
    AppId: string,
    deptListResponse: IDepartmentData[]
  ) => {
    for (let index = departmentPage; index < deptListResponse.length; index++) {
      const department = deptListResponse[index]
      // referIndexList储存从嵌套数组顶部到当前部门的ID路径
      let referIndexList: number[] = []
      const defaultChild = {
        id: department.id,
        name: department.name,
        type: DepartmentAndUserType.Department,
        parentid: String(department.parentid),
        selected: false,
        children: [],
      }
      setDepartmentAndUserList((prev) => {
        const newValue = clone(prev)
        const hasData = newValue.find((e) => e.key === AppId)
        if (hasData && hasData.data.length > 0) {
          // 实现查找parentid等于当前部门id后插入chilrden
          const idList = recursiveDeptList(
            hasData.data,
            defaultChild,
            department,
            []
          )
          referIndexList = referIndexList.concat(idList, [department.id])
        } else {
          referIndexList = referIndexList.concat(department.id)
          newValue.push({ key: AppId, data: [defaultChild] })
        }
        return newValue
      })

      const userList = await GetDepartmentUsersList({
        AppId,
        DepartmentId: department.id,
      })
      if (!!userList && userList.errcode === 0) {
        setDepartmentAndUserList((prev) => {
          const newValue = clone(prev)
          const hasData = newValue.find((e) => e.key === AppId)
          if (hasData) {
            let result: IDepartmentAndUserListValue | undefined
            referIndexList.forEach((number, index) => {
              if (index !== 0) {
                result = result?.children.find((item) => number === item.id)
              } else {
                result = hasData.data.find(
                  (item) => referIndexList[0] === item.id
                )
              }
            })
            if (result)
              result.children = userList.userlist.map((e) => ({
                id: e.userid,
                name: e.name,
                type: DepartmentAndUserType.User,
                parentid: String(department.id),
                selected: false,
                children: [],
              }))
          }
          return newValue
        })
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
              userList.userlist.map((item) => ({
                id: item.userid,
                name: item.name,
                parentid: department.name,
                type: DepartmentAndUserType.User,
                selected: false,
                children: [],
              }))
            ),
          ]
          if (hasData) {
            hasData.data = [...hasData.data, ...insertData]
          } else {
            newValue.push({
              key: AppId,
              data: insertData,
            })
          }
          return newValue
        })
        index === deptListResponse.length - 1 && setIsTreeViewLoading(false)
      }
    }
  }

  const recursiveGetSelectedList = (
    hasData: IDepartmentAndUserListValue[],
    selectedList: IDepartmentAndUserListValue[]
  ) => {
    for (const key in hasData) {
      const e = hasData[key]
      if (e.selected) {
        selectedList.push(e)
      }
      if (e.children.length > 0) {
        selectedList = recursiveGetSelectedList(e.children, [...selectedList])
      }
    }
    return selectedList
  }

  const fileUpload = async (files: FileList, type: string) => {
    if (type === "图文") {
      const objectList: PictureText[] = []
      Array.from(files).forEach(async (item) => {
        const base64 = await convertBase64(item)
        objectList.push({
          title: title,
          author: "",
          digest: "",
          content: content,
          fileContent: (base64 as string).split("base64,")[1],
          contentSourceUrl: "",
        })
      })
      setPictureText(objectList)
    } else {
      const file = files[0]
      const base64 = await convertBase64(file)
      setFile((prev) => ({
        ...prev,
        fileName: file.name,
        fileContent: (base64 as string).split("base64,")[1],
      }))
    }
  }

  useEffect(() => {
    const selectedList = uniqWith(
      (a: IDepartmentAndUserListValue, b: IDepartmentAndUserListValue) => {
        return a.id === b.id
      }
    )(recursiveGetSelectedList(departmentKeyValue?.data, []))

    setSendObject({
      toUsers: selectedList
        .filter((e) => e.type === DepartmentAndUserType.User)
        .map((e) => String(e.id)),
      toParties: selectedList
        .filter((e) => e.type === DepartmentAndUserType.Department)
        .map((e) => String(e.id)),
    })
  }, [departmentAndUserList])

  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        const array: { id: string; corpName: string }[] = []
        data.forEach((item) =>
          array.push({ id: item.id, corpName: item.corpName })
        )
        setCorpsList(array)
      }
    })
  }, [])

  useEffect(() => {
    if (corpsValue === undefined) {
      setCorpsValue(corpsList[0])
    }
  }, [corpsList])

  useEffect(() => {
    corpsValue !== undefined &&
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        if (corpAppResult) {
          const array: { id: string; name: string; appId: string }[] = []
          corpAppResult.forEach((item) =>
            array.push({
              id: item.id,
              name: item.name,
              appId: item.appId,
            })
          )

          setCorpAppList(array)
          !!corpAppValue &&
            GetTagsList({ AppId: corpAppValue.appId }).then((tagsData) => {
              tagsData &&
                tagsData.errcode === 0 &&
                setTagsList(tagsData.taglist)
            })
        }
      })
  }, [corpsValue?.id])

  useEffect(() => {
    if (corpAppValue === undefined) {
      setCorpAppValue(corpAppList[0])
    }
  }, [corpAppList])

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result as IDepartmentKeyControl
  }, [departmentAndUserList])

  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find(
      (e) => e.key === corpAppValue?.appId
    )
    return result?.data as IDepartmentAndUserListValue[]
  }, [flattenDepartmentList])

  useEffect(() => {
    setDepartmentAndUserList([])
    setFlattenDepartmentList([])
    const loadDepartment = async (AppId: string) => {
      const deptListResponse = await GetDepartmentList({ AppId })
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        loadDeptUsers(0, AppId, deptListResponse.department)
      }
    }
    if (!!corpAppValue) {
      setIsTreeViewLoading(true)
      loadDepartment(corpAppValue.appId)
    }
  }, [corpAppValue?.appId])

  return {
    corpsList,
    corpAppList,
    departmentKeyValue,
    searchKeyValue,
    isTreeViewLoading,
    tagsList,
    setCronError,
    departmentAndUserList,
    setDepartmentAndUserList,
    fileUpload,
  }
}
