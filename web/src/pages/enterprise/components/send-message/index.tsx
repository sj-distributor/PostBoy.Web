import Button from "@mui/material/Button"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"
import { MessageWidgetShowStatus, SendType } from "../../../../dtos/enterprise"
import SelectTargetDialog from "../select-target-dialog"
import useAction from "./hook"
import styles from "./index.module.scss"
import SendNotice from "../../../notification"
import Scheduler from "smart-cron"
import { Alert, Snackbar } from "@mui/material"
import ModalBox from "../../../../components/modal/modal"
import SelectContent from "../select-content"

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
    departmentAndUserList,
    isTreeViewLoading,
    flattenDepartmentList,
    tagsList,
    sendTypeList,
    sendTypeValue,
    cronExp,
    isAdmin,
    timeZone,
    timeZoneValue,
    titleParams,
    dto,
    openError,
    openSuccess,
    departmentKeyValue,
    promptText,
    setDepartmentAndUserList,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    setIsShowMessageParams,
    setSendTypeValue,
    setCronExp,
    setCronError,
    setDateValue,
    setTimeZoneValue,
    setTitleParams,
    updateData,
    getMessageJob,
    onUploadFile,
    onScrolling,
    setTagsValue,
    sendRecordRef,
    sendRecordOpen,
    sendRecordClose,
  } = useAction()

  return (
    <div className={styles.sendMsgBox}>
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <Snackbar
        open={openSuccess}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          send success!
        </Alert>
      </Snackbar>
      <div className={styles.selectInputBox}>
        <SelectContent
          inputClassName={styles.inputWrap}
          corpAppValue={corpAppValue}
          corpsList={corpsList}
          corpAppList={corpAppList}
          corpsValue={corpsValue}
          messageTypeList={messageTypeList}
          messageTypeValue={messageTypeValue}
          sendTypeValue={sendTypeValue}
          sendTypeList={sendTypeList}
          timeZone={timeZone}
          timeZoneValue={timeZoneValue}
          setCorpsValue={setCorpsValue}
          setCorpAppValue={setCorpAppValue}
          setMessageTypeValue={setMessageTypeValue}
          setSendTypeValue={setSendTypeValue}
          setTimeZoneValue={setTimeZoneValue}
          setIsShowDialog={setIsShowDialog}
        />
        <Button
          sx={{
            height: "3.5rem",
            width: "7rem",
            fontSize: "1rem",
            marginLeft: "1.5rem",
          }}
          variant="contained"
          onClick={() => handleSubmit(sendTypeValue)}
        >
          发 送
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Switch
          sx={{ display: "none" }}
          value={isShowMessageParams}
          onChange={(e) => {
            setIsShowMessageParams((e.target as HTMLInputElement).checked)
          }}
        />
        <Button style={{ display: "flex" }} onClick={() => sendRecordOpen()}>
          发送记录
        </Button>
      </div>

      <SelectTargetDialog
        open={isShowDialog}
        AppId={corpAppValue ? corpAppValue.appId : ""}
        departmentAndUserList={departmentAndUserList}
        departmentKeyValue={departmentKeyValue}
        flattenDepartmentList={flattenDepartmentList}
        isLoading={isTreeViewLoading}
        tagsList={tagsList}
        setOpenFunction={setIsShowDialog}
        setDeptUserList={setDepartmentAndUserList}
        listScroll={onScrolling}
        setOuterTagsValue={setTagsValue}
      />

      <div className={styles.checkboxAndUploadBox}>
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
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={(e) => !!e.target.files && onUploadFile(e.target.files)}
            />
          </Button>
        )}
      </div>

      <div className={styles.cycleSelectWrap}>
        {sendTypeValue === SendType.SpecifiedDate && (
          <TextField
            id="datetime-local"
            label="发送时间"
            type="datetime-local"
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setDateValue((e.target as HTMLInputElement).value)}
          />
        )}
        {sendTypeValue === SendType.SendPeriodically && (
          <Scheduler
            cron={cronExp}
            setCron={setCronExp}
            setCronError={setCronError}
            isAdmin={isAdmin}
            locale={"zh_CN"}
          />
        )}
      </div>

      {(isShowInputOrUpload === MessageWidgetShowStatus.ShowInput ||
        isShowInputOrUpload === MessageWidgetShowStatus.ShowAll) &&
        (sendTypeValue === SendType.SpecifiedDate ||
          sendTypeValue === SendType.SendPeriodically) && (
          <TextField
            id="Autocomplete-messageParamsId"
            label="标题"
            multiline
            value={titleParams}
            style={{ width: 1550, marginTop: 10 }}
            onChange={(e) =>
              setTitleParams((e.target as HTMLInputElement).value)
            }
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

      <ModalBox
        ref={sendRecordRef}
        onCancel={() => sendRecordClose}
        title={"发送记录"}
      >
        <SendNotice
          dto={dto}
          updateData={updateData}
          getMessageJob={getMessageJob}
          corpAppValue={corpAppValue}
          corpsList={corpsList}
          corpAppList={corpAppList}
          corpsValue={corpsValue}
          messageTypeList={messageTypeList}
          messageTypeValue={messageTypeValue}
          sendTypeValue={sendTypeValue}
          sendTypeList={sendTypeList}
          timeZone={timeZone}
          timeZoneValue={timeZoneValue}
          setCorpsValue={setCorpsValue}
          setCorpAppValue={setCorpAppValue}
          setMessageTypeValue={setMessageTypeValue}
          setSendTypeValue={setSendTypeValue}
          setTimeZoneValue={setTimeZoneValue}
          setIsShowDialog={setIsShowDialog}
        />
      </ModalBox>
    </div>
  )
}

export default SendMessage
