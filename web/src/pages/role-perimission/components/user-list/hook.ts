import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { PageDto, RoleUserResponse } from "../../../../dtos/role";
import { useNavigate } from "react-router-dom";
import { DeleteRoleUser, GetRoleUser } from "../../../../api/role-user";

export const useAction = () => {
  const [inputVal, setInputVal] = useState<string>("");

  const [selectId, setSelectId] = useState<string[]>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const [pageDto, setPageDto] = useState<PageDto>({
    PageIndex: 1,
    PageSize: 20,
  });

  const [userData, setUserData] = useState<RoleUserResponse>({
    count: 0,
    roleUsers: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search content:", inputVal);
  };

  const handleDelete = (id: string[]) => {
    DeleteRoleUser({ roleUserIds: id });
  };

  const initUserList = () => {
    // 少了传userId，搜索的参数，以及返回少了用户名
    GetRoleUser({ PageIndex: pageDto.PageIndex, PageSize: pageDto.PageSize })
      .then((res) => {
        setUserData(res);
      })
      .catch(() => setUserData({ count: 0, roleUsers: [] }));
  };

  useEffect(() => {
    initUserList();
  }, [pageDto.PageIndex]);

  return {
    inputVal,
    addUsersRef,
    pageDto,
    userData,
    selectId,
    navigate,
    setSelectId,
    handleInputChange,
    handleSearch,
    handleDelete,
    setPageDto,
  };
};
