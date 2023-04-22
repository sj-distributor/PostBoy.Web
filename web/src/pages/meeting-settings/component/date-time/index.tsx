import dayjs from "dayjs";
import { Input } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/zh-cn";
import { useEffect, useState } from "react";
import { DateTimeProps } from "../../../../dtos/meeting-seetings";

const DateTime = (props: DateTimeProps) => {
  const { getDateTimeData } = props;
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const handleChangeDate = (value: dayjs.Dayjs | null) =>
    setDate(dayjs(value).format("DD/MM/YYYY"));

  useEffect(() => {
    getDateTimeData({
      date,
      time,
    });
  }, [date, time]);
  return (
    <>
      <Grid container columns={100} justifyContent="space-between">
        <Grid xs={100} md={49} sx={{ paddingBottom: "1rem" }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            <DatePicker
              defaultValue={dayjs("3-15")}
              format="M月D日 ddd"
              sx={{ width: "100%" }}
              onChange={(newDate) => handleChangeDate(newDate)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs={100} md={49} sx={{ paddingBottom: "1rem" }}>
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
        </Grid>
      </Grid>
    </>
  );
};

export default DateTime;
