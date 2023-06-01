import { Button, FormControlLabel, Switch, TextField } from "@mui/material"
import {
  IManagerAppKeyData,
  IManagerCorpKeyData,
  AddOrModify,
  RowDataType,
} from "../../../../dtos/app-manager"
import useAction from "./hook"
import styles from "./index.module.scss"

const CorpAppDialog = (props: {
  rowData: IManagerCorpKeyData | IManagerAppKeyData
  rowDataType: AddOrModify
  tipsText: string
  onAddApikeyCancel: () => void
  reload: (corpUpdateId?: string) => void
  setTipsText: React.Dispatch<React.SetStateAction<string>>
}) => {
  const {
    rowData,
    rowDataType,
    tipsText,
    onAddApikeyCancel,
    reload,
    setTipsText,
  } = props
  const {
    name,
    secret,
    corpId,
    appId,
    agentId,
    setAgentId,
    setAppId,
    setCorpId,
    setName,
    setSecret,
    handleSubmit,
    validate,
    order,
    setOrder,
    display,
    setDisplay,
  } = useAction({
    rowData,
    rowDataType,
    tipsText,
    onAddApikeyCancel,
    reload,
    setTipsText,
  })

  const isCorp = rowData.key === RowDataType.Corporation

  const subjectText = `${isCorp ? "Corporation" : "Application"}`

  return (
    <div className={styles.pageWrap}>
      <div className={styles.addBox}>
        <div className={styles.addTitleBox}>
          <div className={styles.title}>{`${rowDataType} ${subjectText}`}</div>
        </div>
        <TextField
          fullWidth
          label={`${subjectText} Name`}
          className={styles.TextField}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {isCorp ? (
          <TextField
            fullWidth
            label="Corporation Id"
            className={styles.TextField}
            value={corpId}
            onChange={(e) => setCorpId(e.target.value)}
          />
        ) : (
          <>
            <TextField
              fullWidth
              label="App Id"
              className={styles.TextField}
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
            <TextField
              fullWidth
              type="number"
              label="Agent Id"
              className={styles.TextField}
              value={agentId}
              onChange={(e) => setAgentId(Number(e.target.value))}
            />
          </>
        )}

        <TextField
          fullWidth
          label="Secret"
          className={styles.description}
          value={secret}
          multiline
          rows={5}
          onChange={(e) => setSecret(e.target.value)}
        />

        {isCorp ? (
          <TextField
            fullWidth
            type="number"
            label="Order"
            className={styles.TextField}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        ) : (
          <div style={{ display: "flex" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={display}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    rowDataType !== AddOrModify.Add &&
                    setDisplay(event.target.checked as boolean)
                  }
                />
              }
              label="Display"
            />
          </div>
        )}

        <Button
          fullWidth
          variant="contained"
          className={styles.signInButton}
          onClick={() => {
            try {
              handleSubmit()
            } catch (error) {
              setTipsText(String(error))
            }
          }}
          disabled={!validate()}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default CorpAppDialog
