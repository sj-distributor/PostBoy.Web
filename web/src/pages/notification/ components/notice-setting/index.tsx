import { TextField } from "@mui/material"
import styles from "./index.module.scss"
import { useAction } from "./hook"
import { memo, useState } from "react"
import { NoticeSettingProps } from "./props"
import { SendType } from "../../../../dtos/enterprise"
import Scheduler from "smart-cron"
import SelectContent from "../../../enterprise/components/select-content"

const NoticeSetting = memo(
  (props: NoticeSettingProps) => {
    const {
      updateMessageJobInformation,
      corpAppValue,
      corpsList,
      corpAppList,
      corpsValue,
      messageTypeList,
      messageTypeValue,
      sendTypeValue,
      sendTypeList,
      timeZone,
      timeZoneValue,
      setCorpsValue,
      setCorpAppValue,
      setMessageTypeValue,
      setSendTypeValue,
      setTimeZoneValue,
      setIsShowDialog,
    } = props

    const {
      isShowName,
      nameList,
      onClickName,
      setIsShowName,
      content,
      setContent,
      textInput,
      clickAction,
    } = useAction()

    const [cronExpChange, setCronExpChange] = useState<string>(
      updateMessageJobInformation.jobSettingJson
    )
    const [dateValueChange, setDateValueChange] = useState(
      updateMessageJobInformation.jobSettingJson
    )
    const [cronError, setCronError] = useState<string>("")

    console.log("updateMessageJobInformation", updateMessageJobInformation)
    return (
      <div className={styles.noticeWrap}>
        <div className={styles.noticeRow}>
          <TextField
            required
            id="standard-required"
            label="标题"
            style={{ flex: 1 }}
          />
        </div>
        <div className={styles.noticeRow}>
          <div onBlur={() => setIsShowName.setFalse()}>
            <TextField
              required
              inputRef={textInput}
              label="内容"
              style={{ width: 720 }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => {
                if (content.charAt(content.length - 1) === "@") {
                  setIsShowName.setTrue()
                  clickAction.setFalse()
                } else {
                  setIsShowName.setFalse()
                  clickAction.setTrue()
                }
              }}
            />
            {isShowName && (
              <div
                className={styles.nameList}
                onClick={() => textInput.current?.focus()}
              >
                {nameList.map((item, index) => (
                  <div
                    key={index}
                    className={styles.nameItem}
                    onMouseDown={() => {
                      onClickName(item)
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
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
        </div>
        <div className={styles.cycleSelectWrap}>
          {sendTypeValue === SendType.SpecifiedDate && (
            <TextField
              id="datetime-local"
              label="发送时间"
              type="datetime-local"
              sx={{ width: 250 }}
              value={dateValueChange}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setDateValueChange((e.target as HTMLInputElement).value)
              }
            />
          )}
          {sendTypeValue === SendType.SendPeriodically && (
            <Scheduler
              cron={cronExpChange}
              setCron={setCronExpChange}
              setCronError={setCronError}
              isAdmin={true}
              locale={"zh_CN"}
            />
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.updateMessageJobInformation ===
      nextProps.updateMessageJobInformation
    )
  }
)

export default NoticeSetting
