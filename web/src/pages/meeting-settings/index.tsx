import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  Avatar,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  Menu,
  MenuList,
  Paper,
  Popper,
  TextField,
  Tooltip,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import useAction from "./hook";
import Grid from "@mui/material/Unstable_Grid2";
import { Fragment, useRef, useState } from "react";
import DateTime from "./component/date-time";
import "@wangeditor/editor/dist/css/style.css";
import style from "./index.module.scss";
import AddParticipantDialog from "./component/add-participant-dialog";
import SeetingsDialog from "./component/settingsDialog";

export default function SelectLabels() {
  const {
    editor,
    html,
    toolbarConfig,
    editorConfig,
    selectGroup,
    openAnnexList,
    anchorRef,
    openAddParticipantDialog,
    openSettingsDialog,
    annexFile,
    inputRef,
    open,
    anchorEl,
    handleClick,
    handleCloseMenu,
    uploadAnnex,
    setOpenAddParticipantDialog,
    setOpenSettingsDialog,
    handleChange,
    setHtml,
    setEditor,
    handleToggle,
    handleClose,
    getEndDate,
    getStateDate,
    fileUpload,
    fileDelete,
    getSelectListData,
  } = useAction();

  return (
    <>
      <AddParticipantDialog
        open={openAddParticipantDialog}
        setDialog={setOpenAddParticipantDialog}
        type="AddMembers"
        getSelectListData={getSelectListData}
      />
      <SeetingsDialog
        open={openSettingsDialog}
        setDialog={setOpenSettingsDialog}
      />
      <div className={style.container}>
        <div className={style.appointmentMeeting}>
          <Grid container alignItems="center" columns={24} rowSpacing={2}>
            <Grid xs={24} md={2}>
              <ClearIcon />
            </Grid>
            <Grid xs={24} md={22}>
              <TextField
                id="filled-start-adornment"
                sx={{ width: "100%" }}
                className={style.appointmentPersonData}
                InputProps={{
                  endAdornment: (
                    <>
                      <Button
                        className={style.meetingBtn}
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
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
            </Grid>
            <Grid xs={24} md={2}>
              参会人
            </Grid>
            <Grid xs={24} md={22}>
              <Grid container columns={100} justifyContent="space-between">
                <Grid xs={100} md={49} sx={{ marginBottom: "10px" }}>
                  <div className={style.participantData}>
                    <Avatar
                      variant="square"
                      src="https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69"
                    ></Avatar>
                    <div className={style.participantName}>MARS.PENG</div>
                  </div>
                </Grid>
                <Grid xs={100} md={49} sx={{ marginBottom: "10px" }}>
                  <div
                    className={style.addParticipant}
                    onClick={() => setOpenAddParticipantDialog(true)}
                  >
                    <AddIcon className={style.addParticipantIcon} />
                    添加参会人
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid xs={24} md={2}>
              开始
            </Grid>
            <Grid xs={24} md={22}>
              <DateTime getDateTimeData={getStateDate} />
            </Grid>

            <Grid xs={24} md={2}>
              结束
            </Grid>
            <Grid xs={24} md={22}>
              <DateTime getDateTimeData={getEndDate} />
            </Grid>

            <Grid xs={24} md={2}>
              地址
            </Grid>
            <Grid xs={24} md={22}>
              <TextField
                id="multiline"
                placeholder="添加地址"
                className={style.fromDataItem}
                variant="outlined"
              />
            </Grid>
            <Grid xs={24} md={2}>
              附件
            </Grid>
            <Grid xs={24} md={22}>
              <ButtonGroup
                variant="contained"
                aria-label="split button"
                ref={anchorRef}
              >
                <Button onClick={() => uploadAnnex()}>添加附件</Button>
                <input
                  ref={inputRef}
                  hidden
                  type="file"
                  accept="image/jpg, image/png"
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
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
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
                                  onClick={() => fileDelete("annex", index)}
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
            </Grid>

            <Grid xs={24} md={2}>
              描述
            </Grid>
            <Grid xs={24} md={22}>
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
                  className={style.editorText}
                />
              </div>
            </Grid>
            {selectGroup.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Grid xs={24} md={2}>
                    {item.title}
                  </Grid>
                  <Grid xs={24} md={22}>
                    <Select
                      defaultValue={item.data[0].value}
                      onChange={(e) => handleChange(e, item.key)}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      label={item.value}
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
                  </Grid>
                </Fragment>
              );
            })}
            <Grid xs={24} md={2}>
              设置
            </Grid>
            <Grid xs={24} md={22}>
              <Button
                variant="contained"
                component="label"
                onClick={() => setOpenSettingsDialog(true)}
              >
                会议设置
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
