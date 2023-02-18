import styles from "./index.module.scss"
import { Button, TextField } from "@mui/material"
import useAction from "./hook"
import { IUserApikeysResponse } from "../../../../dtos/user-management"

const AddApiKeyPopup = (props: {
  userAccountId: string
  onAddApikeyCancel: () => void
  userApikeyList: IUserApikeysResponse[][]
  setUserApikey: React.Dispatch<React.SetStateAction<IUserApikeysResponse[][]>>
}) => {
  const { userAccountId, onAddApikeyCancel, userApikeyList, setUserApikey } =
    props
  const { apiKey, setAipKey, description, setDescription, addApiKeySubmit } =
    useAction({
      userAccountId,
      onAddApikeyCancel,
      userApikeyList,
      setUserApikey,
    })

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
          onClick={addApiKeySubmit}
          disabled={!apiKey}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AddApiKeyPopup
