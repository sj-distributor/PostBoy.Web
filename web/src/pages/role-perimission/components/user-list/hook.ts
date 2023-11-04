import { useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { PageDto, RoleUserResponse } from "../../../../dtos/role";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteRoleUser, GetRoleUser } from "../../../../api/role-user";
import { useBoolean } from "ahooks";
import { useSnackbar } from "notistack";

export const useAction = () => {
  const { enqueueSnackbar } = useSnackbar();

  // const { roleId } = useParams(); 有带roleId后替换掉下面
  const roleId = "5461b387-a9b2-11ed-8bef-0e1a84e7223a";

  const [inputVal, setInputVal] = useState<string>("");

  const [selectId, setSelectId] = useState<string[]>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const [pageDto, setPageDto] = useState<PageDto>({
    PageIndex: 1,
    PageSize: 20,
    RoleId: roleId,
  });

  const [userData, setUserData] = useState<RoleUserResponse>({
    count: 0,
    roleUsers: [],
  });

  const [loading, setLoading] = useState(false);

  const [openConfirm, openConfirmAction] = useBoolean(false);

  const [batchBtnDisable, batchBtnDisableAction] = useBoolean(true);

  const navigate = useNavigate();

  const handleSearch = () => {
    initUserList();
  };

  const handleDelete = () => {
    openConfirmAction.setTrue();

    DeleteRoleUser({ roleUserIds: selectId })
      .then(() => {
        enqueueSnackbar("移除成功!", { variant: "success" });
        initUserList();
      })
      .catch(() => {
        enqueueSnackbar("移除失败!", { variant: "error" });
      })
      .finally(() => {
        setSelectId([]);
        openConfirmAction.setFalse();
      });
  };

  const initUserList = () => {
    setLoading(true);

    // 接口差一个搜索的参数
    GetRoleUser({
      PageIndex: pageDto.PageIndex,
      PageSize: pageDto.PageSize,
      RoleId: pageDto.RoleId,
      UserName: inputVal,
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

  useEffect(() => {
    initUserList();
  }, [pageDto.PageIndex]);

  useEffect(() => {
    selectId.length === 0
      ? batchBtnDisableAction.setTrue()
      : batchBtnDisableAction.setFalse();
  }, [selectId]);

  return {
    inputVal,
    addUsersRef,
    pageDto,
    userData,
    selectId,
    loading,
    openConfirm,
    openConfirmAction,
    batchBtnDisable,
    navigate,
    setSelectId,
    handleSearch,
    handleDelete,
    setPageDto,
    setInputVal,
    initUserList,
  };
};
