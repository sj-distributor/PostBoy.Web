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
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import Autocomplete from "@mui/material/Autocomplete"
import Checkbox from "@mui/material/Checkbox"
import useAction from "./hook"
import styles from "./index.module.scss"

import {
  DepartmentAndUserType,
  IDepartmentUsersData,
  ITargetDialogProps,
} from "../../../../dtos/enterprise"
import { memo } from "react"
import { debounce } from "ts-debounce"

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
      listScroll,
      setOuterTagsValue,
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

    return (
      <div>
        <Dialog
          open={open}
          PaperProps={{
            sx: {
              overflowY: "unset",
            },
          }}
          onClose={() => {
            setOpenFunction(false)
          }}
        >
          <DialogTitle>选择发送目标</DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            {departmentKeyValue?.data &&
            departmentKeyValue.data.length > 0 &&
            !isLoading ? (
              <div
                style={{ height: "15rem", overflowY: "auto" }}
                onScroll={(e) => {
                  debounce(listScroll, 1200)(
                    (e.target as HTMLDivElement).scrollHeight,
                    (e.target as HTMLDivElement).scrollTop,
                    (e.target as HTMLDivElement).clientHeight
                  )
                }}
              >
                <List dense>
                  {departmentKeyValue?.data &&
                    departmentKeyValue.data.map(
                      (department, departmentIndex: number) => {
                        return (
                          <div key={departmentIndex}>
                            <ListItemButton
                              sx={{ height: "2.2rem" }}
                              onClick={() => {
                                handleDeptOrUserClick({
                                  id: department.id,
                                  name: department.name,
                                  type: DepartmentAndUserType.Department,
                                  parentid: department.parentid,
                                })
                              }}
                            >
                              <Checkbox
                                edge="start"
                                checked={department.selected}
                                tabIndex={-1}
                                disableRipple
                              />
                              <ListItemText primary={department.name} />
                              {!!department.selected ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>

                            {department.departmentUserList && (
                              <Collapse
                                in={!!department.selected}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding dense>
                                  {department.departmentUserList.map(
                                    (
                                      user: IDepartmentUsersData,
                                      userIndex: number
                                    ) => (
                                      <ListItemButton
                                        key={userIndex}
                                        selected={!!user.selected}
                                        sx={{ pl: 4, height: "2.2rem" }}
                                        onClick={(e) => {
                                          handleDeptOrUserClick({
                                            id: user.userid,
                                            name: user.name,
                                            type: DepartmentAndUserType.User,
                                            parentid: department.name,
                                          })
                                        }}
                                      >
                                        <Checkbox
                                          edge="start"
                                          checked={user.selected}
                                          tabIndex={-1}
                                          disableRipple
                                        />
                                        <ListItemText primary={user.name} />
                                      </ListItemButton>
                                    )
                                  )}
                                </List>
                              </Collapse>
                            )}
                          </div>
                        )
                      }
                    )}
                </List>
                <Divider />
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            )}

            <Autocomplete
              id="sreach-input"
              disablePortal
              openOnFocus
              multiple
              disableCloseOnSelect
              limitTags={2}
              sx={{
                margin: "1rem 0 1rem",
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
            />

            <Autocomplete
              id="tags-list"
              disablePortal
              openOnFocus
              multiple
              disableCloseOnSelect
              disableClearable
              limitTags={2}
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
      prevProps.departmentAndUserList === nextProps.departmentAndUserList
    )
  }
)

export default SelectTargetDialog
