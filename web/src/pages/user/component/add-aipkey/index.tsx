import styles from "./index.module.scss"
import { Button, TextField } from "@mui/material"
import useAction from "./hook"

const AddApiKeyPopup = (props: {
  userAccountId: string
  onAddApikeyCancel: () => void
  GetAllUsers: () => void
}) => {
  const { userAccountId, onAddApikeyCancel, GetAllUsers } = props
  const { apiKey, setAipKey, description, setDescription, registerSubmit } =
    useAction({ userAccountId, onAddApikeyCancel, GetAllUsers })

  return (
    <div className={styles.pageWrap}>
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
          onClick={registerSubmit}
          disabled={!apiKey}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AddApiKeyPopup
