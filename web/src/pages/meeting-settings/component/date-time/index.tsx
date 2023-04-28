import dayjs from "dayjs";
import { Input } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/zh-cn";
import { DateTimeProps } from "../../../../dtos/meeting-seetings";
import useAction from "./hook";
import style from "./index.module.scss";

const DateTime = (props: DateTimeProps) => {
  const { getDate, getTime } = props;
  const { handleChangeDate, time, setTime } = useAction({ getDate, getTime });
  return (
    <div className={style.dateTimeCentent}>
      <div className={style.date}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <DatePicker
            defaultValue={dayjs("3-15")}
            format="M月D日 ddd"
            sx={{ width: "100%" }}
            onChange={(newDate) => handleChangeDate(newDate)}
          />
        </LocalizationProvider>
      </div>
      <div className={style.time}>
        <Input
          type="time"
          sx={{
            width: "100%",
            height: "100%",
            border: "1px solid #d8d9d9",
            borderRadius: "0.3rem",
            padding: "0.6rem 1rem",
          }}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        ></Input>
      </div>
    </div>
  );
};

export default DateTime;
