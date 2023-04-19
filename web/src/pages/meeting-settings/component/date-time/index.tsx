import dayjs from "dayjs";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/zh-cn";
import { useEffect, useState } from "react";
import { DateTimeProps } from "../../../../dtos/meeting-seetings";

const DateTime = (props: DateTimeProps) => {
  const { selectList, getDateTimeData } = props;
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const handleChangeDate = (vlaue: dayjs.Dayjs | null) => {
    setDate((vl) => dayjs(vlaue).format("DD/MM/YYYY"));
  };

  const handleChangeTime = (event: SelectChangeEvent) => {
    setTime((vl) => event.target.value);
  };

  useEffect(() => {
    getDateTimeData({
      date,
      time,
    });
  }, [date, time]);
  return (
    <>
      <Grid container columns={100} justifyContent="space-between">
        <Grid xs={100} md={49} sx={{ marginBottom: "10px" }}>
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
        <Grid xs={100} md={49}>
          <Select
            defaultValue={selectList && selectList[0].value}
            onChange={(e: SelectChangeEvent) => handleChangeTime(e)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{ width: "100%" }}
          >
            {selectList &&
              selectList.map((item, index) => {
                return (
                  <MenuItem value={item.value} key={index}>
                    {item.value}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
      </Grid>
    </>
  );
};

export default DateTime;
