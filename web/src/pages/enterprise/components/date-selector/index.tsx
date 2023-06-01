import { TextField } from "@mui/material"
import moment from "moment"

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
            moment(
              (e.target as HTMLInputElement).value,
              "YYYY-MM-DDTHH:mm"
            ).isSameOrAfter(moment(), "minute")
          ) {
            setDateValue(
              moment(e.target.value, "YYYY-MM-DDTHH:mm").format(
                "YYYY-MM-DD HH:mm"
              )
            )
          } else {
            showErrorPrompt("Please select a time later than the current time")
          }
        }}
      />
    </div>
  )
}
export default DateSelector
