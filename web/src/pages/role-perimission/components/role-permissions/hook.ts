import { useEffect, useRef, useState } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  IPageDto,
  IRoleDto,
  IRolePermissionDataItem,
} from "../../../../dtos/role-user-permissions";
import {
  DeleteRoles,
  GetRolesList,
} from "../../../../api/role-user-permissions";

export const useAction = () => {
  const userRoleData = [
    {
      role: {
        id: "3455efc5-6481-4d48-b9d2-9f15b6d5f899",
        createdDate: "2023-11-05T10:01:14.722+00:00",
        modifiedDate: "2023-11-05T10:01:14.722+00:00",
        name: "Administrator",
        displayName: "Administrator",
        description: "超級管理員",
      },
      permissions: [
        {
          id: "08dbddd2-ac9d-4ce7-815f-c7ca37f2224d",
          createdDate: "0001-01-01T00:00:00+00:00",
          lastModifiedDate: "0001-01-01T00:00:00+00:00",
          name: "信息发送",
          displayName: null,
          description: "sry",
          isSystem: true,
        },
        {
          id: "08dbdddd-7166-41bb-831e-d6e09ac88254",
          createdDate: "0001-01-01T00:00:00+00:00",
          lastModifiedDate: "0001-01-01T00:00:00+00:00",
          name: "创建群组",
          displayName: null,
          description: "awsl",
          isSystem: true,
        },
      ],
    },
  ];

  const [rowId, setRowId] = useState<number>();

  const confirmTipsRef = useRef<ModalBoxRef>(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const [pageDto, setPageDto] = useState<IPageDto>({
    pageIndex: 0,
    pageSize: 20,
    keyword: "",
  });

  const [roleDto, setRoleDto] = useState<IRoleDto>({
    count: 0,
    rolePermissionData: [],
  });

  const handleRoleAssignment = (name: string) => {};
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
    k: keyof IRoleDto,
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
    userRoleData,
    deleteRole,
    updatePageDto,
    navigate,
    setRowId,
    loadRoles,
  };
};
