import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MessageWidgetShowStatus, SendType } from "../../../../dtos/enterprise";
import SelectTargetDialog from "../select-target-dialog";
import useAction from "./hook";
import styles from "./index.module.scss";
import SendNotice from "../../../notification";
import Scheduler from "smart-cron";
import { useState } from "react";
import moment from "moment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SendMessage = () => {
  const {
    corpsList,
    corpAppList,
    corpsValue,
    corpAppValue,
    messageTypeList,
    messageParams,
    messageTypeValue,
    isShowDialog,
    isShowInputOrUpload,
    isShowMessageParams,
    departmentList,
    isTreeViewLoading,
    flattenDepartmentList,
    tagsList,
    sendTypeList,
    sendTypeValue,
    rowList,
    cronExp,
    isAdmin,
    dateValue,
    muiSxStyle,
    timeZone,
    timeZoneValue,
    titleParams,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    getDialogValue,
    setIsShowMessageParams,
    setSendTypeValue,
    setCronExp,
    setCronError,
    setDateValue,
    setTimeZoneValue,
    setTitleParams,
  } = useAction();

  return (
    <div className={styles.sendMsgBox}>
      <div className={styles.selectInputBox}>
        {corpsValue !== undefined && corpAppValue !== undefined && (
          <>
            <Autocomplete
              disablePortal
              id="Autocomplete-corpsDataId"
              value={corpsValue}
              disableClearable={true}
              options={corpsList}
              sx={muiSxStyle}
              getOptionLabel={(option) => option.corpName}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.corpInput}
                  type="button"
                  label="选择企业"
                />
              )}
              onChange={(e, value) => {
                setCorpsValue(value);
              }}
            />
            <Autocomplete
              disablePortal
              id="Autocomplete-corpAppListId"
              value={corpAppValue}
              options={corpAppList}
              sx={Object.assign(muiSxStyle, { textAlign: "left" })}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                setCorpAppValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.corpInput}
                  type="button"
                  label="选择应用"
                />
              )}
            />
          </>
        )}
        <Autocomplete
          disablePortal
          className={styles.messageTypeList}
          id="Autocomplete-messageTypeListId"
          disableClearable={true}
          options={messageTypeList}
          sx={muiSxStyle}
          value={messageTypeValue}
          getOptionLabel={(option) => option.title}
          groupBy={(option) => option.groupBy}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          renderInput={(params) => (
            <TextField
              {...params}
              className={styles.corpInput}
              type="button"
              label="消息类型"
            />
          )}
          renderGroup={(params) => {
            return (
              <div key={params.key}>
                <p
                  className={
                    params.group === "文件"
                      ? styles.groupLabel
                      : styles.noneGroupLabel
                  }
                >
                  {params.group}
                </p>
                <span>{params.children}</span>
              </div>
            );
          }}
          onChange={(e, value) => {
            setMessageTypeValue(value);
          }}
        />

        <Autocomplete
          disablePortal
          id="Autocomplete-corpAppListId"
          value={sendTypeValue}
          options={sendTypeList}
          sx={Object.assign(muiSxStyle, { textAlign: "left" })}
          disableClearable
          getOptionLabel={(option) => option.text}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, value) => {
            setSendTypeValue(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={styles.corpInput}
              type="button"
              label="发送类型"
            />
          )}
        />
        <FormControl sx={Object.assign(muiSxStyle, { textAlign: "left" })}>
          <InputLabel id="demo-simple-select-label">时区</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={timeZoneValue}
            label="时区"
            onChange={(e) => {
              setTimeZoneValue(Number(e.target.value));
            }}
          >
            {timeZone.map((item, key) => (
              <MenuItem key={key} value={item.value}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          sx={{
            height: "3.5rem",
            fontSize: "1rem",
            flexShrink: "0",
            margin: "0 2rem",
          }}
          variant="contained"
          onClick={() => {
            setIsShowDialog(true);
          }}
        >
          选择发送目标
        </Button>
        <Button
          sx={{
            height: "3.5rem",
            width: "7rem",
            fontSize: "1rem",
            margin: "0 2rem",
          }}
          variant="contained"
          onClick={() => handleSubmit(sendTypeValue.value)}
        >
          发 送
        </Button>
      </div>
      <div className={styles.checkboxAndUploadBox}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                value={isShowMessageParams}
                onChange={(e) => {
                  setIsShowMessageParams(
                    (e.target as HTMLInputElement).checked
                  );
                }}
              />
            }
            label="查看完整参数"
          />
        </FormGroup>

        {(isShowInputOrUpload === MessageWidgetShowStatus.ShowUpload ||
          isShowInputOrUpload === MessageWidgetShowStatus.ShowAll) && (
          <Button
            variant="contained"
            component="label"
            sx={{
              height: "3.5rem",
              width: "7rem",
              fontSize: "1rem",
              margin: "0 2rem",
            }}
          >
            Upload
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        )}
      </div>

      <div className={styles.cycleSelectWrap}>
        {sendTypeValue.value === SendType.SpecifiedDate && (
          <>
            <span>发送时间：</span>
            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value={dateValue}
              onChange={(e) =>
                setDateValue((e.target as HTMLInputElement).value)
              }
              className={styles.dateInput}
            />
          </>
        )}
        {sendTypeValue.value === SendType.SendPeriodically && (
          <Scheduler
            cron={cronExp}
            setCron={setCronExp}
            setCronError={setCronError}
            isAdmin={isAdmin}
            locale={"zh_CN"}
          />
        )}
      </div>

      {(sendTypeValue.value === SendType.SpecifiedDate ||
        sendTypeValue.value === SendType.SendPeriodically) && (
        <TextField
          id="Autocomplete-messageParamsId"
          label="标题"
          multiline
          value={titleParams}
          style={{ width: 1550, marginTop: 10 }}
          onChange={(e) => setTitleParams((e.target as HTMLInputElement).value)}
        />
      )}

      <div className={styles.textarea}>
        {(isShowInputOrUpload === MessageWidgetShowStatus.ShowInput ||
          isShowInputOrUpload === MessageWidgetShowStatus.ShowAll) && (
          <TextField
            id="Autocomplete-messageParamsId"
            label="发送内容"
            multiline
            value={messageParams}
            className={styles.multilineTextField}
            rows={12}
            onChange={(e) =>
              setMessageParams((e.target as HTMLInputElement).value)
            }
          />
        )}
      </div>
      {isShowMessageParams && (
        <div className={styles.textarea}>
          <TextField
            id="TextField-paramsJsonId"
            label="参数Json"
            className={styles.multilineTextField}
            multiline
            rows={12}
          />
        </div>
      )}
      <SelectTargetDialog
        open={isShowDialog}
        AppId={corpAppValue ? corpAppValue.appId : ""}
        departmentList={departmentList}
        flattenDepartmentList={flattenDepartmentList}
        isLoading={isTreeViewLoading}
        tagsList={tagsList}
        setOpenFunction={setIsShowDialog}
        getDialogValue={getDialogValue}
      />
      {(sendTypeValue.value === SendType.SpecifiedDate ||
        sendTypeValue.value === SendType.SendPeriodically) && (
        <SendNotice rowList={rowList} />
      )}
    </div>
  );
};
export default SendMessage;
