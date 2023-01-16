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
    messageTypeList,
    messageParams,
    corpsValue,
    corpAppValue,
    messageTypeValue,
    isShowCorpAndApp,
    isShowDialog,
    isShowInputOrUpload,
    setDialogValue,
    isShowMessageParams,
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
        {isShowCorpAndApp && (
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
                <TextField {...params} label="选择企业" />
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
              sx={muiSxStyle}
              disableClearable={true}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                setCorpAppValue(value);
              }}
              renderInput={(params) => (
                <TextField {...params} label="选择应用" />
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
          renderInput={(params) => <TextField {...params} label="消息类型" />}
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
        <Button
          sx={{
            height: "3.5rem",
            fontSize: "1rem",
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
      <FormGroup
        sx={{ display: "inline-block", userSelect: "none", marginTop: "1rem" }}
      >
        <FormControlLabel
          control={
            <Switch
              value={isShowMessageParams}
              onChange={(e) => {
                setIsShowMessageParams((e.target as HTMLInputElement).checked);
              }}
            />
          }
          label="查看完整参数"
        />
      </FormGroup>
      <div className={styles.textarea}>
        {(isShowInputOrUpload === MessageWidgetShowStatus.ShowInput ||
          isShowInputOrUpload === MessageWidgetShowStatus.ShowAll) && (
          <TextField
            id="Autocomplete-messageParamsId"
            label="消息参数"
            minRows={12}
            multiline
            value={messageParams}
            className={styles.multilineTextField}
            rows={12}
            maxRows={12}
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
            maxRows={12}
          />
        </div>
      )}
      {isShowDialog && (
        <SelectTargetDialog
          open={isShowDialog}
          setOpenFunction={setIsShowDialog}
          setDialogValue={setDialogValue}
          getDialogValue={getDialogValue}
        />
      )}
    </div>
  );
};
export default SendMessage;
