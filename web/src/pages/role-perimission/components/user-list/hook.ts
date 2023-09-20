import { ChangeEvent, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { IUserTableDto } from "../../../../dtos/role";
import { useNavigate } from "react-router-dom";
import { GridSelectionModel } from "@mui/x-data-grid";

export const useAction = () => {
  const initData: IUserTableDto[] = [
    {
      id: 1,
      name: "xxx",
      date: "2014-12-24 23:12:00",
    },
    {
      id: 2,
      name: "xxx",
      date: "2015-12-24 23:12:00",
    },
    {
      id: 3,
      name: "xxx",
      date: "2016-12-24 23:12:00",
    },
    {
      id: 4,
      name: "xxx",
      date: "2017-12-24 23:12:00",
    },
    {
      id: 5,
      name: "xxx",
      date: "2018-12-24 23:12:00",
    },
  ];

  const [inputVal, setInputVal] = useState<string>("");

  const [rows, setRows] = useState<IUserTableDto[]>(initData);

  const [selectId, setSelectId] = useState<GridSelectionModel>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

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

  const batchDelete = () => {
    const updatedRows = rows.filter(
      (row: IUserTableDto) => !selectId.includes(row.id)
    );

    setRows(updatedRows);
  };

  return {
    rows,
    inputVal,
    addUsersRef,
    navigate,
    setSelectId,
    handleInputChange,
    handleSearch,
    handleDelete,
    batchDelete,
  };
};
