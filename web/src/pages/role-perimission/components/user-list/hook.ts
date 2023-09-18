import { ChangeEvent, useState } from "react";

interface RowDto {
  id: number;
  name: string;
  date: string;
}

export const useAction = () => {
  const initData: RowDto[] = [
    {
      id: 1,
      name: "xxx",
      date: "2014-12-24 23:12:00",
    },
  ];

  const [inputVal, setInputVal] = useState<string>("");

  const [rows, setRows] = useState<any>(initData);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search content:", inputVal);
  };

  const handleDelete = (name: string) => {
    const updatedRows = rows.filter((row: RowDto) => row.name !== name);

    setRows(updatedRows);
  };

  return {
    rows,
    inputVal,
    handleInputChange,
    handleSearch,
    handleDelete,
  };
};
