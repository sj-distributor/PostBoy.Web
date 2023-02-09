import styles from "./index.module.scss"
import { useAction } from "./hook"
import { memo } from "react"
import { NoticeSettingProps } from "./props"
import { MessageJobType } from "../../../../dtos/enterprise"
import SelectContent from "../../../enterprise/components/select-content"
import {
  messageTypeList,
  sendTypeList,
  timeZone,
} from "../../../enterprise/components/send-message/hook"

const NoticeSetting = memo(
  (props: NoticeSettingProps) => {
    const { updateMessageJobInformation } = props

    const {
      corpsValue,
      setCorpsValue,
      corpAppValue,
      setCorpAppValue,
      messageFileType,
      setMessageFileType,
      type,
      setType,
      timeZoneValue,
      setTimeZoneValue,
      isShowDialog,
      setIsShowDialog,
      cronExp,
      setCronExp,
      dateValue,
      setDateValue,
      endDateValue,
      setEndDateValue,
      setTagsValue,
      setSendObject,
    } = useAction({ updateMessageJobInformation })

    return (
      <div className={styles.noticeWrap}>
        <div>
          <SelectContent
            inputClassName={styles.inputWrap}
            sendTypeList={sendTypeList.filter(
              (item) => item.value !== MessageJobType.Fire
            )}
            sendTypeValue={type}
            setSendTypeValue={setType}
            timeZone={timeZone}
            timeZoneValue={timeZoneValue}
            setTimeZoneValue={setTimeZoneValue}
            messageTypeList={messageTypeList}
            messageTypeValue={messageFileType}
            setMessageTypeValue={setMessageFileType}
            corpsValue={corpsValue}
            corpAppValue={corpAppValue}
            setCorpsValue={setCorpsValue}
            setCorpAppValue={setCorpAppValue}
            isShowDialog={isShowDialog}
            setIsShowDialog={setIsShowDialog}
            cronExp={cronExp}
            setCronExp={setCronExp}
            dateValue={dateValue}
            setDateValue={setDateValue}
            endDateValue={endDateValue}
            setEndDateValue={setEndDateValue}
            setTagsValue={setTagsValue}
            setSendObject={setSendObject}
          />
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
