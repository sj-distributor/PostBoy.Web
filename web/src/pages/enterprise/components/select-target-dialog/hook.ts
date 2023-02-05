import { useEffect, useState } from "react"
import {
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList,
  IDepartmentKeyControl
} from "../../../../dtos/enterprise"

const useAction = (props: {
  departmentAndUserList: IDepartmentKeyControl[]
  departmentKeyValue: IDepartmentKeyControl
  AppId: string
  isLoading: boolean
  open: boolean
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentKeyControl[]>>
}) => {
  const {
    departmentAndUserList,
    departmentKeyValue,
    AppId,
    open,
    isLoading,
    setDeptUserList,
    setOuterTagsValue
  } = props
  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([])
  const [tagsValue, setTagsValue] = useState<ITagsList[]>([])

  const handleDeptOrUserClick = (clickedItem: IDepartmentAndUserListValue) => {
    let departmentIndex: number
    if (clickedItem.type === DepartmentAndUserType.Department) {
      departmentIndex = departmentKeyValue.data.findIndex(
        (e) => e.id === clickedItem.id
      )
      setDeptUserList((prev) => {
        const newValue = prev.filter((e) => !!e)
        const activeData = newValue.find(
          (e) => e.key === departmentKeyValue.key
        )
        if (activeData?.data) {
          activeData.data[departmentIndex].selected =
            !activeData.data[departmentIndex].selected
        }
        return newValue
      })
    } else {
      departmentIndex = departmentKeyValue.data.findIndex(
        (e) => e.name === clickedItem.parentid
      )
      const userIndex = departmentKeyValue.data[
        departmentIndex
      ].departmentUserList.findIndex((e) => e.userid === clickedItem.id)
      setDeptUserList((prev) => {
        const newValue = prev.filter((e) => !!e)
        const activeData = newValue.find(
          (e) => e.key === departmentKeyValue.key
        )
        if (activeData) {
          activeData.data[departmentIndex].departmentUserList[userIndex][
            "selected"
          ] =
            !activeData.data[departmentIndex].departmentUserList[userIndex][
              "selected"
            ]
        }
        return newValue
      })
    }
  }

  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    valueArr.length <= 0
      ? setDepartmentSelectedList([])
      : setDepartmentSelectedList(valueArr)

    setDeptUserList((prev) => {
      const newValue = prev.filter((e) => !!e)
      const activeData = newValue.find((e) => e.key === departmentKeyValue.key)
      if (activeData) {
        activeData.data.forEach((department) => {
          department.departmentUserList.forEach((user) => {
            if (valueArr.find((e) => e.id === user.userid)) {
              user.selected = true
            } else {
              user.selected = false
            }
          })
        })
      }
      return newValue
    })
  }

  useEffect(() => {
    departmentKeyValue?.data.length > 0 &&
      !isLoading &&
      setDepartmentSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e)
        departmentKeyValue.data.forEach((department) => {
          department.departmentUserList.forEach((user) => {
            const hasItemIndex = newValue.findIndex(
              (item) => item.id === user.userid
            )
            user.selected
              ? hasItemIndex <= -1 &&
                newValue.push({
                  id: user.userid,
                  name: user.name,
                  parentid: department.name
                })
              : hasItemIndex > -1 &&
                newValue[hasItemIndex].parentid === department.name &&
                newValue.splice(hasItemIndex, 1)
          })
        })
        return newValue
      })
  }, [departmentAndUserList])

  useEffect(() => {
    setDepartmentSelectedList([])
    setTagsValue([])
  }, [AppId])

  useEffect(() => {
    setOuterTagsValue(tagsValue)
  }, [open])

  return {
    departmentSelectedList,
    tagsValue,
    setTagsValue,
    handleDeptOrUserClick,
    setSearchToDeptValue
  }
}
export default useAction
