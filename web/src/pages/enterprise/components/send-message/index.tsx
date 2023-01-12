import { Button } from "@mui/material";
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
    isShowCorpAndApp,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit
  } = useAction();

  const muiSxStyle = { width: "15rem" };

  return (
    <div>
      <div className={styles.inputBox}>
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
                <p className={params.group === "文件" ? styles.groupLabel : ""}>
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
          minRows={12}
          multiline
        />
      </div>
    </div>
  );
};
export default SendMessage;
