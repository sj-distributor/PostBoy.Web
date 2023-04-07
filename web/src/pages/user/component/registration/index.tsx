import styles from "./index.module.scss"
import { Button, CircularProgress, TextField } from "@mui/material"
import useAction from "./hook"
import { IUserResponse } from "../../../../dtos/user-management"
import { memo } from "react"
import { Actions } from "ahooks/lib/useBoolean"

const RegistrationPopup = memo(
  (props: {
    onRegisterCancel: () => void
    setUsersList: React.Dispatch<React.SetStateAction<IUserResponse[]>>
    successAction: Actions
  }) => {
    const { onRegisterCancel, setUsersList, successAction } = props

    const {
      username,
      setUsername,
      password,
      setPassword,
      registerSubmit,
      isLoading,
    } = useAction({ onRegisterCancel, setUsersList, successAction })

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
        <div className={styles.loginBox}>
          <div className={styles.signInTitleBox}>
            <div className={styles.title}>Register</div>
          </div>
          <TextField
            fullWidth
            label="Username"
            className={styles.signInUsername}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            className={styles.signInPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            className={styles.signInButton}
            onClick={registerSubmit}
            disabled={!username || !password}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
)

export default RegistrationPopup
