import { ChangeEvent, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { IUserTableDto } from "../../../../dtos/role";
import { useNavigate } from "react-router-dom";

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

  // ---
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleRowSelection = (selection: any) => {
    setSelectedRows(selection.selectionModel);
  };

  const handleBulkDelete = () => {
    console.log(11);

    const selectedIds = selectedRows
      .map((index) => rows[index]?.id)
      .filter(Boolean);
    // 在这里执行实际的批量删除逻辑
    console.log("Selected IDs for bulk delete:", selectedIds);
    // 如果有实际的删除逻辑，你可以调用对应的删除函数，并传递选中的ids
    // deleteSelectedRows(selectedIds);
  };

  return {
    rows,
    inputVal,
    addUsersRef,
    selectedRows,
    navigate,
    handleInputChange,
    handleSearch,
    handleDelete,
    handleRowSelection,
    handleBulkDelete,
  };
};
