import { ChangeEvent, useRef, useState } from "react";
import { IUserTableDto } from "../../../../dtos/role";
import { ModalBoxRef } from "../../../../dtos/modal";

export const useAction = () => {
  const initData: IUserTableDto[] = [
    {
      id: 1,
      name: "xxx",
      date: "2014-12-24 23:12:00",
    },
  ];

  const [inputVal, setInputVal] = useState<string>("");

  const [rows, setRows] = useState<IUserTableDto[]>(initData);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search content:", inputVal);
  };

  const handleDelete = (id: number) => {
    const updatedRows = rows.filter((row: IUserTableDto) => row.id !== id);

    setRows(updatedRows);
  };

  return {
    rows,
    inputVal,
    addUsersRef,
    handleInputChange,
    handleSearch,
    handleDelete,
  };
};
