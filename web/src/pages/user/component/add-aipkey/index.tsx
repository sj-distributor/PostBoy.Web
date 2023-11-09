import styles from "./index.module.scss";
import { AlertColor, Button, CircularProgress, TextField } from "@mui/material";
import useAction from "./hook";
import { IUserApikeysResponse } from "../../../../dtos/user-management";
import { memo } from "react";
import { Actions } from "ahooks/lib/useBoolean";

const AddApiKeyPopup = memo(
  (props: {
    userAccountId: string;
    onAddApikeyCancel: () => void;
    userApikeyList: IUserApikeysResponse[][];
    setUserApikey: React.Dispatch<
      React.SetStateAction<IUserApikeysResponse[][]>
    >;
    snackbarAction: Actions;
    setSnackBarData: React.Dispatch<
      React.SetStateAction<{
        severity: AlertColor | undefined;
        text: string;
      }>
    >;
  }) => {
    const {
      userAccountId,
      onAddApikeyCancel,
      userApikeyList,
      setUserApikey,
      snackbarAction,
      setSnackBarData,
    } = props;

    const {
      apiKey,
      setAipKey,
      description,
      setDescription,
      addApiKeySubmit,
      isLoading,
    } = useAction({
      userAccountId,
      onAddApikeyCancel,
      userApikeyList,
      setUserApikey,
      snackbarAction,
      setSnackBarData,
    });

    return (
      <div className={styles.pageWrap}>
        {isLoading && (
          <div className={styles.progress}>
            <CircularProgress
              color="primary"
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )}
        <div className={styles.addBox}>
          <div className={styles.addTitleBox}>
            <div className={styles.title}>Add ApiKey</div>
          </div>
          <TextField
            fullWidth
            label="apiKey"
            className={styles.apiKey}
            value={apiKey}
            onChange={(e) => setAipKey(e.target.value)}
          />
          <TextField
            fullWidth
            label="description"
            className={styles.description}
            value={description}
            multiline
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            className={styles.signInButton}
            onClick={addApiKeySubmit}
            disabled={!apiKey}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
);

export default AddApiKeyPopup;
