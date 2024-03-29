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
import { convertRoleErrorText } from "../../../../uilts/convert-error";

export const useAction = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { roleId } = useParams();

  const [inputVal, setInputVal] = useState<string>("");

  const [selectId, setSelectId] = useState<string[]>([]);

  const addUsersRef = useRef<ModalBoxRef>(null);

  const [pageDto, setPageDto] = useState<IRoleUserPageDto>({
    PageIndex: 0,
    PageSize: 100,
    RoleId: roleId ?? "",
    Keyword: inputVal,
  });

  const [userData, setUserData] = useState<IRoleUserResponse>({
    count: 0,
    roleUsers: [],
  });

  const [loading, setLoading] = useState(false);

  const [isDeLoading, setIsDeLoading] = useState(false);

  const [openConfirm, openConfirmAction] = useBoolean(false);

  const [batchBtnDisable, batchBtnDisableAction] = useBoolean(true);

  const navigate = useNavigate();

  const handleDelete = useDebounceFn(
    () => {
      openConfirmAction.setTrue();

      const data = {
        roleUserIds: selectId,
      };
      setIsDeLoading(true);
      DeleteRoleUser(data)
        .then(() => {
          enqueueSnackbar("移除成功!页面将在三秒后刷新", {
            variant: "success",
          });
          initUserList();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          enqueueSnackbar((error as Error).message, { variant: "error" });
        })
        .finally(() => {
          setSelectId([]);
          openConfirmAction.setFalse();
          setIsDeLoading(false);
        });
    },
    { wait: 500 }
  ).run;

  const initUserList = () => {
    setLoading(true);

    GetRoleUser({
      PageIndex: (pageDto.PageIndex ?? 0) + 1,
      PageSize: pageDto.PageSize,
      RoleId: pageDto.RoleId,
      Keyword: inputVal,
    })
      .then((res) => {
        setTimeout(() => {
          updateUsersDto("count", res?.count ?? 0);
          updateUsersDto("roleUsers", res?.roleUsers ?? []);

          setLoading(false);
        }, 300);
      })
      .catch((error: Error) => {
        enqueueSnackbar(convertRoleErrorText(error), { variant: "error" });

        updateUsersDto("count", 0);
        updateUsersDto("roleUsers", []);

        setLoading(false);
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
    isDeLoading,
    navigate,
    setSelectId,
    handleDelete,
    setPageDto,
    setInputVal,
    initUserList,
    updatePageDto,
  };
};
