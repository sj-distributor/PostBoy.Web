import { TextField } from "@mui/material"
import Scheduler from "smart-cron"
import { MessageJobSendType } from "../../../../dtos/enterprise"
import moment from "moment"

const TimeSelector = (props: {
  cronExp: string
  setCronExp: React.Dispatch<React.SetStateAction<string>>
  setCronError: React.Dispatch<React.SetStateAction<string>>
  endDateValue: string
  setEndDateValue: React.Dispatch<React.SetStateAction<string>>
  showErrorPrompt: (text: string) => void
}) => {
  const {
    cronExp,
    setCronExp,
    setCronError,
    endDateValue,
    setEndDateValue,
    showErrorPrompt,
  } = props

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Scheduler
            cron={cronExp}
            setCron={setCronExp}
            setCronError={setCronError}
            isAdmin={true}
            locale={"zh_CN"}
          />
        </div>
        <TextField
          label="终止时间"
          type="datetime-local"
          sx={{ width: 252, marginTop: 2, marginBottom: "0.7rem" }}
          value={
            !!endDateValue
              ? moment(endDateValue).format("yyyy-MM-DDTHH:mm")
              : ""
          }
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            if (new Date((e.target as HTMLInputElement).value) >= new Date()) {
              setEndDateValue((e.target as HTMLInputElement).value)
            } else {
              e.preventDefault()
              showErrorPrompt("The end time cannot exceed the current time!")
            }
          }}
        />
      </div>
    </div>
  )
}

export default TimeSelector
