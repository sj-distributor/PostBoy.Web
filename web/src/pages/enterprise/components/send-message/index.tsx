import { Button, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import useAction from "./hook";
import styles from "./index.module.scss";

const SendMessage = () => {
  const {
    corpsList,
    corpAppData,
    messageTypeList,
    messageParams,
    handleSubmit,
    getCorpAppList,
    handleCorpsListChange
  } = useAction();

  let loading = false;

  console.log(
    JSON.stringify(corpsList),
    JSON.stringify(corpAppData),
    !!corpsList && corpsList.length > 0 && !!corpAppData && corpAppData[0].id === ""
  );

  return (
    <div>
      <div className={styles.inputBox}>
        <Autocomplete
          className={styles.selectList}
          disablePortal
          id="combo-box-demo"
          onChange={(e) => {
            console.log((e.target as HTMLLIElement).textContent);
            handleCorpsListChange((e.target as HTMLLIElement).textContent as string);
          }}
          options={corpsList}
          sx={{ width: 300 }}
          getOptionLabel={(option) => option.corpName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={!!corpsList}
          renderInput={(params) => (
            <TextField
              {...params}
              label="选择企业"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {!!corpsList && corpsList.length <= 0 ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
        <Autocomplete
          className={styles.selectList}
          disablePortal
          id="combo-box-demo"
          options={corpAppData}
          sx={{ width: 300 }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onFocus={() => {
            loading =
              !!corpsList && corpsList.length > 0 && !!corpAppData && corpAppData[0].id === "";
          }}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="选择应用"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={messageTypeList}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="消息类型" />}
        />
        <Autocomplete
          className={styles.selectList}
          disablePortal
          id="combo-box-demo"
          options={messageParams}
          sx={{ width: 300 }}
          loading={!!messageParams && messageParams.length <= 0}
          renderInput={(params) => (
            <TextField
              {...params}
              label="消息参数"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {!!messageParams && messageParams.length <= 0 ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
        <Button variant="contained" onClick={handleSubmit}>
          发送
        </Button>
      </div>
      <div className={styles.textarea}></div>
    </div>
  );
};
export default SendMessage;
