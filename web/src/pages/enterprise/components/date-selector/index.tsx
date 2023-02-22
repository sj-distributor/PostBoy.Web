import { TextField } from "@mui/material"
import moment from "moment"
import { MessageJobSendType } from "../../../../dtos/enterprise"

const DateSelector = (props: {
  dateValue: string
  setDateValue: React.Dispatch<React.SetStateAction<string>>
  showErrorPrompt: (text: string) => void
}) => {
  const { dateValue, setDateValue, showErrorPrompt } = props
  return (
    <div style={{ marginBottom: "1rem" }}>
      <TextField
        label="发送时间"
        type="datetime-local"
        sx={{ width: 250, margin: "0.8rem 0" }}
        defaultValue={
          !!dateValue ? moment(dateValue).format("yyyy-MM-DDThh:mm") : ""
        }
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) => {
          const time = moment((e.target as HTMLInputElement).value).valueOf()
          const nowTime = moment(new Date()).valueOf()
          if (time <= nowTime) {
            showErrorPrompt("Please select a time later than the current time")
          } else {
            setDateValue((e.target as HTMLInputElement).value)
          }
        }}
      />
    </div>
  )
}
export default DateSelector
