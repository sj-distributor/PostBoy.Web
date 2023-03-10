import { memo } from "react"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import styles from "./index.module.scss"
import { SelectContentProps } from "./props"
import { useAction } from "./hook"
import SelectTargetDialog from "../select-target-dialog"
import {
  messageTypeList,
  sendTypeList,
  timeZone,
} from "../../../../dtos/send-message-job"
import {
  DeptUserCanSelectStatus,
  FileObject,
  MessageDataFileType,
  MessageJobSendType,
  PictureText,
} from "../../../../dtos/enterprise"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import TimeSelector from "../time-selector"
import DateSelector from "../date-selector"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"
import * as wangEditor from "@wangeditor/editor"

const SelectContent = memo(
  (props: SelectContentProps) => {
    const {
      sendData,
      getSendData,
      isNewOrUpdate,
      getUpdateData,
      updateMessageJobInformation,
      showErrorPrompt,
      clearData,
      isFromNoticeSetting = false,
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
      setIsRefresh,
      departmentAndUserList,
      setDepartmentAndUserList,
      setFlattenDepartmentList,
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
      chatId,
      setChatId,
      groupList,
      setGroupList,
      lastTimeTagsList,
      lastTimePictureText,
      lastTimeFile,
      inputRef,
      fileDelete,
      clickName,
      setClickName,
      fileMark,
      sendType,
      setSendType,
      selectedShowArr,
      editor,
      setEditor,
      html,
      setHtml,
      editorConfig,
      setHtmlText,
    } = useAction({
      outerSendData: sendData,
      getSendData,
      isNewOrUpdate,
      getUpdateData,
      updateMessageJobInformation,
      showErrorPrompt,
      clearData,
    })

    const fileOrImage = (file: FileObject, state: string) => {
      if ((!!file.fileContent || !!file.fileUrl) && !!file.fileName)
        switch (file?.fileType) {
          case MessageDataFileType.Image: {
            return (
              <div>
                {state === "new" ? "??????????????????:" : "??????????????????:"}
                <div className={styles.picturebackground}>
                  <div style={{ position: "relative" }}>
                    <img
                      className={styles.image}
                      src={state === "new" ? file?.fileContent : file?.fileUrl}
                      alt={file?.fileName}
                    />

                    {state === "new" && (
                      <HighlightOffIcon
                        className={styles.deleteIconImage}
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
                {state === "new" ? "??????????????????:" : "??????????????????:"}
                <div className={styles.picturebackground}>
                  <div
                    style={{
                      position: "relative",
                      padding: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={state === "new" ? file?.fileContent : file?.fileUrl}
                    >
                      {file?.fileName}
                    </a>
                    {state === "new" && (
                      <HighlightOffIcon
                        className={styles.deleteIconFile}
                        onClick={() => fileDelete("file")}
                      />
                    )}
                  </div>
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
            {state === "new" ? "??????????????????:" : "??????????????????:"}
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
                      className={styles.deleteIconImage}
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
        : messageTypeValue.title !== "??????"
        ? !!file && fileOrImage(file, state)
        : !!pictureText && pictureImage(pictureText, state)
    }

    const toolbarConfig: Partial<wangEditor.IToolbarConfig> = {
      toolbarKeys: [
        "fontFamily",
        "fontSize",
        "color",
        "|",
        "bold",
        "italic",
        "underline",
        "through",
        "bgColor",
        "sup",
        "sub",
        "|",
        "bulletedList",
        "numberedList",
        "justifyJustify",
        "delIndent",
        "indent",
        "|",
        "insertLink",
        "redo",
        "undo",
        "uploadImage",
      ],
    }

    return (
      <div className={styles.box}>
        <div className={styles.selectWrap}>
          {!!corpsValue && !!corpAppValue && (
            <>
              <Autocomplete
                openOnFocus
                disablePortal
                disableClearable
                value={corpsValue}
                id="Autocomplete-corpsDataId"
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
                    label="????????????"
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
                    label="????????????"
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
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.corpInput}
                type="button"
                label="????????????"
              />
            )}
            renderGroup={(params) => {
              return (
                <div key={params.key}>
                  <p
                    className={
                      params.group === "??????"
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
            <InputLabel id="demo-simple-select-label">????????????</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sendTypeValue}
              label="????????????"
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
              marginTop: "0.8rem",
            }}
            variant="contained"
            onClick={() => {
              setIsShowDialog(true)
              setClickName("??????????????????")
            }}
          >
            ??????????????????
          </Button>

          <SelectTargetDialog
            open={isShowDialog}
            AppId={corpAppValue ? corpAppValue.appId : ""}
            departmentAndUserList={departmentAndUserList}
            departmentKeyValue={departmentKeyValue}
            flattenDepartmentList={searchKeyValue}
            isLoading={isTreeViewLoading}
            tagsList={tagsList}
            groupList={groupList}
            canSelect={DeptUserCanSelectStatus.Both}
            setGroupList={setGroupList}
            setOpenFunction={setIsShowDialog}
            setDeptUserList={setDepartmentAndUserList}
            setOuterTagsValue={setTagsValue}
            setIsRefresh={setIsRefresh}
            lastTagsValue={lastTimeTagsList}
            clickName={clickName}
            chatId={chatId}
            setChatId={setChatId}
            sendType={sendType}
            setSendType={setSendType}
          />
        </div>
        <div className={styles.typeShow}>
          {selectedShowArr.length > 0 && (
            <div className={styles.rowBox}>
              <div className={styles.titleAndContentinputBox}>
                <Autocomplete
                  openOnFocus
                  disablePortal
                  fullWidth
                  multiple
                  readOnly
                  id="Autocomplete-messageTypeListId"
                  disableClearable
                  options={[]}
                  className={styles.input}
                  value={selectedShowArr}
                  popupIcon={<></>}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.chatName
                  }
                  isOptionEqualToValue={(option, value) =>
                    typeof option === "string"
                      ? !!option
                      : typeof value !== "string"
                      ? option.chatId === value.chatId
                      : typeof option === "string"
                      ? option === value
                      : false
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={styles.corpInput}
                      type="button"
                      label="????????????"
                      onClick={() => {
                        setIsShowDialog(true)
                        setClickName("??????????????????")
                      }}
                    />
                  )}
                  PopperComponent={() => <></>}
                  onChange={(e, value) => {}}
                />
              </div>
            </div>
          )}
          <div className={styles.rowBox}>
            <div className={styles.titleAndContentinputBox}>
              <TextField
                className={styles.input}
                label="??????"
                variant="outlined"
                rows={4}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {messageTypeValue.title !== "??????" && (
                <TextField
                  className={styles.input}
                  label="??????"
                  multiline
                  rows={6}
                  variant="outlined"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}
              {messageTypeValue.type === MessageDataFileType.Image &&
                messageTypeValue.groupBy === "" && (
                  <div
                    style={{
                      border: "1px solid #BEBEBE",
                      margin: "0.8rem 0",
                      borderRadius: "4px",
                      padding: "0.05rem",
                    }}
                  >
                    <Toolbar
                      editor={editor}
                      defaultConfig={toolbarConfig}
                      mode="default"
                      style={{ borderBottom: "1px solid #ccc" }}
                    />
                    <Editor
                      defaultConfig={editorConfig}
                      value={html}
                      onCreated={setEditor}
                      onChange={(editor) => {
                        setHtmlText(editor.getText())
                        setHtml(editor.getHtml())
                      }}
                      mode="default"
                      style={{ height: "25rem" }}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className={styles.rowBox}>
            {(messageTypeValue.groupBy === "??????" ||
              (messageTypeValue.type === MessageDataFileType.Image &&
                messageTypeValue.groupBy === "")) && (
              <div style={{ flex: 1 }}>
                <div className={styles.uploadBtnBox}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      width: "6rem",
                    }}
                  >
                    {messageTypeValue.title === "??????" ? (
                      <>
                        ????????????
                        <input
                          ref={inputRef}
                          hidden
                          type="file"
                          accept="image/jpg, image/png"
                          multiple
                          onChange={(e) =>
                            !!e.target.files &&
                            fileUpload(e.target.files, "??????", e)
                          }
                        />
                      </>
                    ) : (
                      <>
                        ????????????
                        <input
                          ref={inputRef}
                          hidden
                          type="file"
                          accept={fileAccept}
                          onChange={(e) =>
                            !!e.target.files &&
                            fileUpload(e.target.files, "??????", e)
                          }
                        />
                      </>
                    )}
                  </Button>
                  {!!fileMark && <div className={styles.mark}>{fileMark}</div>}
                </div>
                <div className={styles.information}>
                  {(lastTimeFile !== undefined ||
                    lastTimePictureText !== undefined) &&
                    isNewOrUpdate === "update" && (
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
                  margin: "0.8rem 0",
                }}
              >
                <InputLabel id="demo-simple-select-label">??????</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={timeZoneValue}
                  label="??????"
                  onChange={(e) => {
                    switchTimeZone(Number(e.target.value))
                  }}
                >
                  {timeZone
                    .filter((x) => !x.disable)
                    .map((item, key) => (
                      <MenuItem key={key} value={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
          {sendTypeValue === MessageJobSendType.Delayed && (
            <DateSelector
              dateValue={dateValue}
              setDateValue={setDateValue}
              showErrorPrompt={showErrorPrompt}
            />
          )}
          {sendTypeValue === MessageJobSendType.Recurring && (
            <TimeSelector
              cronExp={cronExp}
              setCronExp={setCronExp}
              setCronError={setCronError}
              endDateValue={endDateValue}
              setEndDateValue={setEndDateValue}
              showErrorPrompt={showErrorPrompt}
            />
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.sendData === nextProps.sendData && prevProps === nextProps
  }
)

export default SelectContent
