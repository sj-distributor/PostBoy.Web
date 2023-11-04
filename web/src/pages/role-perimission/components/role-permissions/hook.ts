import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  IRoleData,
  IRoleTabltDto,
  UserRoleEnum,
  UserRoleType,
} from "../../../../dtos/role";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import { GetRolesList, PostDeleteRole } from "../../../../api/roles";

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

  const [rows, setRows] = useState<IRoleData[]>([]);

  const [rowId, setRowId] = useState<string>();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const [tipsText, setTipsText] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search content:", inputVal);
  };

  const handleDelete = (roles: string[]) => {
    PostDeleteRole({ roleIds: roles })
      .then((res) => {
        setTipsText("删除成功");
      })
      .catch((err) => {
        setTipsText((err as Error).message);
      });
  };

  useEffect(() => {
    if (tipsText) {
      const timeout = setTimeout(() => {
        setTipsText("");
      }, 4000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [tipsText]);

  return {
    userId,
    rows,
    inputVal,
    rowId,
    confirmTipsRef,
    tipsText,
    isLoading,
    navigate,
    setRowId,
    handleInputChange,
    handleSearch,
    handleDelete,
  };
};
