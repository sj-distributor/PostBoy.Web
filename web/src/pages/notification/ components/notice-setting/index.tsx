import styles from "./index.module.scss"
import { useAction } from "./hook"
import { memo } from "react"
import { NoticeSettingProps } from "./props"
import { Button, Snackbar } from "@mui/material"
import SelectContent from "../../../enterprise/components/select-content"

const NoticeSetting = memo((props: NoticeSettingProps) => {
  const { updateMessageJobInformation, onNoticeCancel, onUpdateMessageJob } =
    props

  const {
    setUpdateData,
    setWhetherToCallAPI,
    promptText,
    openError,
    clickUpdate,
  } = useAction({ onUpdateMessageJob })

  return (
    <div className={styles.noticeWrap}>
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <div>
        <SelectContent
          getUpdateData={setUpdateData}
          isNewOrUpdate={"update"}
          updateMessageJobInformation={updateMessageJobInformation}
          setWhetherToCallAPI={setWhetherToCallAPI}
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
