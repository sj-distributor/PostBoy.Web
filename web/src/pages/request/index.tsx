import { Alert, Button, Snackbar } from "@mui/material";
import { RequestBody } from "./component/body";
import styles from "./index.module.scss";
import { useAction } from "./hook";
import ModalBox from "../../components/modal/modal";
import SendNotice from "../notification";
import { MessageJobDestination } from "../../dtos/enterprise";

export const SendRequest = () => {
  const {
    promptText,
    openError,
    RequestSend,
    openHistoryRef,
    setSendData,
    whetherClear,
    alertType,
  } = useAction();

  return (
    <div className={styles.request_box}>
      <Snackbar
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity={alertType}>{promptText}</Alert>
      </Snackbar>
      <RequestBody
        setSendData={setSendData}
        whetherClear={whetherClear}
        addOrUpdate={"Add"}
      />
      <div className={styles.btn}>
        <div className={`${styles.grid_6} ${styles.btn_left}`}>
          <Button onClick={RequestSend}>发送</Button>
        </div>
        <div className={`${styles.grid_6} ${styles.btn_left}`}>
          <Button onClick={() => openHistoryRef?.current?.open()}>
            发送列表
          </Button>
        </div>

        <ModalBox
          ref={openHistoryRef}
          onCancel={() => openHistoryRef?.current?.close()}
          title={"发送记录"}
        >
          <SendNotice recordType={MessageJobDestination.HttpRequest} />
        </ModalBox>
      </div>
    </div>
  );
};
