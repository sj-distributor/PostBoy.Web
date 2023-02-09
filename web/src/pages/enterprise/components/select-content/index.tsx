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
import Scheduler from "smart-cron"
import { MessageDataType, MessageJobType } from "../../../../dtos/enterprise"
import moment from "moment"

const SelectContent = memo(
  (props: SelectContentProps) => {
    const {
      inputClassName,
      sendTypeList,
      sendTypeValue,
      setSendTypeValue,
      corpAppValue,
      corpsValue,
      messageTypeList,
      messageTypeValue,
      timeZone,
      timeZoneValue,
      setCorpsValue,
      setCorpAppValue,
      setMessageTypeValue,
      setTimeZoneValue,
      setIsShowDialog,
      isShowDialog,
      cronExp,
      setCronExp,
      dateValue,
      setDateValue,
      endDateValue,
      setEndDateValue,
      setTagsValue,
      setSendObject,
      title,
      setTitle,
      content,
      setContent,
      oldFile,
      setFile,
    } = props

    const {
      corpsList,
      corpAppList,
      departmentKeyValue,
      searchKeyValue,
      isTreeViewLoading,
      tagsList,
      setCronError,
      departmentAndUserList,
      setDepartmentAndUserList,
      fileUpload,
    } = useAction({
      corpsValue,
      corpAppValue,
      setCorpsValue,
      setCorpAppValue,
      setSendObject,
      setFile,
    })

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
                className={inputClassName}
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
                className={inputClassName}
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
            className={inputClassName}
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
          <FormControl className={inputClassName}>
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
          <FormControl className={inputClassName}>
            <InputLabel id="demo-simple-select-label">时区</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={timeZoneValue}
              label="时区"
              onChange={(e) => {
                setTimeZoneValue(Number(e.target.value))
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
          />
        </div>
        <div className={styles.typeShow}>
          <div className={styles.rowBox}>
            {(messageTypeValue.type === MessageDataType.Text ||
              (messageTypeValue.type === MessageDataType.Image &&
                messageTypeValue.groupBy === "")) && (
              <div className={styles.titleAndContentinputBox}>
                <TextField
                  className={styles.input}
                  label="标题"
                  variant="outlined"
                  rows={4}
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  className={styles.input}
                  label="内容"
                  multiline
                  rows={4}
                  variant="outlined"
                  defaultValue={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}

            {(messageTypeValue.groupBy === "文件" ||
              (messageTypeValue.type === MessageDataType.Image &&
                messageTypeValue.groupBy === "")) && (
              <div
                className={styles.uploadBtnBox}
                style={{
                  paddingLeft:
                    messageTypeValue.groupBy === "文件" ? "0" : "2rem",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    !!e.target.files && fileUpload(e.target.files)
                  }
                />
                {!!oldFile && (
                  <div>
                    上次上传内容:
                    <a href={!!oldFile?.fileUrl ? oldFile?.fileUrl : ""}>
                      {oldFile?.fileName}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={styles.rowBox}>
            {sendTypeValue === MessageJobType.Delayed && (
              <TextField
                label="发送时间"
                type="datetime-local"
                sx={{ width: 250, marginTop: 2 }}
                defaultValue={
                  !!dateValue
                    ? moment(dateValue).format("yyyy-MM-DDThh:mm")
                    : ""
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
            {sendTypeValue === MessageJobType.Recurring && (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {!!cronExp && (
                  <Scheduler
                    cron={cronExp}
                    setCron={setCronExp}
                    setCronError={setCronError}
                    isAdmin={true}
                    locale={"zh_CN"}
                  />
                )}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.inputClassName === nextProps.inputClassName &&
      prevProps.sendTypeList === nextProps.sendTypeList &&
      prevProps.sendTypeValue === nextProps.sendTypeValue &&
      prevProps.corpAppValue === nextProps.corpAppValue &&
      prevProps.corpsValue === nextProps.corpsValue &&
      prevProps.messageTypeList === nextProps.messageTypeList &&
      prevProps.messageTypeValue === nextProps.messageTypeValue &&
      prevProps.timeZone === nextProps.timeZone &&
      prevProps.timeZoneValue === nextProps.timeZoneValue &&
      prevProps.isShowDialog === nextProps.isShowDialog &&
      prevProps.cronExp === nextProps.cronExp &&
      prevProps.dateValue === nextProps.dateValue &&
      prevProps.endDateValue === nextProps.endDateValue
    )
  }
)

export default SelectContent
