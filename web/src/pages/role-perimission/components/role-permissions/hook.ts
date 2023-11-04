import { useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import {
  IPageDto,
  IRoleDto,
  IRoleItem,
} from "../../../../dtos/role-user-permissions";
import {
  DeleteRoles,
  GetRolesList,
} from "../../../../api/role-user-permissions";
import { useSnackbar } from "notistack";

export const useAction = () => {
  const { enqueueSnackbar } = useSnackbar();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [roleId, setRoleId] = useState<string>("");

  const [inputVal, setInputVal] = useState<string>("");

  const [pageDto, setPageDto] = useState<IPageDto>({
    pageIndex: 0,
    pageSize: 20,
    keyword: "",
  });

  const [roleDto, setRoleDto] = useState<IRoleDto>({
    count: 0,
    roles: [],
  });

  const loadRoles = () => {
    setLoading(true);

    GetRolesList(pageDto)
      .then((res) => {
        setTimeout(() => {
          updateRoleDto("count", res.count ?? 0);
          updateRoleDto("roles", res.roles ?? []);

          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        setTimeout(() => {
          enqueueSnackbar((error as Error).message, { variant: "error" });

          updateRoleDto("count", 0);
          updateRoleDto("roles", []);

          setLoading(false);
        }, 500);
      });
  };

  const deleteRole = (roleId: string) => {
    DeleteRoles({ roleIds: [roleId] })
      .then(() => {
        loadRoles();
        setRoleId("");
      })
      .catch((error) =>
        enqueueSnackbar((error as Error).message, { variant: "error" })
      );
  };

  const updatePageDto = (k: keyof IPageDto, v: string | number) => {
    setPageDto((prev) => ({ ...prev, [k]: v }));
  };

  const updateRoleDto = (k: keyof IRoleDto, v: IRoleItem[] | number) => {
    setRoleDto((prev) => ({ ...prev, [k]: v }));
  };

  useEffect(() => {
    loadRoles();
  }, [pageDto.pageIndex, pageDto.pageSize, pageDto.keyword]);

  return {
    confirmTipsRef,
    navigate,
    pageDto,
    updatePageDto,
    roleDto,
    loading,
    roleId,
    setRoleId,
    deleteRole,
    inputVal,
    setInputVal,
  };
};
