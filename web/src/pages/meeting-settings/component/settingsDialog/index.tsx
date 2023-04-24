import {
  Dialog,
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
} from "../../../../dtos/meeting-seetings";
import AddParticipantDialog from "../add-participant-dialog";
import { VisibilityOff, Visibility } from "@mui/icons-material";
const SeetingsDialog = (props: SettingDialogProps) => {
  const { open, setDialog } = props;
  const {
    meetingSettingList,
    openAddDialog,
    showPassword,
    radioDisabled,
    addDialogType,
    setAddDialog,
    setIsOption,
    handleChange,
    handleClickShowPassword,
    handleMouseDownPassword,
    setMembershipPassword,
    setAppintRadio,
    getSelectListData,
  } = useAction();

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
                  onClick={() =>
                    item.optionType === "dailog" && setAddDialog(true)
                  }
                >
                  <div className="title">{item.title}</div>
                  <div>
                    {item.optionType === "checkbox" ||
                    item.optionType === "input" ? (
                      <input
                        type="checkbox"
                        onChange={(event) => setIsOption(event, index)}
                      />
                    ) : item.icon ? (
                      <ArrowForwardIosIcon
                        sx={{ color: "#ccc", fontSize: "1rem" }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {item.optionList?.length && item.isOption && (
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e) => handleChange(e, index)}
                    row
                    value={item.optionData}
                  >
                    {item.optionList.map((oItem, index) => {
                      return (
                        <FormControlLabel
                          value={oItem.value}
                          control={<Radio size="small" />}
                          label={oItem.lable}
                          key={index}
                          disabled={
                            oItem.value === MeetingCallReminder.All &&
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
                {item.optionType === "input" && item.isOption && (
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    sx={{ width: "100%" }}
                    onBlur={(e) => setMembershipPassword(e, index)}
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
                )}
              </Fragment>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeetingsDialog;
