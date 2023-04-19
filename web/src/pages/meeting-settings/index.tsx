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
  MenuList,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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

export default function SelectLabels() {
  const {
    SelectType,
    editor,
    html,
    toolbarConfig,
    selectData,
    editorConfig,
    selectGroup,
    handleChange,
    setHtml,
    setEditor,
  } = useAction();

  const [openAnnexList, setOpenAnnexList] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpenAnnexList((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenAnnexList(false);
  };

  //获取时间
  const getEndDate = (data: { time: string; date: string }) => {
    console.log(data);
  };
  const getStateDate = (data: { time: string; date: string }) => {
    console.log(data);
  };
  return (
    <div className={style.container}>
      <div className={style.appointmentMeeting}>
        <Grid container alignItems="center" columns={24} rowSpacing={2}>
          <Grid xs={24} md={2}>
            <ClearIcon />
          </Grid>
          <Grid xs={24} md={22}>
            <div className={style.appointmentPersonData}>
              <div>MARS.PENG预定的会议</div>
              <div className={style.meetingBtn}>
                <VideocamIcon />
                会议
                <ArrowDropDownIcon />
              </div>
            </div>
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
                <div className={style.addParticipant}>
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
            <DateTime
              selectList={selectData[SelectType.startTime]}
              getDateTimeData={getStateDate}
            />
          </Grid>

          <Grid xs={24} md={2}>
            结束
          </Grid>
          <Grid xs={24} md={22}>
            <DateTime
              selectList={selectData[SelectType.endTime]}
              getDateTimeData={getEndDate}
            />
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
              <Button>添加附件</Button>
              <Button
                size="small"
                aria-controls={openAnnexList ? "split-button-menu" : undefined}
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
                        <MenuItem>某某pdf文件</MenuItem>
                        <MenuItem>某某word文件</MenuItem>
                        <MenuItem>某某exl文件</MenuItem>
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
                          {cItem.value}
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
            <Button variant="contained" component="label">
              会议设置
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
