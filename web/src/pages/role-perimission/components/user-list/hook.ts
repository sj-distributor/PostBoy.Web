import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import {
  PageDto,
  RoleUserResponse,
  RoleUserItemDto,
} from "../../../../dtos/role";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteRoleUser, GetRoleUser } from "../../../../api/role-user";
import { useBoolean } from "ahooks";

export const useAction = () => {
  const res = [
    {
      id: "111",
      createdDate: "2023-02-11T02:18:22+00:00",
      modifiedDate: "2023-02-11T02:18:23+00:00",
      roleId: "5461b387-a9b2-11ed-8bef-0e1a84e7223a",
      userId: "ae967b87-ca21-40c2-a63a-1c97cbf58974",
      roleName: "Administrator",
      userName: "admin1",
    },
    {
      id: "222",
      createdDate: "2023-02-11T02:18:22+00:00",
      modifiedDate: "2023-02-11T02:18:23+00:00",
      roleId: "5461b387-a9b2-11ed-8bef-0e1a84e7223a",
      userId: "ae967b87-ca21-40c2-a63a-1c97cbf58974",
      roleName: "Administrator",
      userName: "admin2",
    },
    {
      id: "333",
      createdDate: "2023-02-11T02:18:22+00:00",
      modifiedDate: "2023-02-11T02:18:23+00:00",
      roleId: "5461b387-a9b2-11ed-8bef-0e1a84e7223a",
      userId: "ae967b87-ca21-40c2-a63a-1c97cbf58974",
      roleName: "Administrator",
      userName: "admin3",
    },
    {
      id: "444",
      createdDate: "2023-02-11T02:18:22+00:00",
      modifiedDate: "2023-02-11T02:18:23+00:00",
      roleId: "5461b387-a9b2-11ed-8bef-0e1a84e7223a",
      userId: "ae967b87-ca21-40c2-a63a-1c97cbf58974",
      roleName: "Administrator",
      userName: "admin4",
    },
  ];

  // const { roleId } = useParams();
  const roleId = "";

  const [inputVal, setInputVal] = useState<string>("");

  const [selectId, setSelectId] = useState<string[]>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const [pageDto, setPageDto] = useState<PageDto>({
    PageIndex: 1,
    PageSize: 20,
    RoleId: roleId,
  });

  const [userData, setUserData] = useState<RoleUserResponse>({
    count: 4,
    roleUsers: res,
  });

  const [loading, setLoading] = useState(false);

  const [openError, openErrorAction] = useBoolean(false);

  const [openConfirm, openConfirmAction] = useBoolean(false);

  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const [promptText, setPromptText] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  };

  const handleSearch = () => {
    initUserList(inputVal);
  };

  const handleDelete = () => {
    openConfirmAction.setTrue();
    console.log(selectId);

    DeleteRoleUser({ roleUserIds: selectId })
      .then(() => {
        setAlertType("success");
        setPromptText("移除成功");
        initUserList();
      })
      .catch(() => {
        setAlertType("error");
        setPromptText("移除失败");
      })
      .catch(() => {
        setSelectId([]);
        openErrorAction.setTrue();
        openConfirmAction.setFalse();
      });
  };

  const initUserList = (search: string = "") => {
    setLoading(true);

    // 少了传userId，搜索的参数，以及返回少了用户名
    GetRoleUser({
      PageIndex: pageDto.PageIndex,
      PageSize: pageDto.PageSize,
      RoleId: pageDto.RoleId,
    })
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

  // useEffect(() => {
  //   initUserList();
  // }, [pageDto.PageIndex]);

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
    openConfirm,
    openConfirmAction,
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
