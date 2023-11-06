import { useLocation, useNavigate, useParams } from "react-router-dom";
import { clone } from "ramda";
import { useUpdateEffect } from "ahooks";
import {
  AddRolePermission,
  GetPermissions,
  GetRolePermission,
  UpdateRolePermission,
} from "../../../../api/role-user-permissions";
import {
  IPermissionsDto,
  IRole,
  IRolePermission,
  IRolePermissionItem,
} from "../../../../dtos/role-user-permissions";
import { useEffect, useMemo, useState } from "react";
import {
  AllDepartmentData,
  DepartmentDto,
  DepartmentTreeDto,
  RolePermissionsDto,
  groupPermissionsNames,
  informationPermissionsNames,
} from "./props";
import { useSnackbar } from "notistack";

import jsonData from "./departments.json";

export const useAction = () => {
  const [options, setOptions] = useState<DepartmentTreeDto[]>([]);

  const [rolePermissionsCheckedList, setRolePermissionsCheckedList] = useState<
    RolePermissionsDto[]
  >([]);

  const inputStyles = {
    border: 1,
    flex: 1,
    marginLeft: "0.3rem",
    borderColor: "#c4c4c4",
    paddingX: 1.4,
    paddingY: 0.65,
    borderRadius: 1,
    boxShadow: 1,
  };

  const formStyles = { flexBasis: "25%" };

  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();

  const navigate = useNavigate();

  const getFlatOptionsList = (data: DepartmentTreeDto[]) => {
    return data.reduce((accumulator, item) => {
      const higherDepartment: DepartmentDto = {
        name: item.department.name,
        id: item.department.id,
        isSelected: false,
        isHide: false,
      };

      accumulator.push(higherDepartment);

      if (item.childrens && item.childrens.length > 0) {
        higherDepartment.isExpand = false;
        higherDepartment.indeterminate = false;

        accumulator.push(
          ...item.childrens.map((childrenItem) => ({
            name: childrenItem.department.name,
            id: childrenItem.department.id,
            isSelected: false,
            parentId: childrenItem.department.parentId,
            isHide: true,
          }))
        );
      }

      return accumulator;
    }, [] as DepartmentDto[]);
  };

  const flatOptions = useMemo(() => {
    return getFlatOptionsList(options);
  }, [options]);

  const [checkboxData, setCheckboxData] = useState<AllDepartmentData>({
    pullCrowdData: flatOptions,
    notificationData: flatOptions,
  });

  const [showLabel, setShowLabel] = useState<AllDepartmentData>({
    pullCrowdData: [],
    notificationData: [],
  });

  const cloneCheckboxData = clone(checkboxData);

  const isHaveExpand = (option: DepartmentDto) => {
    return Object.hasOwn(option, "isExpand");
  };

  const getChildrenUnifiedState = (
    dataSource: keyof AllDepartmentData,
    parentIndex: number
  ) => {
    const childrenDepartment = cloneCheckboxData[dataSource].filter(
      (item) => item.parentId === cloneCheckboxData[dataSource][parentIndex].id
    );

    let isAllTrue = true;
    let isAllFalse = true;

    for (const child of childrenDepartment) {
      if (child.isSelected) isAllFalse = false;
      else isAllTrue = false;
    }

    return { isAllTrue, isAllFalse };
  };

  const renderShowLabel = (dataSource: keyof AllDepartmentData) => {
    const result: DepartmentDto[] = [];

    cloneCheckboxData[dataSource].forEach((item) => {
      item.isSelected && result.push(item);
    });

    setShowLabel((preValue) => {
      return { ...preValue, [dataSource]: result };
    });
  };

  const updateCloneCheckboxData = (
    dataSource: keyof AllDepartmentData,
    index: number,
    key: keyof DepartmentDto,
    fixedValue?: boolean,
    isRebellionSelfValue?: boolean,
    parentIndex?: number
  ) => {
    if (fixedValue !== undefined) {
      cloneCheckboxData[dataSource][index][key] = fixedValue;
    } else if (isRebellionSelfValue !== undefined && isRebellionSelfValue) {
      cloneCheckboxData[dataSource][index][key] =
        !cloneCheckboxData[dataSource][index][key];
    } else if (parentIndex !== undefined) {
      cloneCheckboxData[dataSource][index][key] =
        cloneCheckboxData[dataSource][parentIndex][key];
    }
  };

  const expandTreeCheckbox = (
    dataSource: keyof AllDepartmentData,
    index: number,
    option: DepartmentDto
  ) => {
    updateCloneCheckboxData(dataSource, index, "isExpand", undefined, true);

    cloneCheckboxData[dataSource].forEach(
      (item, index) =>
        item.parentId === option.id &&
        updateCloneCheckboxData(dataSource, index, "isHide", undefined, true)
    );

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  const updateParentCheckbox = (
    dataSource: keyof AllDepartmentData,
    parameterIndex: number,
    option: DepartmentDto
  ) => {
    updateCloneCheckboxData(dataSource, parameterIndex, "indeterminate", false);

    updateCloneCheckboxData(
      dataSource,
      parameterIndex,
      "isSelected",
      undefined,
      true
    );

    cloneCheckboxData[dataSource].forEach((item, index) => {
      if (item.parentId === option.id) {
        updateCloneCheckboxData(
          dataSource,
          index,
          "isSelected",
          undefined,
          undefined,
          parameterIndex
        );
      }
    });

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  const updateChildrenCheckbox = (
    dataSource: keyof AllDepartmentData,
    index: number
  ) => {
    const parentIndex = cloneCheckboxData[dataSource].findIndex(
      (x) => cloneCheckboxData[dataSource][index].parentId === x.id
    );

    updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", true);

    updateCloneCheckboxData(dataSource, index, "isSelected", undefined, true);

    const { isAllTrue, isAllFalse } = getChildrenUnifiedState(
      dataSource,
      parentIndex
    );

    const changeIndeterminateToFalse = () => {
      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", false);
    };

    if (isAllTrue) {
      changeIndeterminateToFalse();
      updateCloneCheckboxData(dataSource, parentIndex, "isSelected", true);
    }

    if (isAllFalse) {
      changeIndeterminateToFalse();
      updateCloneCheckboxData(dataSource, parentIndex, "isSelected", false);
    }

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  const removeOption = (
    dataSource: keyof AllDepartmentData,
    option: DepartmentDto
  ) => {
    const removeOptionIndex = cloneCheckboxData[dataSource].findIndex(
      (item) => item.id === option.id
    );

    if (isHaveExpand(option)) {
      cloneCheckboxData[dataSource].forEach((item, index) => {
        item.parentId === option.id &&
          updateCloneCheckboxData(dataSource, index, "isSelected", false);
      });

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "isSelected",
        false
      );

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "indeterminate",
        false
      );
    } else {
      const parentIndex = cloneCheckboxData[dataSource].findIndex(
        (x) => x.id === option.parentId
      );

      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", true);

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "isSelected",
        false
      );

      if (getChildrenUnifiedState(dataSource, parentIndex).isAllFalse) {
        updateCloneCheckboxData(
          dataSource,
          parentIndex,
          "indeterminate",
          false
        );

        updateCloneCheckboxData(dataSource, parentIndex, "isSelected", false);
      }
    }

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  useUpdateEffect(() => {
    renderShowLabel("pullCrowdData");
  }, [checkboxData.pullCrowdData]);

  useUpdateEffect(() => {
    renderShowLabel("notificationData");
  }, [checkboxData.notificationData]);

  // new

  const { id } = useParams();

  const defaultRole: IRole = {
    name: "",
    description: "",
  };

  const [permissions, setPermissions] = useState<IPermissionsDto>({
    count: 0,
    permissions: [],
  });

  const [role, setRole] = useState<IRole>(defaultRole);

  const [rolePermissionsDto, setRolePermissionsDto] = useState<
    IRolePermissionItem[]
  >([]);

  const [rolePermission, setRolePermission] = useState<IRolePermissionItem[]>(
    []
  );

  const updateRole = (k: keyof IRole, v: string) => {
    setRole((prev) => ({ ...prev, [k]: v }));
  };

  const addOrModifyRolePermission = () => {
    id ? updateRolePermission() : addRolePermission();
  };

  const addRolePermission = () => {
    const data: IRolePermission = {
      role: role,
      rolePermissions: rolePermissionsDto,
    };

    if (role.name && role.description)
      AddRolePermission(data)
        .then((res) => {
          if (res) {
            navigate("/roles/roleList");
            enqueueSnackbar("创建角色成功!", { variant: "success" });
          }
        })
        .catch((error) =>
          enqueueSnackbar((error as Error).message, { variant: "error" })
        );
    else {
      enqueueSnackbar("添加未填完", { variant: "error" });
    }
  };

  const updateRolePermission = () => {
    const data: IRolePermission = {
      role: role,
      rolePermissions: rolePermissionsDto,
    };

    if (role.name && role.description)
      UpdateRolePermission(data)
        .then((res) => {
          if (res) {
            navigate("/roles/roleList");
            enqueueSnackbar("修改角色成功!", { variant: "success" });
          }
        })
        .catch((error) =>
          enqueueSnackbar((error as Error).message ?? "修改失败", {
            variant: "error",
          })
        );
    else {
      enqueueSnackbar("修改失败", { variant: "error" });
    }
  };

  const handleUpdateRolePermissionsChecked = (id: string, v: boolean) => {
    const cloneData = clone(rolePermissionsCheckedList);
    cloneData.forEach((item) => item.id === id && (item.checked = v));
    setRolePermissionsCheckedList(cloneData);
  };

  useEffect(() => {
    (async () => {
      const data = jsonData.data.staffDepartmentHierarchy;
      setOptions(data);

      const options = getFlatOptionsList(data);

      const { count, permissions } = await GetPermissions();
      const permissionsList: RolePermissionsDto[] = [];
      permissions?.map((item) =>
        permissionsList.push({ ...item, checked: false })
      );

      permissionsList.length && setRolePermissionsCheckedList(permissionsList);
      setPermissions({
        count: count ?? 0,
        permissions: permissions ?? [],
      });

      const informationRoleIds = Array.from(
        new Set(
          permissions
            .filter((item) => informationPermissionsNames.includes(item.name))
            .map((item) => item.id)
        )
      );
      const groupRoleIds = Array.from(
        new Set(
          permissions
            .filter((item) => groupPermissionsNames.includes(item.name))
            .map((item) => item.id)
        )
      );

      if (id) {
        // 获取角色信息
        const {
          role,
          rolePermissions,
          rolePermissionUnits,
          permissions: currentPermissions,
        } = await GetRolePermission("3455efc5-6481-4d48-b9d2-9f15b6d5f899");
        setRole(role ?? defaultRole);
        const selectedPermissions = currentPermissions?.map((item) => item.id);
        setRolePermission(rolePermissions ?? []);

        const groupUsersList = rolePermissionUnits
          ?.filter((item) =>
            groupRoleIds.some((gId) => gId === item.permissionId)
          )
          .map((item) => item.unitId);
        const informationUsersList = rolePermissionUnits
          ?.filter((item) =>
            informationRoleIds.some((iId) => iId === item.permissionId)
          )
          .map((item) => item.unitId);

        const pullCrowdData = options.map((item) =>
          groupUsersList?.some((userId) => userId === item.id)
            ? { ...item, isSelected: true }
            : item
        );
        const notificationData = options.map((item) =>
          informationUsersList?.some((userId) => userId === item.id)
            ? { ...item, isSelected: true }
            : item
        );

        setCheckboxData({ pullCrowdData, notificationData });

        if (selectedPermissions?.length) {
          const permissionsList: RolePermissionsDto[] = [];
          permissions?.map((item) =>
            permissionsList.push({
              ...item,
              checked: selectedPermissions.includes(item.id),
            })
          );

          permissionsList.length &&
            setRolePermissionsCheckedList(permissionsList);
        }
      }
    })();
  }, []);

  useEffect(() => {
    setCheckboxData({
      pullCrowdData: flatOptions,
      notificationData: flatOptions,
    });
  }, [flatOptions]);

  useEffect(() => {
    const newRoleList: IRolePermissionItem[] = [];
    const groupUnitIds = checkboxData.pullCrowdData
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    const informationUnitIds = checkboxData.notificationData
      .filter((item) => item.isSelected)
      .map((item) => item.id);

    rolePermissionsCheckedList.map((item) => {
      const list: IRolePermissionItem = {
        permissionId: item.id,
      };
      if (groupPermissionsNames.some((iId) => iId === item.name)) {
        list.unitIds = groupUnitIds;
      }
      if (informationPermissionsNames.some((iId) => iId === item.name)) {
        list.unitIds = informationUnitIds;
      }
      if (item.checked) {
        newRoleList.push(list);
      }
    });
    setRolePermissionsDto(newRoleList);
  }, [rolePermissionsCheckedList, checkboxData]);

  return {
    flatOptions,
    inputStyles,
    formStyles,
    location,
    checkboxData,
    showLabel,
    navigate,
    setCheckboxData,
    isHaveExpand,
    expandTreeCheckbox,
    updateParentCheckbox,
    updateChildrenCheckbox,
    removeOption,
    // new
    updateRole,
    role,
    rolePermission,
    rolePermissionsCheckedList,
    handleUpdateRolePermissionsChecked,
    addOrModifyRolePermission,
  };
};
