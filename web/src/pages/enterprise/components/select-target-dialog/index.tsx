import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import List from "@mui/material/List"
import Collapse from "@mui/material/Collapse"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Divider from "@mui/material/Divider"
import Autocomplete from "@mui/material/Autocomplete"
import Checkbox from "@mui/material/Checkbox"
import useAction from "./hook"
import styles from "./index.module.scss"

import {
  ClickType,
  DepartmentAndUserType,
  ITargetDialogProps,
  IDepartmentAndUserListValue,
  ITagsList,
} from "../../../../dtos/enterprise"
import { memo, useEffect } from "react"
import { CircularProgress, FilterOptionsState } from "@mui/material"

const fiteringDeptAndUsers = (
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

const SelectTargetDialog = memo(
  (props: ITargetDialogProps) => {
    const {
      open,
      departmentAndUserList,
      AppId,
      isLoading,
      tagsList,
      flattenDepartmentList,
      departmentKeyValue,
      setOpenFunction,
      setDeptUserList,
      setOuterTagsValue,
      lastTagsValue,
      isLoadStop,
    } = props

    const {
      departmentSelectedList,
      tagsValue,
      handleDeptOrUserClick,
      setSearchToDeptValue,
      setTagsValue,
    } = useAction({
      open,
      AppId,
      departmentKeyValue,
      departmentAndUserList,
      isLoading,
      setDeptUserList,
      setOuterTagsValue,
    })

    useEffect(() => {
      if (!!tagsList && !!lastTagsValue && lastTagsValue?.length > 0) {
        const selectTagsList: ITagsList[] = []
        lastTagsValue.forEach((item) => {
          const findItem = tagsList.find((i) => i.tagId === Number(item))
          if (!!findItem) {
            selectTagsList.push(findItem)
          }
        })

        setTagsValue(selectTagsList)
      }
    }, [tagsList, lastTagsValue])

    const recursiveRenderDeptList = (
      data: IDepartmentAndUserListValue[],
      pl: number
    ) => {
      const result = (
        <List key={AppId} dense>
          {data.map((deptUserData) => {
            const insertData: IDepartmentAndUserListValue = {
              id: deptUserData.id,
              name: deptUserData.name,
              type: deptUserData.type,
              parentid: String(deptUserData.parentid),
              selected: deptUserData.selected,
              canSelect: deptUserData.selected,
              children: [],
            }
            return (
              <div key={deptUserData.id}>
                <ListItemButton
                  sx={{ pl, height: "2.2rem" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    deptUserData.children.length > 0 &&
                      handleDeptOrUserClick(
                        ClickType.Collapse,
                        Object.assign(insertData, {
                          isCollapsed: deptUserData.isCollapsed,
                        })
                      )
                  }}
                >
                  {deptUserData.canSelect && (
                    <Checkbox
                      edge="start"
                      checked={deptUserData.selected}
                      tabIndex={-1}
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeptOrUserClick(ClickType.Select, insertData)
                      }}
                    />
                  )}
                  <ListItemText primary={deptUserData.name} />
                  {deptUserData.children.length > 0 &&
                    (!!deptUserData.isCollapsed ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
                {deptUserData.children.length > 0 && (
                  <Collapse
                    in={!!deptUserData.isCollapsed}
                    timeout={0}
                    unmountOnExit
                  >
                    {recursiveRenderDeptList(deptUserData.children, pl + 2)}
                  </Collapse>
                )}
              </div>
            )
          })}
          <Divider />
        </List>
      )
      return result
    }

    return (
      <div>
        <Dialog
          open={open}
          PaperProps={{
            sx: {
              overflowY: "unset",
            },
          }}
        >
          <DialogTitle>选择发送目标</DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            <div
              style={{
                height: "15rem",
                overflowY: "auto",
                position: "relative",
              }}
            >
              {departmentKeyValue?.data.length > 0 ? (
                recursiveRenderDeptList(departmentKeyValue.data, 0)
              ) : (
                <CircularProgress
                  style={{
                    position: "absolute",
                    width: "2rem",
                    height: "2rem",
                    left: "13rem",
                    top: "5.5rem",
                  }}
                />
              )}
            </div>

            {flattenDepartmentList && (
              <Autocomplete
                id="sreach-input"
                disablePortal
                openOnFocus
                multiple
                disableCloseOnSelect
                size="small"
                sx={{
                  margin: "1rem 0 1rem",
                }}
                componentsProps={{
                  popper: {
                    placement: "top",
                  },
                }}
                value={departmentSelectedList}
                options={flattenDepartmentList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.parentid as string}
                renderInput={(params) => (
                  <TextField {...params} label="部门与用户搜索" />
                )}
                onChange={(e, value) => {
                  value && setSearchToDeptValue(value)
                }}
                renderGroup={(params) => {
                  const { key, group, children } = params
                  return <div key={key}>{children}</div>
                }}
                filterOptions={(options, state) =>
                  fiteringDeptAndUsers(options, state)
                }
                renderOption={(props, option, state) => {
                  let style = Object.assign(
                    option.type === DepartmentAndUserType.Department
                      ? { color: "#666" }
                      : { paddingLeft: "2rem" },
                    { fontSize: "0.9rem" }
                  )
                  !option.canSelect && (props.onClick = () => {})
                  return (
                    <li {...props} style={style}>
                      {option.name}
                    </li>
                  )
                }}
              />
            )}

            <Autocomplete
              id="tags-list"
              disablePortal
              openOnFocus
              multiple
              disableCloseOnSelect
              disableClearable
              limitTags={2}
              size="small"
              value={tagsValue}
              options={tagsList}
              getOptionLabel={(option) => option.tagName}
              isOptionEqualToValue={(option, value) =>
                option.tagId === value.tagId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.InputButton}
                  margin="dense"
                  type="button"
                  label="标签列表"
                />
              )}
              onChange={(e, value) => {
                setTagsValue(value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenFunction(false)
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                setOpenFunction(false)
              }}
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.departmentAndUserList === nextProps.departmentAndUserList &&
      prevProps.departmentKeyValue === nextProps.departmentKeyValue &&
      prevProps.AppId === nextProps.AppId
    )
  }
)

export default SelectTargetDialog
