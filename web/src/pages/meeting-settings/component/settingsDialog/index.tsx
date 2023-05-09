import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./index.module.scss";
import { Fragment } from "react";
import useAction from "./hook";
import {
  SettingDialogProps,
  MeetingCallReminder,
  DefaultDisplay,
} from "../../../../dtos/meeting-seetings";
import { VisibilityOff, Visibility } from "@mui/icons-material";
const SeetingsDialog = (props: SettingDialogProps) => {
  const {
    open,
    setDialog,
    setOpenAddDialog,
    openAddDialog,
    appointList,
    hostList,
    setClickName,
    handleGetSettingData,
    settings,
    setSettings,
  } = props;
  const {
    meetingSettingList,
    showPassword,
    radioDisabled,
    onIsOption,
    handleChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    onMembershipPassword,
    onSelectHost,
    onAppint,
    onUpdateSettings,
  } = useAction({
    setOpenAddDialog,
    setClickName,
    appointList,
    hostList,
    openAddDialog,
    handleGetSettingData,
    setDialog,
    settings,
    setSettings,
  });
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={style.dialogTitle}>
          <div>会议设置</div>
          <CloseIcon
            onClick={() => setDialog(false)}
            className={style.closeIcon}
          />
        </DialogTitle>
        <DialogContent sx={{ width: "25rem", fontSize: "0.6rem" }}>
          {meetingSettingList.map((item, index) => {
            return (
              <Fragment key={index}>
                <div
                  className={style.settingsList}
                  onClick={() => item.optionType === "dailog" && onSelectHost()}
                >
                  <div className="title">{item.title}</div>
                  <div>
                    {item.optionType === "checkbox" ||
                    item.optionType === "input" ? (
                      <input
                        type="checkbox"
                        checked={item.isOption}
                        onChange={(event) =>
                          onIsOption(event.target.checked, index)
                        }
                      />
                    ) : item.icon ? (
                      hostList ? (
                        <div className={style.memberPreview}>
                          <div className={style.memberName}>
                            {hostList.map((aItem, index) => {
                              return (
                                index < DefaultDisplay.DisplayName && (
                                  <span key={index}>
                                    {aItem.name}
                                    {index === 0 && hostList.length > 1 && "、"}
                                  </span>
                                )
                              );
                            })}
                          </div>
                          {hostList.length > 1 && `等${hostList.length}人`}
                          <ArrowForwardIosIcon
                            sx={{ fontSize: "0.6rem", marginLeft: "0.3rem" }}
                          />
                        </div>
                      ) : (
                        <ArrowForwardIosIcon
                          sx={{ color: "#ccc", fontSize: "1rem" }}
                        />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {item.optionList?.length && item.isOption && (
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e) => handleChange(e.target.value, index)}
                    row
                    value={item.optionData}
                  >
                    {item.optionList.map((optionItem, index) => {
                      return (
                        <FormControlLabel
                          value={optionItem.value}
                          control={<Radio size="small" />}
                          label={optionItem.lable}
                          key={index}
                          disabled={
                            optionItem.value === MeetingCallReminder.All &&
                            item.title === "会议开始时来电提醒" &&
                            !radioDisabled
                          }
                          sx={{
                            "& .css-ahj2mt-MuiTypography-root": {
                              fontSize: "0.6rem",
                            },
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                )}
                {item.title === "会议开始时来电提醒" &&
                  item.optionData === MeetingCallReminder.Appoint &&
                  appointList &&
                  appointList.length >= 1 && (
                    <div
                      className={style.appointListCentent}
                      onClick={() => onAppint()}
                    >
                      <div>指定成员</div>
                      <div className={style.memberPreview}>
                        <div className={style.memberName}>
                          {appointList.map((appointItem, index) => {
                            return (
                              index < DefaultDisplay.DisplayName && (
                                <span key={index}>
                                  {appointItem.name}
                                  {index === 0 &&
                                    appointList.length > 1 &&
                                    "、"}
                                </span>
                              )
                            );
                          })}
                        </div>
                        {appointList.length > 1 && `等${appointList.length}人`}
                        <ArrowForwardIosIcon
                          sx={{ fontSize: "0.6rem", marginLeft: "0.3rem" }}
                        />
                      </div>
                    </div>
                  )}
                {item.optionType === "input" && item.isOption && (
                  <form action="">
                    <OutlinedInput
                      autoComplete="true"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      size="small"
                      sx={{ width: "100%" }}
                      value={item.password ? item.password : ""}
                      onChange={(e) =>
                        onMembershipPassword(e.target.value, index)
                      }
                      placeholder="请输入4-6位数字密码"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </form>
                )}
              </Fragment>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => onUpdateSettings()}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SeetingsDialog;
