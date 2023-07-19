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
      array.push(findArray[i])
      const findParent = options.find(
        (item) => item.name === findArray[i].parentid
      )
      if (!!findParent) {
        const index = array.findIndex(
          (item) => item.name === findArray[i].parentid
        )
        if (index === -1) {
          const index = array.findIndex(
            (item) => item.parentid === findParent.name
          )
          array.splice(index, 0, findParent)
        }
      }
    }
    return array
  }
  return options
}
