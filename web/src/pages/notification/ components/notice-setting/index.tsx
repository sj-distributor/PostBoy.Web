import styles from "./index.module.scss"
import { useAction } from "./hook"
import { memo } from "react"
import { NoticeSettingProps } from "./props"
import { Button } from "@mui/material"
import SelectContent from "../../../enterprise/components/select-content"

const NoticeSetting = memo((props: NoticeSettingProps) => {
  const {
    updateMessageJobInformation,
    onNoticeCancel,
    onUpdateMessageJob,
    showErrorPrompt,
  } = props

  const { setUpdateData, clickUpdate } = useAction({ onUpdateMessageJob })

  return (
    <div className={styles.noticeWrap}>
      <div>
        <SelectContent
          getUpdateData={setUpdateData}
          isNewOrUpdate={"update"}
          updateMessageJobInformation={updateMessageJobInformation}
          showErrorPrompt={showErrorPrompt}
          isFromNoticeSetting={true}
        />
      </div>
      <div className={styles.boxButtonWrap}>
        <Button
          variant="contained"
          className={styles.boxButton}
          onClick={() => clickUpdate()}
        >
          提交
        </Button>
        <Button
          variant="contained"
          className={styles.boxButton}
          onClick={onNoticeCancel}
        >
          取消
        </Button>
      </div>
    </div>
  )
})

export default NoticeSetting
