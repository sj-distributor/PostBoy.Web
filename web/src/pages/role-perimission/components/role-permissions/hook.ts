import { ChangeEvent, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import {
  IRoleTabltDto,
  UserRoleEnum,
  UserRoleType,
} from "../../../../dtos/role-user-permissions";

export const useAction = () => {
  const initData: IRoleTabltDto[] = [
    {
      id: 1,
      name: UserRoleType[UserRoleEnum.SuperAdmin],
      details: "系統默認角色，擁有全部權限，不能刪除",
      role: UserRoleEnum.SuperAdmin,
    },
    {
      id: 2,
      name: UserRoleType[UserRoleEnum.User],
      details: "系統默認角色，擁有基礎權限，不能刪除，人員範圍: all",
      role: UserRoleEnum.User,
    },
    {
      id: 3,
      name: UserRoleType[UserRoleEnum.Admin],
      details: "xxxxxxxxxxx",
      role: UserRoleEnum.Admin,
    },
  ];

  const userId = "225";

  const [inputVal, setInputVal] = useState<string>("");

  const [rows, setRows] = useState<IRoleTabltDto[]>(initData);

  const [rowId, setRowId] = useState<number>();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search content:", inputVal);
  };

  const handleDelete = (id: number) => {
    const updatedRows = rows.filter((row: IRoleTabltDto) => row.id !== id);

    setRows(updatedRows);
  };

  return {
    userId,
    rows,
    inputVal,
    rowId,
    confirmTipsRef,
    navigate,
    setRowId,
    handleInputChange,
    handleSearch,
    handleDelete,
  };
};
