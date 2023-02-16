import { memo } from "react"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import styles from "./index.module.scss"
import { SelectContentProps } from "./props"
import { useAction } from "./hook"
import SelectTargetDialog from "../select-target-dialog"
import {
  messageTypeList,
  sendTypeList,
  timeZone
} from "../../../../dtos/send-message-job"
import {
  FileObject,
  MessageDataFileType,
  MessageJobSendType,
  PictureText
} from "../../../../dtos/enterprise"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import TimeSelector from "../time-selector"
import DateSelector from "../date-selector"

const SelectContent = memo((props: SelectContentProps) => {
  const {
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    showErrorPrompt,
    clearData,
    isFromNoticeSetting = false
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
    fileDelete
  } = useAction({
    getSendData,
    isNewOrUpdate,
    getUpdateData,
    updateMessageJobInformation,
    showErrorPrompt,
    clearData
  })

  const fileOrImage = (file: FileObject, state: string) => {
    if ((!!file.fileContent || !!file.fileUrl) && !!file.fileName)
      switch (file?.fileType) {
        case MessageDataFileType.Image: {
          return (
            <div>
              {state === "new" ? "这次上传内容:" : "上次上传内容:"}
              <div className={styles.picturebackground}>
                <div style={{ position: "relative" }}>
                  <img
                    className={styles.image}
                    src={state === "new" ? file?.fileContent : file?.fileUrl}
                    alt={file?.fileName}
                  />

                  {state === "new" && (
                    <HighlightOffIcon
                      className={styles.deleteIcon}
                      onClick={() => fileDelete("file")}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        }
        default: {
          return (
            <div>
              {state === "new" ? "这次上传内容:" : "上次上传内容:"}
              <div className={styles.picturebackground}>
                <a href={state === "new" ? file?.fileContent : file?.fileUrl}>
                  {file?.fileName}
                </a>
                {state === "new" && (
                  <HighlightOffIcon
                    className={styles.deleteIcon}
                    onClick={() => fileDelete("file")}
                  />
                )}
              </div>
            </div>
          )
        }
      }
  }

  const pictureImage = (pictureText: PictureText[], state: string) => {
    return (
      pictureText.length > 0 && (
        <div>
          {state === "new" ? "这次上传内容:" : "上次上传内容:"}
          <div className={styles.picturebackground}>
            {pictureText.map((item, index) => (
              <div style={{ position: "relative" }} key={index}>
                <img
                  src={state === "new" ? item.fileContent : item?.fileUrl}
                  className={styles.image}
                  alt={item.title}
                />
                {state === "new" && (
                  <HighlightOffIcon
                    className={styles.deleteIcon}
                    onClick={() => fileDelete("picture", index)}
                  />
                )}
              </div>
            ))}
          </div>
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
              style={{ marginRight: "1.6rem" }}
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
              style={{ marginRight: "1.6rem" }}
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
          style={{ marginRight: isFromNoticeSetting ? "0rem" : "1.6rem" }}
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
        <FormControl
          className={styles.inputWrap}
          style={{ marginRight: "1.6rem" }}
        >
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

        <Button
          sx={{
            height: "3.5rem",
            fontSize: "1rem",
            flexShrink: "0",
            marginTop: "0.8rem"
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
                rows={6}
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
            <div style={{ flex: 1 }}>
              <div className={styles.uploadBtnBox}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    width: "6rem"
                  }}
                >
                  上传文件
                  {messageTypeValue.title === "图文" ? (
                    <input
                      ref={inputRef}
                      hidden
                      type="file"
                      accept="image/jpg,image/png"
                      multiple
                      onChange={(e) =>
                        !!e.target.files &&
                        fileUpload(e.target.files, "图文", e)
                      }
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      hidden
                      type="file"
                      accept={fileAccept}
                      onChange={(e) =>
                        !!e.target.files &&
                        fileUpload(e.target.files, "文件", e)
                      }
                    />
                  )}
                </Button>
              </div>
              <div className={styles.information}>
                {lastTimeFile !== undefined &&
                  lastTimePictureText !== undefined && (
                    <>
                      <div className={styles.sendBox}>
                        {displayByType(
                          "old",
                          lastTimeFile,
                          lastTimePictureText
                        )}
                      </div>
                      <div className={styles.separate} />
                    </>
                  )}
                <div className={styles.sendBox}>
                  {displayByType("new", file, pictureText)}
                </div>
              </div>
            </div>
          )}
        </div>
        {(sendTypeValue === MessageJobSendType.Delayed ||
          sendTypeValue === MessageJobSendType.Recurring) && (
          <div>
            <FormControl
              style={{
                width: 252,
                margin: "0.8rem 0"
              }}
            >
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
          </div>
        )}
        <DateSelector
          sendTypeValue={sendTypeValue}
          dateValue={dateValue}
          setDateValue={setDateValue}
          showErrorPrompt={showErrorPrompt}
        />
        <TimeSelector
          sendTypeValue={sendTypeValue}
          cronExp={cronExp}
          setCronExp={setCronExp}
          setCronError={setCronError}
          endDateValue={endDateValue}
          setEndDateValue={setEndDateValue}
        />
      </div>
    </div>
  )
})

export default SelectContent
