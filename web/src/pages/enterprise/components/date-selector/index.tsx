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
        value={dateValue}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          if (
            moment((e.target as HTMLInputElement).value).format(
              "DD.MM.YYYY HH:mm"
            ) >= moment().format("DD.MM.YYYY HH:mm")
          ) {
            setDateValue((e.target as HTMLInputElement).value.replace("T", " "))
          } else {
            showErrorPrompt("Please select a time later than the current time")
          }
        }}
      />
    </div>
  )
}
export default DateSelector
