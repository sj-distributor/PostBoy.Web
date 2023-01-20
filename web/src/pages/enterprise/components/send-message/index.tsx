import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MessageWidgetShowStatus } from "../../../../dtos/enterprise";
import SelectTargetDialog from "../select-target-dialog";
import useAction from "./hook";
import styles from "./index.module.scss";

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
    setDialogValue,
    isShowMessageParams,
    departmentList,
    isTreeViewLoading,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    getDialogValue,
    setIsShowMessageParams
  } = useAction();

  const muiSxStyle = { width: "15rem", margin: "0 2rem" };

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
        <Button
          sx={{
            height: "3.5rem",
            fontSize: "1rem",
            flexShrink: "0",
            margin: "0 2rem"
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
            margin: "0 2rem"
          }}
          variant="contained"
          onClick={handleSubmit}
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
              margin: "0 2rem"
            }}
          >
            Upload
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        )}
      </div>

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
        isLoading={isTreeViewLoading}
        setOpenFunction={setIsShowDialog}
        getDialogValue={getDialogValue}
      />
    </div>
  );
};
export default SendMessage;
