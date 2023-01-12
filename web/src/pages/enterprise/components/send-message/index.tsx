import { Button, CircularProgress, Slide, Slider, Snackbar } from "@mui/material";
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
    corpsListLoading,
    corpAppListLoading,
    corAppValue,
    isShowTips,
    setIsShowTips,
    handleSubmit,
    setMessageParams,
    handleCorpAppListClick,
    TransitionLeft,
    handleCorpsListChange
  } = useAction();

  const muiSxStyle = { width: "15vw" };

  return (
    <div>
      <div className={styles.inputBox}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={corpsList ? corpsList : []}
          sx={muiSxStyle}
          loading={corpsListLoading}
          getOptionLabel={(option) => option.corpName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e) => {
            handleCorpsListChange((e.target as HTMLLIElement).textContent as string);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="选择企业"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {corpsListLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
          value={corAppValue}
          options={corpAppData ? corpAppData : []}
          sx={muiSxStyle}
          loading={corpAppListLoading}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onFocus={() => {
            handleCorpAppListClick();
          }}
          onBlur={() => {
            setIsShowTips(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="选择应用"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {corpAppListLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
          sx={muiSxStyle}
          getOptionLabel={(option) => option.title}
          groupBy={(option) => option.groupBy}
          renderInput={(params) => <TextField {...params} label="消息类型" />}
        />
        <TextField
          id="combo-box-demo"
          label="消息参数"
          sx={muiSxStyle}
          value={messageParams}
          onChange={(e) => setMessageParams((e.target as HTMLInputElement).value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          发送
        </Button>
      </div>
      <div className={styles.textarea}>
        <TextField
          className={styles.multilineTextField}
          id="outlined-multiline-static"
          label="参数Json"
          multiline
          minRows={12}
        />
      </div>
      <Snackbar
        message="请先选择企业"
        autoHideDuration={3000}
        TransitionComponent={TransitionLeft}
        open={isShowTips}
        onClose={(event, reason) => {
          reason !== "clickaway" && setIsShowTips(false);
        }}
      />
    </div>
  );
};
export default SendMessage;
