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
  DeptUserCanSelectStatus,
  SendObjOrGroup
} from "../../../../dtos/enterprise"
import { CircularProgress, Snackbar, FilterOptionsState } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { memo } from "react"

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
      groupList,
      canSelect,
      lastTagsValue,
      clickName,
      chatId,
      sendType,
      setSendType,
      setIsRefresh,
      setChatId,
      setGroupList,
      setOpenFunction,
      setDeptUserList,
      setOuterTagsValue
    } = props

    const {
      departmentSelectedList,
      tagsValue,
      isShowDialog,
      groupOwner,
      groupName,
      tipsObject,
      groupDeptUserSelectedList,
      defaultGroupOwner,
      groupDeptUserList,
      createLoading,
      sendList,
      setGroupName,
      setGroupOwner,
      setIsShowDialog,
      handleDeptOrUserClick,
      setSearchToDeptValue,
      setTagsValue,
      handleTypeIsCanSelect,
      handleCreateGroup
    } = useAction({
      open,
      AppId,
      departmentKeyValue,
      departmentAndUserList,
      isLoading,
      lastTagsValue,
      tagsList,
      clickName,
      setIsRefresh,
      setOpenFunction,
      setDeptUserList,
      setOuterTagsValue
    })

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
              children: []
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
                          isCollapsed: deptUserData.isCollapsed
                        })
                      )
                  }}
                >
                  {handleTypeIsCanSelect(canSelect, deptUserData.type) && (
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
        <Dialog open={open} PaperProps={{ sx: { overflowY: "unset" } }}>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "4rem"
            }}
          >
            <>{clickName}</>
            {clickName === "选择发送目标" && (
              <Button variant="outlined" onClick={() => setIsShowDialog(true)}>
                创建群组
              </Button>
            )}
          </DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            <div
              style={{
                height: "15rem",
                overflowY: "auto",
                position: "relative",
                marginBottom: "1rem"
              }}
            >
              {(clickName === "选择发送目标"
                ? departmentKeyValue?.data.length > 0 &&
                  recursiveRenderDeptList(departmentKeyValue.data, 0)
                : groupDeptUserList &&
                  groupDeptUserList.length > 0 &&
                  (() => {
                    const activeData = groupDeptUserList.find(
                      (x) => x.key === AppId
                    )
                    return (
                      activeData && recursiveRenderDeptList(activeData.data, 0)
                    )
                  })()) || (
                <CircularProgress
                  style={{
                    position: "absolute",
                    width: "2rem",
                    height: "2rem",
                    left: "50%",
                    top: "50%",
                    margin: "-1rem 0 0 -1rem"
                  }}
                />
              )}
            </div>
            {clickName === "选择发送目标" && (
              <Autocomplete
                disableClearable
                fullWidth
                id="type-simple-select"
                value={sendType}
                size="small"
                options={sendList}
                getOptionLabel={(x) =>
                  x === SendObjOrGroup.Group ? "群组" : "对象"
                }
                onChange={(e, value) => {
                  setSendType && setSendType(value)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.InputButton}
                    margin="dense"
                    type="button"
                  />
                )}
              />
            )}

            {clickName === "选择发送目标" &&
            sendType !== SendObjOrGroup.Object ? (
              <></>
            ) : (
              flattenDepartmentList && (
                <Autocomplete
                  id={"sreach-input" + clickName}
                  disablePortal
                  openOnFocus
                  multiple
                  disableCloseOnSelect
                  size="small"
                  sx={{
                    margin:
                      clickName === "选择发送目标"
                        ? "1rem 0 calc(1rem - 4px)"
                        : ""
                  }}
                  componentsProps={{
                    paper: { elevation: 3 },
                    popper: {
                      placement: "top"
                    }
                  }}
                  value={
                    clickName === "选择发送目标"
                      ? departmentSelectedList
                      : groupDeptUserSelectedList
                  }
                  options={flattenDepartmentList}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  groupBy={(option) => option.parentid as string}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        clickName === "选择发送目标"
                          ? "部门与用户搜索"
                          : "用户搜索"
                      }
                    />
                  )}
                  filterOptions={(options, state) =>
                    fiteringDeptAndUsers(options, state)
                  }
                  onChange={(e, value) => value && setSearchToDeptValue(value)}
                  renderGroup={(params) => {
                    const { key, group, children } = params
                    return <div key={key}>{children}</div>
                  }}
                  renderOption={(props, option, state) => {
                    let style = Object.assign(
                      option.type === DepartmentAndUserType.Department
                        ? { color: "#666" }
                        : { paddingLeft: "2rem" },
                      { fontSize: "0.9rem" }
                    )
                    !handleTypeIsCanSelect(canSelect, option.type) &&
                      (props.onClick = () => {})
                    return (
                      <li {...props} style={style}>
                        {option.name}
                      </li>
                    )
                  }}
                />
              )
            )}

            {clickName === "选择发送目标" ? (
              <>
                {sendType === SendObjOrGroup.Group && (
                  <Autocomplete
                    id="group-list"
                    disablePortal
                    openOnFocus
                    size="small"
                    sx={{ margin: "1rem 0 0" }}
                    componentsProps={{
                      paper: { elevation: 3 },
                      popper: {
                        placement: "top"
                      }
                    }}
                    value={
                      chatId
                        ? groupList.filter((x) => x.chatId === chatId)[0]
                        : null
                    }
                    options={groupList}
                    getOptionLabel={(option) => option.chatName}
                    isOptionEqualToValue={(option, value) =>
                      option.chatId === value.chatId
                    }
                    renderOption={(props, option, state) => (
                      <li {...props} key={option.chatId}>
                        {option.chatName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={styles.InputButton}
                        margin="dense"
                        type="text"
                        label="群组列表"
                      />
                    )}
                    onChange={(e, value) =>
                      setChatId && setChatId(value ? value.chatId : "")
                    }
                  />
                )}
                {sendType === SendObjOrGroup.Object && (
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
                    componentsProps={{ paper: { elevation: 3 } }}
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
                    onChange={(e, value) => setTagsValue(value)}
                  />
                )}
              </>
            ) : (
              <>
                <TextField
                  sx={{ margin: "1rem 0 calc(1rem - 4px)" }}
                  size="small"
                  fullWidth
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  label={"群名"}
                />
                <Autocomplete
                  id="group-owner"
                  size="small"
                  disablePortal
                  openOnFocus
                  disableClearable
                  value={groupOwner}
                  options={groupDeptUserSelectedList.concat(defaultGroupOwner)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionDisabled={(option) => option.id === "-1"}
                  componentsProps={{ paper: { elevation: 3 } }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={styles.InputButton}
                      sx={{
                        input: {
                          color: groupOwner.id === "-1" ? "#999" : "333"
                        }
                      }}
                      margin="dense"
                      type="button"
                      label="群主选择"
                    />
                  )}
                  onChange={(e, value) => {
                    setGroupOwner(value)
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFunction(false)}>取消</Button>
            <LoadingButton
              loading={createLoading}
              loadingIndicator="Loading…"
              variant="text"
              onClick={() => {
                clickName !== "选择发送目标"
                  ? handleCreateGroup()
                  : setOpenFunction(false)
              }}
            >
              {clickName === "选择发送目标" ? "确定" : "创建"}
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* ----- 创建群组 ----- */}
        {clickName === "选择发送目标" && (
          <SelectTargetDialog
            open={isShowDialog}
            AppId={AppId}
            departmentAndUserList={departmentAndUserList}
            departmentKeyValue={departmentKeyValue}
            flattenDepartmentList={flattenDepartmentList}
            isLoading={isLoading}
            tagsList={tagsList}
            canSelect={DeptUserCanSelectStatus.User}
            setOpenFunction={setIsShowDialog}
            setDeptUserList={setDeptUserList}
            setOuterTagsValue={setTagsValue}
            lastTagsValue={lastTagsValue}
            setGroupList={setGroupList}
            groupList={groupList}
            chatId={chatId}
            setIsRefresh={setIsRefresh}
            clickName={"创建群组"}
            groupDeptUserSelectedList={groupDeptUserSelectedList}
          />
        )}

        {/* 消息提示 */}
        <Snackbar
          message={tipsObject.msg}
          open={tipsObject.show}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.departmentAndUserList === nextProps.departmentAndUserList &&
      prevProps.departmentKeyValue === nextProps.departmentKeyValue &&
      prevProps.AppId === nextProps.AppId &&
      prevProps.groupList === nextProps.groupList &&
      prevProps.chatId === nextProps.chatId &&
      prevProps.sendType === nextProps.sendType
    )
  }
)

export default SelectTargetDialog
