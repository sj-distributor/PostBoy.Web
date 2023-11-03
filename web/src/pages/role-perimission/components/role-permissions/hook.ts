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

  const [dto, setDto] = useState<{
    pageIndex: number;
    pageSize: number;
    count: number;
  }>({
    pageIndex: 1,
    pageSize: 20,
    count: 0,
  });

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
        getRolesList();
      })
      .catch((err) => {
        setTipsText((err as Error).message);
      });
  };

  const getRolesList = () => {
    GetRolesList({ PageIndex: dto.pageIndex, PageSize: dto.pageSize })
      .then((res) => {
        if (res) {
          const { count, roles } = res;

          setDto((prev) => ({ ...prev, count }));
          setRows(roles);
        }
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

  useEffect(() => {
    getRolesList();
  }, []);

  return {
    userId,
    rows,
    inputVal,
    rowId,
    confirmTipsRef,
    tipsText,
    navigate,
    setRowId,
    handleInputChange,
    handleSearch,
    handleDelete,
  };
};
