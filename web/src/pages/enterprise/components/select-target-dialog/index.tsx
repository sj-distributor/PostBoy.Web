import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import useAction from "./hook";
import styles from "./index.module.scss";

import {
  ITargetDialogProps,
  DeptUserCanSelectStatus,
  SendObjOrGroup,
  ITagsList,
} from "../../../../dtos/enterprise";
import {
  CircularProgress,
  FormControlLabel,
  Radio,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
import TreeViewSelector from "../../../../components/treeViewSelector";
import { TreeViewDisplayMode } from "../../../../components/treeViewSelector/props";

import { LoadingButton } from "@mui/lab";

const SelectTargetDialog = (props: ITargetDialogProps) => {
  const {
    open,
    departmentAndUserList,
    AppId,
    CorpId,
    isLoading,
    tagsList,
    flattenDepartmentList,
    departmentKeyValue,
    groupList,
    canSelect,
    lastTagsValue,
    clickName,
    chatId,
    chatName,
    sendType,
    outerTagsValue,
    isUpdatedDeptUser,
    targetSelectedList,
    schemaType,
    setSchemaType,
    setSendType,
    setChatId,
    setChatName,
    setGroupList,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    settingSelectedList,
  } = props;

  const {
    departmentSelectedList,
    tagsValue,
    isShowDialog,
    groupOwner,
    groupName,
    tipsObject,
    defaultGroupOwner,
    createLoading,
    sendList,
    keyword,
    searchValue,
    setSearchValue,
    setGroupPage,
    setKeyword,
    setGroupName,
    setGroupOwner,
    setIsShowDialog,
    setTagsValue,
    handleTypeIsCanSelect,
    handleCreateGroup,
    handleConfirm,
    handleCancel,
    onListBoxScrolling,
    setDepartmentSelectedList,
  } = useAction({
    open,
    AppId,
    departmentKeyValue,
    departmentAndUserList,
    isLoading,
    lastTagsValue,
    tagsList,
    clickName,
    chatId,
    chatName,
    outerTagsValue,
    isUpdatedDeptUser,
    sendType,
    CorpId,
    targetSelectedList,
    setSendType,
    setChatId,
    setChatName,
    setOpenFunction,
    setDeptUserList,
    setOuterTagsValue,
    setGroupList,
    settingSelectedList,
  });

  return (
    <div>
      <Dialog open={open} PaperProps={{ sx: { overflowY: "unset" } }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "4rem",
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
          {!isLoading ? (
            <>
              {departmentKeyValue && departmentKeyValue.key && (
                <div>
                  {departmentSelectedList && (
                    <TreeViewSelector
                      appId={AppId}
                      inputValue={""}
                      sourceData={{
                        foldData: departmentKeyValue.data,
                        flattenData: flattenDepartmentList,
                      }}
                      defaultSelectedList={departmentSelectedList}
                      settingSelectedList={(value) =>
                        setDepartmentSelectedList(value)
                      }
                      inputLabel={
                        sendType === SendObjOrGroup.Object ? "" : "用户搜索"
                      }
                      displayMode={
                        clickName === "选择发送目标" &&
                        sendType !== SendObjOrGroup.Object
                          ? TreeViewDisplayMode.Tree
                          : TreeViewDisplayMode.Both
                      }
                      schemaType={schemaType}
                      setSchemaType={setSchemaType}
                    >
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
                          onChange={(_e, value) =>
                            setSendType && setSendType(value)
                          }
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
                    </TreeViewSelector>
                  )}
                </div>
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
                        popper: { placement: "top" },
                      }}
                      value={searchValue}
                      options={groupList}
                      filterOptions={(x) => x}
                      getOptionLabel={(option) => option.chatName}
                      isOptionEqualToValue={(option, value) =>
                        option.chatId === value.chatId
                      }
                      renderOption={(props, option, state) => (
                        <li {...props} key={option.chatId}>
                          {option.chatName}
                        </li>
                      )}
                      ListboxProps={{
                        onScroll: (e) => {
                          onListBoxScrolling(
                            (e.target as HTMLElement).scrollHeight,
                            (e.target as HTMLElement).scrollTop,
                            (e.target as HTMLElement).clientHeight
                          );
                        },
                      }}
                      clearOnBlur={false}
                      onInputChange={(_, value) => {
                        setKeyword(value);
                        setGroupPage(1);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          value={keyword}
                          className={styles.InputButton}
                          margin="dense"
                          type="text"
                          label="群组列表"
                        />
                      )}
                      onChange={(e, value) => {
                        setChatId && setChatId(value ? value.chatId : "");
                        setChatName && setChatName(value ? value.chatName : "");
                        setSearchValue(value);
                      }}
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
                      sx={{ display: "none" }}
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
                      onChange={(e, value) =>
                        setTagsValue(value as ITagsList[])
                      }
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
                    options={
                      departmentSelectedList
                        ? departmentSelectedList.concat(defaultGroupOwner)
                        : [defaultGroupOwner]
                    }
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
                            color: groupOwner.id === "-1" ? "#999" : "333",
                          },
                        }}
                        margin="dense"
                        type="button"
                        label="群主选择"
                      />
                    )}
                    onChange={(e, value) => {
                      setGroupOwner(value);
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <CircularProgress
              style={{
                position: "absolute",
                width: "2rem",
                height: "2rem",
                left: "50%",
                top: "50%",
                margin: "-1rem 0 0 -1rem",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <LoadingButton
            loading={createLoading}
            loadingIndicator="Loading…"
            variant="text"
            onClick={() => {
              clickName !== "选择发送目标"
                ? handleCreateGroup()
                : handleConfirm();
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
          CorpId={CorpId}
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
          chatName={chatName}
          clickName={"创建群组"}
          isUpdatedDeptUser={isUpdatedDeptUser}
          targetSelectedList={targetSelectedList}
          settingSelectedList={settingSelectedList}
          schemaType={schemaType}
          setSchemaType={setSchemaType}
        />
      )}

      {/* 消息提示 */}
      <Snackbar
        message={tipsObject.msg}
        open={tipsObject.show}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </div>
  );
};

export default SelectTargetDialog;
