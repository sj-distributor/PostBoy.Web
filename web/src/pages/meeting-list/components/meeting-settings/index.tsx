import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Avatar,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  ListItemIcon,
  Menu,
  MenuList,
  Paper,
  Popper,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import useAction from "./hook";
import DateTime from "./component/date-time";
import "@wangeditor/editor/dist/css/style.css";
import style from "./index.module.scss";
import AddParticipantDialog from "./component/add-participant-dialog";
import SeetingsDialog from "./component/settingsDialog";
import {
  DefaultDisplay,
  MeetingSettingsProps,
} from "../../../../dtos/meeting-seetings";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MeetingSetting(props: MeetingSettingsProps) {
  const {
    isOpenMeetingSettings,
    setIsOpenMeetingSettings,
    meetingIdCorpIdAndAppId,
    getMeetingList,
    meetingState,
  } = props;
  const {
    editor,
    html,
    toolbarConfig,
    editorConfig,
    selectGroup,
    openAnnexList,
    anchorRef,
    openSettingsDialog,
    annexFile,
    inputRef,
    open,
    anchorEl,
    corpsValue,
    corpAppValue,
    corpsList,
    corpAppList,
    isShowMoreParticipantList,
    isShowDialog,
    departmentAndUserList,
    departmentKeyValue,
    searchKeyValue,
    isTreeViewLoading,
    tagsList,
    groupList,
    DeptUserCanSelectStatus,
    tagsValue,
    lastTimeTagsList,
    clickName,
    chatId,
    sendType,
    isUpdatedDeptUser,
    loadSelectData,
    appointLists,
    hostLists,
    participantLists,
    tipsObject,
    appLoading,
    setCorpsValue,
    setGroupList,
    setIsShowDialog,
    setDepartmentAndUserList,
    setTagsValue,
    setChatId,
    setSendType,
    setIsShowMoreParticipantList,
    setCorpAppValue,
    handleCloseMenu,
    uploadAnnex,
    setOpenSettingsDialog,
    handleChange,
    setHtml,
    setEditor,
    handleToggle,
    handleClose,
    fileUpload,
    fileDelete,
    handleGetSelectData,
    onSetParticipant,
    setClickName,
    onCreateUpdateMeeting,
    meetingTitle,
    setMeetingTitle,
    meetingLocation,
    setMeetingLocation,
    handleGetSettingData,
    meetingReminders,
    setMeetingReminders,
    loading,
    success,
    failSend,
    meetingStartDate,
    meetingStartTime,
    meetingEndDate,
    meetingEndTime,
    settings,
    setSettings,
    setMeetingStartDate,
    setMeetingStartTime,
    setMeetingEndDate,
    setMeetingEndTime,
    onSetAdminUser,
    adminUser,
    customEndTime,
    meetingDuration,
    setMeetingDuration,
  } = useAction({
    setIsOpenMeetingSettings,
    meetingIdCorpIdAndAppId,
    isOpenMeetingSettings,
    getMeetingList,
    meetingState,
  });

  return (
    <>
      {/* 消息提示 */}
      <Snackbar
        message={tipsObject.msg}
        open={tipsObject.show}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <Snackbar
        open={success}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success">
          <AlertTitle>
            {meetingState === "create"
              ? "Meeting created successfully"
              : "Meeting updated successfully"}
          </AlertTitle>
        </Alert>
      </Snackbar>
      <Snackbar
        open={failSend}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="error">
          <AlertTitle>
            {meetingState === "create"
              ? "Meeting creation failed"
              : "Meeting update failed,meeting is starting or end"}
          </AlertTitle>
        </Alert>
      </Snackbar>
      <AddParticipantDialog
        open={isShowDialog}
        AppId={corpAppValue ? corpAppValue.appId : ""}
        CorpId={corpAppValue ? corpAppValue.id : ""}
        departmentAndUserList={departmentAndUserList}
        departmentKeyValue={departmentKeyValue}
        flattenDepartmentList={searchKeyValue}
        isLoading={isTreeViewLoading}
        tagsList={tagsList}
        groupList={groupList}
        canSelect={DeptUserCanSelectStatus.Both}
        setGroupList={setGroupList}
        setOpenFunction={setIsShowDialog}
        setDeptUserList={setDepartmentAndUserList}
        outerTagsValue={tagsValue}
        setOuterTagsValue={setTagsValue}
        lastTagsValue={lastTimeTagsList}
        clickName={clickName}
        chatId={chatId}
        setChatId={setChatId}
        sendType={sendType}
        setSendType={setSendType}
        isUpdatedDeptUser={isUpdatedDeptUser}
        handleGetSelectData={handleGetSelectData}
        loadSelectData={loadSelectData}
      />
      <SeetingsDialog
        open={openSettingsDialog}
        setDialog={setOpenSettingsDialog}
        openAddDialog={isShowDialog}
        setOpenAddDialog={setIsShowDialog}
        setClickName={setClickName}
        appointList={appointLists}
        hostList={hostLists}
        handleGetSettingData={handleGetSettingData}
        settings={settings}
        setSettings={setSettings}
      />

      <Dialog
        open={isOpenMeetingSettings}
        onClose={() => setIsOpenMeetingSettings(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ backgroundColor: "#f2f3f4" }}
        >
          {meetingState === "update" ? "编辑会议" : "创建会议"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f2f3f4" }}>
          <div className={style.container}>
            <div className={style.appointmentMeeting}>
              {corpsList.length > 0 && !appLoading ? (
                <>
                  <div className={style.fromItem}>
                    <div className={style.title}>企业</div>
                    <div className={style.enterpriseApplications}>
                      <Autocomplete
                        openOnFocus
                        disablePortal
                        disableClearable
                        value={corpsValue}
                        readOnly={meetingState === "update"}
                        id="Autocomplete-corpsDataId"
                        options={corpsList}
                        className={style.inputWrap}
                        getOptionLabel={(option) => option.corpName}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            type="button"
                            label="选择企业"
                          />
                        )}
                        onChange={(e, value) => {
                          setCorpsValue(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className={style.fromItem}>
                    <div className={style.title}>应用</div>
                    <div className={style.enterpriseApplications}>
                      <Autocomplete
                        openOnFocus
                        disablePortal
                        id="Autocomplete-corpAppListId"
                        value={corpAppValue}
                        options={corpAppList}
                        readOnly={meetingState === "update"}
                        className={style.inputWrap}
                        disableClearable
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(e, value) => {
                          setCorpAppValue(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            type="button"
                            label="选择应用"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className={style.fromItem}>
                    <div className={style.title}>标题</div>
                    <div className={style.widthFull}>
                      <TextField
                        id="filled-start-adornment"
                        placeholder="会议主题"
                        autoComplete="off"
                        sx={{ width: "100%" }}
                        className={style.appointmentPersonData}
                        value={meetingTitle}
                        onChange={(e) =>
                          setMeetingTitle(e.target.value.slice(0, 40))
                        }
                        InputProps={{
                          endAdornment: (
                            <>
                              <Button
                                className={style.meetingBtn}
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                              >
                                <VideocamIcon />
                                <span>会议</span>
                                <ArrowDropDownIcon />
                              </Button>
                              <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button",
                                }}
                              >
                                <MenuItem onClick={handleCloseMenu}>
                                  <ListItemIcon>
                                    <VideocamIcon fontSize="small" />
                                  </ListItemIcon>
                                  会议
                                </MenuItem>
                                <MenuItem onClick={handleCloseMenu}>
                                  <ListItemIcon>
                                    <CalendarMonthIcon fontSize="small" />
                                  </ListItemIcon>
                                  日程
                                </MenuItem>
                              </Menu>
                            </>
                          ),
                        }}
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className={style.adminAndParticipantItem}>
                    <div
                      className={style.title}
                      style={{ marginBottom: "0.8rem" }}
                    >
                      会议管理员
                    </div>

                    <div className={style.participantDataBox}>
                      {adminUser && adminUser.length > 0 && (
                        <div className={style.participantData}>
                          <Avatar variant="square" src=""></Avatar>
                          <div className={style.participantName}>
                            {adminUser[0].id}
                          </div>
                        </div>
                      )}
                      {meetingState === "create" && (
                        <div
                          className={style.addParticipant}
                          onClick={() => onSetAdminUser()}
                        >
                          <AddIcon className={style.addParticipantIcon} />
                          指定会议管理员
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={style.adminAndParticipantItem}>
                    <div
                      className={style.title}
                      style={{ marginBottom: "0.8rem" }}
                    >
                      参会人
                    </div>
                    <div className={style.participantDataBox}>
                      {participantLists &&
                        participantLists?.length >= 1 &&
                        participantLists
                          .filter((item, index) =>
                            isShowMoreParticipantList
                              ? index < DefaultDisplay.Participant
                              : true
                          )
                          .map((item, index) => {
                            return (
                              <div
                                className={style.participantData}
                                key={index}
                              >
                                <Avatar variant="square" src=""></Avatar>
                                <div className={style.participantName}>
                                  {item.name}
                                </div>
                              </div>
                            );
                          })}
                      {participantLists &&
                        participantLists?.length >
                          DefaultDisplay.Participant && (
                          <div
                            className={style.showParticipantData}
                            onClick={() =>
                              setIsShowMoreParticipantList((val) => !val)
                            }
                          >
                            {isShowMoreParticipantList ? (
                              <ExpandMoreIcon />
                            ) : (
                              <ExpandLessIcon />
                            )}{" "}
                            共{participantLists.length}人
                          </div>
                        )}
                      <div
                        className={style.addParticipant}
                        onClick={() => onSetParticipant()}
                      >
                        <AddIcon className={style.addParticipantIcon} />
                        添加参会人
                      </div>
                    </div>
                  </div>

                  <div className={style.fromItem}>
                    <div className={style.title}>开始</div>
                    <div className={style.widthFull}>
                      <DateTime
                        time={meetingStartTime}
                        date={meetingStartDate}
                        setDate={setMeetingStartDate}
                        setTime={setMeetingStartTime}
                      />
                    </div>
                  </div>
                  {customEndTime ? (
                    <div className={style.fromItem}>
                      <div className={style.title}>结束</div>
                      <div className={style.widthFull}>
                        <DateTime
                          time={meetingEndTime}
                          date={meetingEndDate}
                          setDate={setMeetingEndDate}
                          setTime={setMeetingEndTime}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={style.fromItem}>
                      <div className={style.title}>时长</div>
                      <div className={style.widthFull}>
                        <Select
                          value={meetingDuration.value}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className={style.fromDataItem}
                          onChange={(e) =>
                            setMeetingDuration((prve) => ({
                              ...prve,
                              value: +e.target.value,
                            }))
                          }
                        >
                          {meetingDuration.menuItemList.map((item, index) => {
                            return (
                              <MenuItem value={item.value} key={index}>
                                {item.lable}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                  )}
                  <div className={style.fromItem}>
                    <div className={style.title}>地址</div>
                    <div className={style.widthFull}>
                      <TextField
                        id="multiline"
                        placeholder="添加地址"
                        className={style.fromDataItem}
                        variant="outlined"
                        autoComplete="off"
                        value={meetingLocation ? meetingLocation : ""}
                        onChange={(e) =>
                          setMeetingLocation(e.target.value.slice(0, 128))
                        }
                      />
                    </div>
                  </div>
                  {false && (
                    <div className={style.fromItem}>
                      <div className={style.title}>附件</div>
                      <div className={style.widthFull}>
                        <ButtonGroup
                          variant="contained"
                          aria-label="split button"
                          ref={anchorRef}
                        >
                          <Button onClick={() => uploadAnnex()}>
                            添加附件
                          </Button>
                          <input
                            ref={inputRef}
                            hidden
                            type="file"
                            onChange={(e) =>
                              !!e.target.files &&
                              fileUpload(e.target.files, "会议附件", e)
                            }
                            multiple
                          />
                          <Button
                            size="small"
                            aria-controls={
                              openAnnexList ? "split-button-menu" : undefined
                            }
                            aria-expanded={openAnnexList ? "true" : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                          >
                            <KeyboardArrowDownIcon />
                          </Button>
                        </ButtonGroup>
                        <Popper
                          sx={{
                            zIndex: 1,
                          }}
                          open={openAnnexList}
                          anchorEl={anchorRef.current}
                          role={undefined}
                          transition
                          disablePortal
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                transformOrigin:
                                  placement === "bottom"
                                    ? "center top"
                                    : "center bottom",
                              }}
                            >
                              <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                  <MenuList
                                    id="split-button-menu"
                                    autoFocusItem
                                  >
                                    {annexFile.map((item, index) => {
                                      return (
                                        <MenuItem key={index}>
                                          <Tooltip title={item.name}>
                                            <div className={style.fileName}>
                                              {item.name}
                                            </div>
                                          </Tooltip>
                                          <ClearIcon
                                            className={style.delFileIcon}
                                            onClick={() =>
                                              fileDelete("annex", index)
                                            }
                                          />
                                        </MenuItem>
                                      );
                                    })}
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </div>
                    </div>
                  )}
                  <div className={style.fromItem}>
                    <div className={style.title}>描述</div>
                    <div className={style.widthFull}>
                      <div className={style.editableTextarea}>
                        <Toolbar
                          editor={editor}
                          defaultConfig={toolbarConfig}
                          mode="default"
                          className={style.toolbar}
                        />

                        <Editor
                          value={html}
                          onCreated={setEditor}
                          defaultConfig={editorConfig}
                          onChange={(editor) => setHtml(editor.getHtml())}
                          mode="default"
                          style={{ minHeight: "300px" }}
                          className={style.editorText}
                        />
                      </div>
                    </div>
                  </div>
                  {selectGroup.map((item, index) => {
                    return (
                      <div key={index} className={style.fromItem}>
                        <div className={style.title}>{item.title}</div>
                        <div className={style.selectGroupData}>
                          <Select
                            value={item.value}
                            onChange={(e) =>
                              handleChange(e.target.value, item.key)
                            }
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className={style.fromDataItem}
                          >
                            {item.data.map((cItem, index) => {
                              return (
                                <MenuItem value={cItem.value} key={index}>
                                  {item.isIcon && (
                                    <Brightness1Icon
                                      style={{
                                        color: "368aef",
                                        fontSize: "1rem",
                                        verticalAlign: "text-top",
                                        marginRight: "0.3rem",
                                      }}
                                    />
                                  )}
                                  {cItem.lable}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {item.key === "repeat" &&
                            meetingReminders?.is_repeat === 1 && (
                              <>
                                <div className={style.remindersEndDate}>
                                  结束于
                                </div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  adapterLocale="zh-cn"
                                >
                                  <DatePicker
                                    format="M月D日"
                                    value={dayjs.unix(
                                      meetingReminders.repeat_until as number
                                    )}
                                    onChange={(e) =>
                                      setMeetingReminders((data) => {
                                        data.repeat_until =
                                          dayjs(e).valueOf() / 1000;
                                        return data;
                                      })
                                    }
                                    sx={{ width: "100%" }}
                                  />
                                </LocalizationProvider>
                              </>
                            )}
                        </div>
                      </div>
                    );
                  })}
                  <div className={style.fromItem}>
                    <div className={style.title}>设置</div>
                    <div className={style.seetingBtn}>
                      <Button
                        variant="contained"
                        component="label"
                        onClick={() => setOpenSettingsDialog(true)}
                      >
                        会议设置
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                  <Skeleton height={80} width={550} animation="wave" />
                </>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#f2f3f4",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <Button
            onClick={() => setIsOpenMeetingSettings(false)}
            variant="contained"
            component="label"
          >
            取消
          </Button>
          <Button
            variant="contained"
            component="label"
            disabled={loading}
            onClick={() => onCreateUpdateMeeting()}
          >
            {loading ? <CircularProgress size={20} /> : "保存会议"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
