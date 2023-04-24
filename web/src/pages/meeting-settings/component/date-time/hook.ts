import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateTimeProps } from "../../../../dtos/meeting-seetings";

const useAction = (props: DateTimeProps) => {
  const { getDate, getTime } = props;
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const handleChangeDate = (value: dayjs.Dayjs | null) =>
    setDate(dayjs(value).format("DD/MM/YYYY"));

  useEffect(() => {
    getDate(date);
  }, [date]);
  useEffect(() => {
    getTime(time);
  }, [time]);
  return {
    time,
    handleChangeDate,
    setTime,
  };
};

export default useAction;
