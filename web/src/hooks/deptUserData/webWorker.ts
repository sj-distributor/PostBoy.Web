import {
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDepartmentUsersData,
} from "../../dtos/enterprise"
import { IDeptUserWebWorkerProps } from "../../pages/enterprise/components/select-content/props"
import WebWorker from "../web-worker"

export const MyWorker = () => {
  function workerCode(this: Worker) {
    enum UpdateListType {
      Fold,
      Flatten,
      All,
    }
    enum DepartmentAndUserType {
      Department,
      User,
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

    const updateDeptUserList = (
      AppId: string,
      department: IDepartmentData,
      users: IDepartmentUsersData[],
      defaultChild: IDepartmentAndUserListValue,
      type: UpdateListType,
      copyDepartmentAndUserList: IDepartmentAndUserListValue[],
      copyFlattenDepartmentList: IDepartmentAndUserListValue[]
    ) => {
      type !== UpdateListType.Flatten &&
        recursiveDeptList(
          copyDepartmentAndUserList,
          defaultChild,
          department,
          []
        ).length === 0 &&
        copyDepartmentAndUserList.push(defaultChild)

      type !== UpdateListType.Fold &&
        copyFlattenDepartmentList.push(
          { ...defaultChild, children: [] },
          ...users.map((item) => ({
            id: item.userid,
            name: item.userid,
            parentid: department.name,
            type: DepartmentAndUserType.User,
            selected: false,
            isCollapsed: false,
            canSelect: true,
            children: [],
          }))
        )
    }

    const loadDeptUsers = ({
      AppId,
      workWeChatUnits,
    }: IDeptUserWebWorkerProps): {
      [index: string]: IDepartmentAndUserListValue[]
    } => {
      const copyDepartmentAndUserList: IDepartmentAndUserListValue[] = []

      const copyFlattenDepartmentList: IDepartmentAndUserListValue[] = []

      const copyDeptListResponse = workWeChatUnits.sort(
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
          isCollapsed: false,
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
          UpdateListType.Flatten,
          copyDepartmentAndUserList,
          copyFlattenDepartmentList
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
              UpdateListType.Fold,
              copyDepartmentAndUserList,
              copyFlattenDepartmentList
            )
          }
          continue
        }

        updateDeptUserList(
          AppId,
          department,
          users,
          defaultChild,
          UpdateListType.Fold,
          copyDepartmentAndUserList,
          copyFlattenDepartmentList
        )
      }
      return { copyDepartmentAndUserList, copyFlattenDepartmentList }
    }
    this.onmessage = function (e: MessageEvent) {
      const { copyDepartmentAndUserList, copyFlattenDepartmentList } =
        loadDeptUsers(e.data)

      this.postMessage({
        copyDepartmentAndUserList,
        copyFlattenDepartmentList,
      }) // 返回结果
    }
  }

  const myWorker = new WebWorker(workerCode)

  return myWorker
}
