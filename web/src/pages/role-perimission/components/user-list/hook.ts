import { useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate, useParams } from "react-router-dom";

import { useBoolean, useDebounceFn } from "ahooks";
import { useSnackbar } from "notistack";

import {
  IRoleUserPageDto,
  IRoleUserItemDto,
  IRoleUserResponse,
} from "../../../../dtos/role-user-permissions";

import {
  DeleteRoleUser,
  GetRoleUser,
} from "../../../../api/role-user-permissions";

export const useAction = () => {
  const { enqueueSnackbar } = useSnackbar();

  // const { roleId } = useParams(); 有带roleId后替换掉下面
  const roleId = "5461b387-a9b2-11ed-8bef-0e1a84e7223a";

  const [inputVal, setInputVal] = useState<string>("");

  const [selectId, setSelectId] = useState<string[]>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const [pageDto, setPageDto] = useState<IRoleUserPageDto>({
    PageIndex: 0,
    PageSize: 20,
    RoleId: roleId,
    Keyword: inputVal,
  });

  const [userData, setUserData] = useState<IRoleUserResponse>({
    count: 0,
    roleUsers: [],
  });

  const [loading, setLoading] = useState(false);

  const [openConfirm, openConfirmAction] = useBoolean(false);

  const [batchBtnDisable, batchBtnDisableAction] = useBoolean(true);

  const navigate = useNavigate();

  const handleSearch = () => {
    inputVal && updatePageDto("Keyword", inputVal);
    initUserList();
  };

  const handleDelete = useDebounceFn(
    () => {
      openConfirmAction.setTrue();

      const data = {
        roleUserIds: selectId,
      };

      DeleteRoleUser(data)
        .then(() => {
          enqueueSnackbar("移除成功!", { variant: "success" });
          initUserList();
        })
        .catch((error) => {
          enqueueSnackbar((error as Error).message, { variant: "error" });
        })
        .finally(() => {
          setSelectId([]);
          openConfirmAction.setFalse();
        });
    },
    { wait: 500 }
  ).run;

  const initUserList = () => {
    setLoading(true);

    GetRoleUser({
      PageIndex: pageDto.PageIndex,
      PageSize: pageDto.PageSize,
      RoleId: pageDto.RoleId,
      Keyword: inputVal,
    })
      .then((res) => {
        setUserData(res);

        setTimeout(() => {
          updateUsersDto("count", res.count ?? 0);
          updateUsersDto("roleUsers", res.roleUsers ?? []);

          setLoading(false);
        }, 300);
      })
      .catch((error) => {
        setUserData({ count: 0, roleUsers: [] });

        enqueueSnackbar((error as Error).message, { variant: "error" });

        updateUsersDto("count", 0);
        updateUsersDto("roleUsers", []);
      });
  };

  const updatePageDto = (k: keyof IRoleUserPageDto, v: string | number) => {
    setPageDto((prev) => ({ ...prev, [k]: v }));
  };

  const updateUsersDto = (
    k: keyof IRoleUserResponse,
    v: IRoleUserItemDto[] | number
  ) => {
    setUserData((prev) => ({ ...prev, [k]: v }));
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
    roleId,
    navigate,
    setSelectId,
    handleSearch,
    handleDelete,
    setPageDto,
    setInputVal,
    initUserList,
    updatePageDto,
  };
};
