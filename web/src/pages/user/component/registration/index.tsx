import styles from "./index.module.scss"
import { Button, TextField } from "@mui/material"
import useAction from "./hook"

const RegistrationPopup = () => {
  const { username, setUsername, password, setPassword, registerSubmit } =
    useAction()

  return (
    <div className={styles.pageWrap}>
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

export default RegistrationPopup
