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
import { AllDepartmentData, DepartmentDto, DepartmentTreeDto, RolePermissionsDto } from "./props";

import jsonData from './departments.json'

export const useAction = () => {
  const [options, setOptions] = useState<DepartmentTreeDto[]>([])

  const [rolePermissions, setRolePermissions] = useState<RolePermissionsDto[]>([
    {
      id: '1',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '信息发送',
      roleName: '信息发送',
      description: '信息发送',
      checked: false
    },
    {
      id: '2',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '创建群组',
      roleName: '创建群组',
      description: '创建群组',
      checked: false
    },
    {
      id: '3',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '添加群组成员',
      roleName: '添加群组成员',
      description: '添加群组成员',
      checked: false
    },
    {
      id: '4',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '发送通知',
      roleName: '发送通知',
      description: '发送通知',
      checked: false
    },
    {
      id: '5',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '发送记录',
      roleName: '发送记录',
      description: '发送记录',
      checked: false
    },
    {
      id: '6',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '角色权限',
      roleName: '角色权限',
      description: '角色权限',
      checked: false
    },
    {
      id: '7',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '新增角色',
      roleName: '新增角色',
      description: '新增角色',
      checked: false
    },
    {
      id: '8',
      createdDate: '1',
      lastModifiedDate: '2',
      roleId: '3',
      permissionId: '22',
      permissionName: '分配',
      roleName: '分配',
      description: '分配',
      checked: false
    }
  ])

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

  const location = useLocation();

  const navigate = useNavigate();

  const flatOptions = useMemo(() => {
    return options.reduce((accumulator, item) => {
      const higherDepartment: DepartmentDto = {
        name: item.department.name,
        id: item.department.id,
        isSelected: false,
        isHide: false,
      };

      accumulator.push(higherDepartment);

      if (
        item.childrens &&
        item.childrens.length > 0
      ) {
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
    }, [] as DepartmentDto[])
  }, [options])



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
    id: "",
    name: "",
    description: "",
  };

  const [permissions, setPermissions] = useState<IPermissionsDto>({
    count: 0,
    rolePermissions: [],
  });

  const [role, setRole] = useState<IRole>(defaultRole);

  const [rolePermissionsDto, setRolePermissionsDto] = useState<IRolePermissionItem[]>([])

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
      rolePermissions: rolePermissionsDto
    }

    if (role.name && role.description)
      AddRolePermission(data)
        .then((res) => console.log(res))
        .catch((error) => console.log((error as Error).message));
    else {
      console.log("添加未填完");
    }
  };

  const updateRolePermission = () => {
    const data: IRolePermission = {
      role: role,
      rolePermissions: rolePermissionsDto
    }

    if (role.name && role.description)
      UpdateRolePermission(data)
        .then((res) => console.log(res))
        .catch((error) => console.log((error as Error).message));
    else {
      console.log("修改未填完");
    }
  };

  const handleUpdateRolePermissionsChecked = (id: string, v: boolean) => {
    const cloneData = clone(rolePermissions)
    cloneData.forEach(item => item.id === id && (item.checked = v))
    setRolePermissions(cloneData)
  }


  useEffect(() => {
    if (id) {
      // 获取角色信息
      GetRolePermission('3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .then((res) => {
          const { role, rolePermissions } = res;
          setRole(role ?? defaultRole);
          setRolePermission(rolePermissions ?? []);
          console.log(res)
        })
        .catch((err) => {
          // console.log((err as Error).message);
          setRole(defaultRole);
          setRolePermission([]);
        });
    }
  }, [id]);

  useEffect(() => {
    GetPermissions()
      .then((res) => {
        const permissionsList: RolePermissionsDto[] = []
        res.rolePermissions.map(item => permissionsList.push({ ...item, checked: false }))
        setPermissions({
          count: res.count ?? 0,
          rolePermissions: res.rolePermissions ?? [],
        });
        setRolePermissions(permissionsList)
      })
      .catch((err) => {
        setPermissions({
          count: 0,
          rolePermissions: [],
        });
      });
  }, []);
  useEffect(() => {
    const data = jsonData.data.staffDepartmentHierarchy;
    setOptions(data)
  }, [])

  useEffect(() => {
    setCheckboxData({ pullCrowdData: flatOptions, notificationData: flatOptions })
  }, [flatOptions])

  useEffect(() => {

    const newRoleList: IRolePermissionItem[] = [];
    const groupUnitIds = checkboxData.pullCrowdData.filter(item => item.isSelected).map(item => item.id)
    const informationUnitIds = checkboxData.notificationData.filter(item => item.isSelected).map(item => item.id)

    rolePermissions.map(item => {
      const list: IRolePermissionItem = {
        id: item.id,
        roleId: item.roleId,
        permissionId: item.permissionId,
      }
      if (item.permissionName === '创建群组' || item.permissionName === '添加群组成员') {
        list.unitIds = groupUnitIds

      }
      if (item.permissionName === '信息发送' || item.permissionName === '发送通知') {
        list.unitIds = informationUnitIds
      }
      if (item.checked) {
        newRoleList.push(list)
      }

    })
    setRolePermissionsDto(newRoleList)
  }, [rolePermissions])

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
    permissions,
    updateRole,
    role,
    rolePermission,
    rolePermissions,
    handleUpdateRolePermissionsChecked,
    addOrModifyRolePermission,
  };
};
