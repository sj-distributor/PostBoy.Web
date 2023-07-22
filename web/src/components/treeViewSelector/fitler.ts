import { FilterOptionsState } from "@mui/material"
import { IDepartmentAndUserListValue } from "../../dtos/enterprise"

export const onFilterDeptAndUsers = (
  options: IDepartmentAndUserListValue[],
  state: FilterOptionsState<IDepartmentAndUserListValue>
) => {
  if (state.inputValue !== "") {
    const array: IDepartmentAndUserListValue[] = []
    const findArray = options.filter((item) =>
      item.name.toUpperCase().includes(state.inputValue.toUpperCase())
    )
    for (let i = 0; i < findArray.length; i++) {
      array.unshift(findArray[i])
      const findParent = options.find(
        (item) => item.id === Number(findArray[i].parentid)
      )
      findParent && array.unshift(findParent)
    }
    return array
  }
  return options
}
