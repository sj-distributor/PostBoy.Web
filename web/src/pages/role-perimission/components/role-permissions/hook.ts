import { useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  IPageDto,
  IRolePermissionDto,
  IRolePermissionDataItem,
} from "../../../../dtos/role-user-permissions";
import {
  DeleteRoles,
  GetRolesList,
} from "../../../../api/role-user-permissions";
import auth from "../../../../auth";
import { useDebounceFn } from "ahooks";

export const useAction = () => {
  // const { currentUserRolePermissions } = auth();

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

  // const handleRoleAssignment = (name: string) => {
  //   if (
  //     currentUserRolePermissions.rolePermissionData
  //       .map((item) => item.role)
  //       .some((item) => item.name === name)
  //   ) {
  //     navigate("/roles/userList");
  //   } else {
  //     enqueueSnackbar("没有权限分配", {
  //       variant: "info",
  //     });
  //   }
  // };

  // const { run: handleRoleAssignmentDebounce } = useDebounceFn(
  //   handleRoleAssignment,
  //   {
  //     wait: 800,
  //   }
  // );

  // const handleEditRole = (name: string, id: string) => {
  //   if (
  //     currentUserRolePermissions.rolePermissionData
  //       .map((item) => item.role)
  //       .some((item) => item.name === name)
  //   ) {
  //     navigate(`/roles/edit/${id}`);
  //   } else {
  //     enqueueSnackbar("没有编辑角色权限", {
  //       variant: "info",
  //     });
  //   }
  // };

  // const { run: handleEditRoleDebounce } = useDebounceFn(
  //   (name: string, id: string) => handleEditRole(name, id),
  //   {
  //     wait: 800,
  //   }
  // );

  // const handleRemoveRole = (name: string, id: string) => {
  //   if (
  //     currentUserRolePermissions.rolePermissionData
  //       .map((item) => item.role)
  //       .some((item) => item.name === name)
  //   ) {
  //     confirmTipsRef.current?.open();
  //     setRowId(id);
  //   } else {
  //     enqueueSnackbar("没有删除角色权限", {
  //       variant: "info",
  //     });
  //   }
  // };

  // const { run: handleRemoveRoleDebounce } = useDebounceFn(
  //   (name: string, id: string) => handleRemoveRole(name, id),
  //   {
  //     wait: 800,
  //   }
  // );

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
    // handleRoleAssignmentDebounce,
    // handleEditRoleDebounce,
    // handleRemoveRoleDebounce,
    deleteRole,
    updatePageDto,
    navigate,
    setRowId,
    loadRoles,
  };
};
