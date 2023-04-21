import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./index.module.scss";
import { Fragment, useState } from "react";
import useAction from "./hook";
import { DialogProps } from "../../../../dtos/meeting-seetings";
import AddParticipantDialog from "../add-participant-dialog";
const SeetingsDialog = (props: DialogProps) => {
  const { open, setDialog } = props;
  const {
    meetingSettingList,
    openAddDialog,
    setAddDialog,
    setIsOption,
    handleChange,
  } = useAction();

  return (
    <>
      <AddParticipantDialog open={openAddDialog} setDialog={setAddDialog} />
      <Dialog
        open={open}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={style.dialogTiile}>
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
                    {item.optionType === "checkbox" ? (
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
                    defaultValue={
                      item.optionList.length && item.optionList[0].value
                    }
                    onChange={(e) => handleChange(e, index)}
                    row
                  >
                    {item.optionList.map((oItem, index) => {
                      return (
                        <FormControlLabel
                          value={oItem.value}
                          control={<Radio size="small" />}
                          label={oItem.lable}
                          key={index}
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
              </Fragment>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeetingsDialog;
