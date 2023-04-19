import dayjs from "dayjs";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/zh-cn";
import { useState } from "react";

const DateTime = (props: {
  selectList: { value: string; lable: string }[];
  getDateTimeData: (data: { date: string; time: string }) => void;
}) => {
  const { selectList, getDateTimeData } = props;
  const [dtData, setDtData] = useState({
    date: "",
    time: "",
  });

  const handleChangeDateTime = async (event: any, type: string) => {
    let newData = dtData;
    type === "date" && (newData.date = dayjs(event).format("DD/MM/YYYY"));
    type === "time" && (newData.time = event.target.value);
    await setDtData(newData);
    await getDateTimeData(dtData);
  };

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
              onChange={(newDate) => handleChangeDateTime(newDate, "date")}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs={100} md={49}>
          <Select
            defaultValue={selectList && selectList[0].value}
            onChange={(e: SelectChangeEvent) => handleChangeDateTime(e, "time")}
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
