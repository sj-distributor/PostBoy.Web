import { memo } from "react"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import styles from "./index.module.scss"
import { SelectContentProps } from "./props"
import { useAction } from "./hook"
import SelectTargetDialog from "../select-target-dialog"
import Scheduler from "smart-cron"
import moment from "moment"
import {
  messageTypeList,
  sendTypeList,
  timeZone,
} from "../../../../dtos/send-message-job"
import {
  FileObject,
  MessageDataFileType,
  MessageJobSendType,
  PictureText,
} from "../../../../dtos/enterprise"

const SelectContent = memo((props: SelectContentProps) => {
  const {
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    setWhetherToCallAPI,
  } = props

  const {
    corpsValue,
    setCorpsValue,
    corpAppValue,
    setCorpAppValue,
    corpsList,
    corpAppList,
    messageTypeValue,
    setMessageTypeValue,
    sendTypeValue,
    setSendTypeValue,
    timeZoneValue,
    isShowDialog,
    setIsShowDialog,
    departmentAndUserList,
    setDepartmentAndUserList,
    departmentKeyValue,
    searchKeyValue,
    isTreeViewLoading,
    tagsList,
    setTagsValue,
    title,
    setTitle,
    content,
    setContent,
    fileUpload,
    fileAccept,
    file,
    pictureText,
    dateValue,
    setDateValue,
    endDateValue,
    setEndDateValue,
    cronExp,
    setCronExp,
    setCronError,
    switchTimeZone,
    isLoadStop,
    lastTimeTagsList,
    lastTimePictureText,
    lastTimeFile,
    inputRef,
  } = useAction({
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    setWhetherToCallAPI,
  })

  const fileOrImage = (file: FileObject, state: string) => {
    if ((!!file.fileContent || !!file.fileUrl) && !!file.fileName)
      switch (file?.fileType) {
        case MessageDataFileType.Image: {
          return (
            <div className={styles.picturebackground}>
              <img
                className={styles.image}
                src={state === "new" ? file?.fileContent : file?.fileUrl}
                alt={file?.fileName}
              />
            </div>
          )
        }
        default: {
          return (
            <div className={styles.picturebackground}>
              <a href={state === "new" ? file?.fileContent : file?.fileUrl}>
                {file?.fileName}
              </a>
            </div>
          )
        }
      }
  }

  const pictureImage = (pictureText: PictureText[], state: string) => {
    return (
      pictureText.length > 0 && (
        <div className={styles.picturebackground}>
          {pictureText.map((item, index) => (
            <img
              src={state === "new" ? item.fileContent : item?.fileUrl}
              className={styles.image}
              alt={item.title}
              key={index}
            />
          ))}
        </div>
      )
    )
  }

  const displayByType = (
    state: string,
    file?: FileObject,
    pictureText?: PictureText[]
  ) => {
    return state === "old"
      ? file !== undefined
        ? !!file && fileOrImage(file, state)
        : !!pictureText && pictureImage(pictureText, state)
      : messageTypeValue.title !== "图文"
      ? !!file && fileOrImage(file, state)
      : !!pictureText && pictureImage(pictureText, state)
  }

  return (
    <div className={styles.box}>
      <div className={styles.selectWrap}>
        {!!corpsValue && !!corpAppValue && (
          <>
            <Autocomplete
              openOnFocus
              disablePortal
              id="Autocomplete-corpsDataId"
              value={corpsValue}
              disableClearable={true}
              options={corpsList}
              className={styles.inputWrap}
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
                setCorpsValue(value)
              }}
            />
            <Autocomplete
              openOnFocus
              disablePortal
              id="Autocomplete-corpAppListId"
              value={corpAppValue}
              options={corpAppList}
              className={styles.inputWrap}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                setCorpAppValue(value)
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
          openOnFocus
          disablePortal
          id="Autocomplete-messageTypeListId"
          disableClearable={true}
          options={messageTypeList}
          className={styles.inputWrap}
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
            )
          }}
          onChange={(e, value) => {
            setMessageTypeValue(value)
          }}
        />
        <FormControl className={styles.inputWrap}>
          <InputLabel id="demo-simple-select-label">发送类型</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sendTypeValue}
            label="发送类型"
            onChange={(e) => {
              setSendTypeValue(Number(e.target.value))
            }}
          >
            {sendTypeList.map((item, key) => (
              <MenuItem key={key} value={item.value}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={styles.inputWrap}>
          <InputLabel id="demo-simple-select-label">时区</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={timeZoneValue}
            label="时区"
            onChange={(e) => {
              switchTimeZone(Number(e.target.value))
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
            // margin: "0 1rem",
          }}
          variant="contained"
          onClick={() => {
            setIsShowDialog(true)
          }}
        >
          选择发送目标
        </Button>

        <SelectTargetDialog
          open={isShowDialog}
          AppId={corpAppValue ? corpAppValue.appId : ""}
          departmentAndUserList={departmentAndUserList}
          departmentKeyValue={departmentKeyValue}
          flattenDepartmentList={searchKeyValue}
          isLoading={isTreeViewLoading}
          tagsList={tagsList}
          setOpenFunction={setIsShowDialog}
          setDeptUserList={setDepartmentAndUserList}
          setOuterTagsValue={setTagsValue}
          isLoadStop={isLoadStop}
          lastTagsValue={lastTimeTagsList}
        />
      </div>
      <div className={styles.typeShow}>
        <div className={styles.rowBox}>
          <div className={styles.titleAndContentinputBox}>
            <TextField
              className={styles.input}
              label="标题"
              variant="outlined"
              rows={4}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {(messageTypeValue.type === MessageDataFileType.Text ||
              (messageTypeValue.type === MessageDataFileType.Image &&
                messageTypeValue.groupBy === "")) && (
              <TextField
                className={styles.input}
                label="内容"
                multiline
                rows={4}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className={styles.rowBox}>
          {(messageTypeValue.groupBy === "文件" ||
            (messageTypeValue.type === MessageDataFileType.Image &&
              messageTypeValue.groupBy === "")) && (
            <div className={styles.uploadBtnBox}>
              {messageTypeValue.title === "图文" ? (
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    !!e.target.files && fileUpload(e.target.files, "图文", e)
                  }
                />
              ) : (
                <input
                  ref={inputRef}
                  type="file"
                  accept={fileAccept}
                  onChange={(e) =>
                    !!e.target.files && fileUpload(e.target.files, "文件", e)
                  }
                />
              )}

              <div className={styles.information}>
                {(lastTimeFile !== undefined ||
                  lastTimePictureText !== undefined) && (
                  <>
                    <div className={styles.box}>
                      上次上传内容:
                      {displayByType("old", lastTimeFile, lastTimePictureText)}
                    </div>
                    <div className={styles.separate} />
                  </>
                )}
                <div className={styles.box}>
                  这次上传内容:
                  {displayByType("new", file, pictureText)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.rowBox}>
          {sendTypeValue === MessageJobSendType.Delayed && (
            <TextField
              label="发送时间"
              type="datetime-local"
              sx={{ width: 250, marginTop: 2 }}
              defaultValue={
                !!dateValue ? moment(dateValue).format("yyyy-MM-DDThh:mm") : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const time = moment(
                  (e.target as HTMLInputElement).value
                ).valueOf()
                const nowTime = moment(new Date()).valueOf()
                if (time <= nowTime) {
                  // showErrorPrompt(
                  //   "Please select a time later than the current time"
                  // )
                } else {
                  setDateValue((e.target as HTMLInputElement).value)
                }
              }}
            />
          )}
          {sendTypeValue === MessageJobSendType.Recurring && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Scheduler
                cron={cronExp}
                setCron={setCronExp}
                setCronError={setCronError}
                isAdmin={true}
                locale={"zh_CN"}
              />

              <div className={styles.separate} />
              <TextField
                label="终止时间"
                type="datetime-local"
                sx={{ width: 250, marginTop: 2 }}
                defaultValue={
                  !!endDateValue
                    ? moment(endDateValue).format("yyyy-MM-DDThh:mm")
                    : ""
                }
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  setEndDateValue((e.target as HTMLInputElement).value)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default SelectContent
