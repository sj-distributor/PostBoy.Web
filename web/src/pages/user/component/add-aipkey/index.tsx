import styles from "./index.module.scss"
import { Button, TextField } from "@mui/material"
import useAction from "./hook"

const AddApiKeyPopup = (props: { userAccountId: string }) => {
  const { userAccountId } = props
  const { aipKey, setAipKey, description, setDescription, registerSubmit } =
    useAction({ userAccountId })

  return (
    <div className={styles.pageWrap}>
      <div className={styles.loginBox}>
        <div className={styles.signInTitleBox}>
          <div className={styles.title}>Register</div>
        </div>
        <TextField
          fullWidth
          label="apiKey"
          className={styles.signInUsername}
          value={aipKey}
          onChange={(e) => setAipKey(e.target.value)}
        />
        <TextField
          fullWidth
          label="description"
          className={styles.signInPassword}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          className={styles.signInButton}
          onClick={registerSubmit}
          disabled={!aipKey || !description}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AddApiKeyPopup
