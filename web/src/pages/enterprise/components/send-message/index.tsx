import { Button, CircularProgress, Snackbar } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
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
    setCorpAppValue,
    setMessageParams,
    setCorpsValue,
    setMessageTypeValue,
    handleSubmit,
    handleCorpsListChange,
    TransitionLeft
  } = useAction();

  const muiSxStyle = { width: "15vw" };

  return (
    <div>
      <div className={styles.inputBox}>
        <Autocomplete
          disablePortal
          id="Autocomplete-corpsDataId"
          value={corpsValue}
          disableClearable={true}
          options={corpsList ? corpsList : []}
          sx={muiSxStyle}
          getOptionLabel={(option) => option.corpName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="选择企业" />}
          onChange={(e, value) => {
            handleCorpsListChange(value);
          }}
        />
        <Autocomplete
          disablePortal
          id="Autocomplete-corpAppListId"
          value={corpAppValue}
          options={corpAppList ? corpAppList : []}
          sx={muiSxStyle}
          disableClearable={true}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, value) => {
            setCorpAppValue(value);
          }}
          renderInput={(params) => <TextField {...params} label="选择应用" />}
        />
        <Autocomplete
          disablePortal
          id="Autocomplete-messageTypeListId"
          disableClearable={true}
          options={messageTypeList}
          sx={muiSxStyle}
          value={messageTypeValue}
          onChange={(e, value) => {
            setMessageTypeValue(value);
          }}
          getOptionLabel={(option) => option.title}
          groupBy={(option) => option.groupBy}
          renderInput={(params) => <TextField {...params} label="消息类型" />}
        />
        <TextField
          id="Autocomplete-messageParamsId"
          label="消息参数"
          sx={muiSxStyle}
          value={messageParams}
          onChange={(e) =>
            setMessageParams((e.target as HTMLInputElement).value)
          }
        />
        <Button variant="contained" onClick={handleSubmit}>
          发送
        </Button>
      </div>
      <div className={styles.textarea}>
        <TextField
          id="TextField-paramsJsonId"
          label="参数Json"
          className={styles.multilineTextField}
          multiline
          minRows={12}
        />
      </div>
    </div>
  );
};
export default SendMessage;