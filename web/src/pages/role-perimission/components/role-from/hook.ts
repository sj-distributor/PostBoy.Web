import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IDepartmentDto } from "../../../../dtos/role";
import { useEffect, useState } from "react";
import { clone } from "ramda";
import { useUpdateEffect } from "ahooks";
import { AllDepartmentData, DepartmentDto } from "./props";
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
import { error } from "console";

export const useAction = () => {
  const options: IDepartmentDto = {
    allDepartment: [
      {
        higherDepartment: {
          name: "WXF Office",
          id: "888",
          childrenDepartment: [
            { name: "Operating Support Center", id: "81" },
            { name: "Department A", id: "82" },
            { name: "Department B", id: "83" },
          ],
        },
      },
      {
        higherDepartment: {
          name: "IS Office",
          id: "999",
          childrenDepartment: [
            { name: "Department C", id: "91" },
            { name: "Department D", id: "92" },
          ],
        },
      },
    ],
  };

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

  const selectStyles = { marginLeft: "0.3rem", flex: 1 };

  const location = useLocation();

  const navigate = useNavigate();

  const flatOptions = options.allDepartment.reduce((accumulator, item) => {
    const higherDepartment: DepartmentDto = {
      name: item.higherDepartment.name,
      id: item.higherDepartment.id,
      isSelected: false,
      isHide: false,
    };

    accumulator.push(higherDepartment);

    if (
      item.higherDepartment.childrenDepartment &&
      item.higherDepartment.childrenDepartment.length > 0
    ) {
      higherDepartment.isExpand = false;
      higherDepartment.indeterminate = false;

      accumulator.push(
        ...item.higherDepartment.childrenDepartment.map((childrenItem) => ({
          name: childrenItem.name,
          id: childrenItem.id,
          isSelected: false,
          parentId: item.higherDepartment.id,
          isHide: true,
        }))
      );
    }

    return accumulator;
  }, [] as DepartmentDto[]);

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
    createdDate: "",
    modifiedDate: "",
  };

  const [permissions, setPermissions] = useState<IPermissionsDto>({
    count: 0,
    permissions: [],
  });

  const [role, setRole] = useState<IRole>(defaultRole);

  const [rolePermission, setRolePermission] = useState<IRolePermissionItem[]>(
    []
  );

  const [optionItemsChecked, setOptionItemsChecked] = useState<boolean>();

  const updateRole = (k: keyof IRole, v: string) => {
    setRole((prev) => ({ ...prev, [k]: v }));
  };

  const addOrModifyRolePermission = () => {
    id ? updateRolePermission() : addRolePermission();
  };

  const addRolePermission = () => {
    if (role.name && role.description)
      AddRolePermission({ role, rolePermissions: rolePermission })
        .then((res) => console.log(res))
        .catch((error) => console.log((error as Error).message));
    else {
      console.log("添加未填完");
    }
  };

  const updateRolePermission = () => {
    if (role.name && role.description)
      UpdateRolePermission({ role, rolePermissions: rolePermission })
        .then((res) => console.log(res))
        .catch((error) => console.log((error as Error).message));
    else {
      console.log("修改未填完");
    }
  };

  const handleOptionPermissionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOptionItemsChecked(event.target.checked);
  };

  useEffect(() => {
    if (id) {
      // 获取角色信息
      GetRolePermission(id)
        .then((res) => {
          const { role, rolePermissions } = res;
          setRole(role ?? defaultRole);
          setRolePermission(rolePermissions ?? []);
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
        setPermissions({
          count: res.count ?? 0,
          permissions: res.permissions ?? [],
        });
      })
      .catch((err) => {
        setPermissions({
          count: 0,
          permissions: [],
        });
      });
  }, []);

  return {
    flatOptions,
    inputStyles,
    selectStyles,
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
    addOrModifyRolePermission,
    handleOptionPermissionChange,
    optionItemsChecked,
  };
};
