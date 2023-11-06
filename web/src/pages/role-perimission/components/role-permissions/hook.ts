import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IRoleTabltDto } from "../../../../dtos/role";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  IGetPermissionsDto,
  IRoleDto,
  IRolePermissionDataItem,
} from "../../../../dtos/role-user-permissions";
import {
  DeleteRoles,
  GetRolesList,
} from "../../../../api/role-user-permissions";

export const useAction = () => {
  const [rowId, setRowId] = useState<number>();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const [pageDto, setPageDto] = useState<IGetPermissionsDto>({
    PageIndex: 0,
    PageSize: 20,
    Keyword: "",
  });

  const [roleDto, setRoleDto] = useState<IRoleDto>({
    count: 0,
    rolePermissionData: [],
  });

  const loadRoles = () => {
    setLoading(true);

    GetRolesList(pageDto)
      .then((res) => {
        setTimeout(() => {
          updateRoleDto("count", res.count ?? 0);
          updateRoleDto("rolePermissionData", res.rolePermissionData ?? []);
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        setTimeout(() => {
          enqueueSnackbar((error as Error).message, { variant: "error" });

          updateRoleDto("count", 0);
          updateRoleDto("rolePermissionData", []);

          setLoading(false);
        }, 500);
      });
  };

  const deleteRole = (roleId: string) => {
    DeleteRoles({ roleIds: [roleId] })
      .then(() => {
        loadRoles();
      })
      .catch((error) =>
        enqueueSnackbar((error as Error).message, { variant: "error" })
      );
  };

  const updatePageDto = (k: keyof IGetPermissionsDto, v: string | number) => {
    setPageDto((prev) => ({ ...prev, [k]: v }));
  };

  const updateRoleDto = (
    k: keyof IRoleDto,
    v: IRolePermissionDataItem[] | number
  ) => {
    setRoleDto((prev) => ({ ...prev, [k]: v }));
  };

  useEffect(() => {
    loadRoles();
  }, [pageDto.PageIndex, pageDto.PageIndex]);

  return {
    rowId,
    confirmTipsRef,
    pageDto,
    loading,
    roleDto,
    deleteRole,
    updatePageDto,
    navigate,
    setRowId,
    loadRoles,
  };
};
