import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { PageDto, RoleUserResponse } from "../../../../dtos/role";
import { useNavigate } from "react-router-dom";
import { DeleteRoleUser, GetRoleUser } from "../../../../api/role-user";
import { useBoolean } from "ahooks";

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

  const [loading, setLoading] = useState(false);

  const [openError, openErrorAction] = useBoolean(false);

  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const [promptText, setPromptText] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    initUserList(inputVal);
  };

  const handleDelete = (id: string[]) => {
    DeleteRoleUser({ roleUserIds: id })
      .then(() => {
        setAlertType("success");
        setPromptText("移除成功");
        openErrorAction.setTrue();
        initUserList();
      })
      .catch(() => {
        setAlertType("error");
        setPromptText("移除失败");
        openErrorAction.setTrue();
      });
  };

  const initUserList = (search: string = "") => {
    setLoading(true);
    // 少了传userId，搜索的参数，以及返回少了用户名
    GetRoleUser({ PageIndex: pageDto.PageIndex, PageSize: pageDto.PageSize })
      .then((res) => {
        setUserData(res);
      })
      .catch(() => setUserData({ count: 0, roleUsers: [] }))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
  };

  useEffect(() => {
    initUserList();
  }, [pageDto.PageIndex]);

  // 延迟关闭警告提示
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        openErrorAction.setFalse();
      }, 3000);
    }
  }, [openError]);

  return {
    inputVal,
    addUsersRef,
    pageDto,
    userData,
    selectId,
    loading,
    openError,
    alertType,
    promptText,
    navigate,
    setSelectId,
    handleInputChange,
    handleSearch,
    handleDelete,
    setPageDto,
  };
};
