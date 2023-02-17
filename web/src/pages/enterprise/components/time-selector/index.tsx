import { TextField } from "@mui/material"
import Scheduler from "smart-cron"
import { MessageJobSendType } from "../../../../dtos/enterprise"
import moment from "moment"

const TimeSelector = (props: {
  sendTypeValue: MessageJobSendType
  cronExp: string
  setCronExp: React.Dispatch<React.SetStateAction<string>>
  setCronError: React.Dispatch<React.SetStateAction<string>>
  endDateValue: string
  setEndDateValue: React.Dispatch<React.SetStateAction<string>>
}) => {
  const {
    sendTypeValue,
    cronExp,
    setCronExp,
    setCronError,
    endDateValue,
    setEndDateValue
  } = props

  return (
    <div style={{ marginBottom: "1rem" }}>
      {sendTypeValue === MessageJobSendType.Recurring && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row"
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
            defaultValue={
              !!endDateValue
                ? moment(endDateValue).format("yyyy-MM-DDThh:mm")
                : ""
            }
            InputLabelProps={{
              shrink: true
            }}
            onChange={(e) => {
              setEndDateValue((e.target as HTMLInputElement).value)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default TimeSelector
