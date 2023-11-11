import { useEffect, useMemo, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  IPageDto,
  IRolePermissionDto,
  IRolePermissionDataItem,
  FunctionalPermissionsEnum,
  UserRoleEnum,
} from "../../../../dtos/role-user-permissions";
import {
  DeleteRoles,
  GetRolesByPermissions,
} from "../../../../api/role-user-permissions";
import auth from "../../../../auth";
import { useDebounceFn } from "ahooks";
import { convertRoleErrorText } from "../../../../uilts/convert-error";

export const useAction = () => {
  const { currentUserRolePermissions } = auth();

  const [rowId, setRowId] = useState<string>();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const [pageDto, setPageDto] = useState<IPageDto>({
    pageIndex: 0,
    pageSize: 20,
    keyword: "",
  });

  const [roleDto, setRoleDto] = useState<IRolePermissionDto>({
    count: 0,
    rolePermissionData: [],
  });

  const userPermissions = useMemo(() => {
    const data = new Set<string>();

    if (
      currentUserRolePermissions &&
      currentUserRolePermissions.rolePermissionData?.length
    ) {
      currentUserRolePermissions.rolePermissionData
        .flatMap((item) => item.permissions || [])
        .forEach((item) => item?.name && data.add(item.name));
    }

    return Array.from(data);
  }, [currentUserRolePermissions]);

  const handleAddRole = () => {
    if (
      userPermissions.some(
        (item) => item === FunctionalPermissionsEnum.CanCreateRoleUser
      )
    ) {
      navigate("/role/create");
    } else {
      enqueueSnackbar("没有权限新增角色", {
        variant: "info",
      });
    }
  };

  const handleRoleAssignment = (name: string, id: string) => {
    const userRoles = currentUserRolePermissions.rolePermissionData.map(
      (item) => item.role.name
    );

    if (
      userPermissions.some(
        (item) => item === FunctionalPermissionsEnum.CanGrantPermissionsIntoRole
      )
    ) {
      if (
        name === UserRoleEnum.Administrator &&
        !userRoles.includes(UserRoleEnum.Administrator)
      ) {
        enqueueSnackbar("需要超级管理员权限才能分配！", {
          variant: "info",
        });
        return;
      }
      navigate(`/role/users/${id}`);
    } else {
      enqueueSnackbar("没有权限分配", {
        variant: "info",
      });
    }
  };

  const { run: handleRoleAssignmentDebounce } = useDebounceFn(
    (name: string, id: string) => handleRoleAssignment(name, id),
    {
      wait: 300,
    }
  );

  const handleEditRole = (name: string, id: string) => {
    if (
      userPermissions.some(
        (item) => item === FunctionalPermissionsEnum.CanUpdatePermissionsOfRole
      )
    ) {
      navigate(`/role/edit/${id}`);
    } else {
      enqueueSnackbar("没有编辑角色权限", {
        variant: "info",
      });
    }
  };

  const { run: handleEditRoleDebounce } = useDebounceFn(
    (name: string, id: string) => handleEditRole(name, id),
    {
      wait: 300,
    }
  );

  const handleRemoveRole = (name: string, id: string) => {
    if (
      userPermissions.some(
        (item) => item === FunctionalPermissionsEnum.CanDeleteRoles
      )
    ) {
      confirmTipsRef.current?.open();
      setRowId(id);
    } else {
      enqueueSnackbar("没有删除角色权限", {
        variant: "info",
      });
    }
  };

  const { run: handleRemoveRoleDebounce } = useDebounceFn(
    (name: string, id: string) => handleRemoveRole(name, id),
    {
      wait: 300,
    }
  );

  const loadRoles = () => {
    setLoading(true);

    GetRolesByPermissions(pageDto)
      .then((res) => {
        setTimeout(() => {
          updateRoleDto("count", res?.count ?? 0);
          updateRoleDto("rolePermissionData", res?.rolePermissionData ?? []);
          setLoading(false);
        }, 500);
      })
      .catch((error: Error) => {
        setTimeout(() => {
          enqueueSnackbar(convertRoleErrorText(error), { variant: "error" });

          updateRoleDto("count", 0);
          updateRoleDto("rolePermissionData", []);

          setLoading(false);
        }, 500);
      });
  };

  const deleteRole = (roleId: string) => {
    DeleteRoles({ roleIds: [roleId] })
      .then(() => {
        enqueueSnackbar("删除成功！页面将在三秒后刷新", { variant: "error" });
        loadRoles();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error: Error) =>
        enqueueSnackbar(convertRoleErrorText(error), { variant: "error" })
      );
  };

  const updatePageDto = (k: keyof IPageDto, v: string | number) => {
    setPageDto((prev) => ({ ...prev, [k]: v }));
  };

  const updateRoleDto = (
    k: keyof IRolePermissionDto,
    v: IRolePermissionDataItem[] | number
  ) => {
    setRoleDto((prev) => ({ ...prev, [k]: v }));
  };

  useEffect(() => {
    loadRoles();
  }, [pageDto.pageIndex, pageDto.pageSize]);

  return {
    rowId,
    confirmTipsRef,
    pageDto,
    loading,
    roleDto,
    handleRoleAssignmentDebounce,
    handleEditRoleDebounce,
    handleRemoveRoleDebounce,
    handleAddRole,
    deleteRole,
    updatePageDto,
    navigate,
    setRowId,
    loadRoles,
  };
};
