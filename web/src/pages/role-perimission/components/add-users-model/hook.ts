import { RefObject, useEffect, useRef, useState } from "react";
import { TreeNode } from "./props";
import { TreeSelectRef } from "../tree-select/props";

import { useSnackbar } from "notistack";
import { ModalBoxRef } from "../../../../dtos/modal";
import { AddRoleUser } from "../../../../api/role-user-permissions";
import {
  StaffDepartmentHierarchyListProps,
  StaffFoundationHierarchyList,
} from "../../../../dtos/role-user-permissions";
import jsonData from "./new tree structure.json";
import { clone } from "ramda";

export const useAction = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
  roleId: string;
  initUserList: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { addUsersRef, initUserList, roleId } = props;

  const [searchValue, setSearchValue] = useState<string>("");

  const treeSelectRef = useRef<TreeSelectRef>(null);

  const [alreadySelectData, setAlreadySelectData] = useState<TreeNode[]>([]);

  const [isConfirmDisbale, setIsConfirmDisbale] = useState<boolean>(true);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleAddRoleUsers = () => {
    const roleUsers = alreadySelectData.map((item) => ({
      userId: item.id,
      roleId: roleId,
    }));

    AddRoleUser({ roleUsers })
      .then(() => {
        enqueueSnackbar("添加用户成功!", { variant: "success" });
        addUsersRef.current?.close();
        initUserList();
      })
      .catch((error) => {
        enqueueSnackbar((error as Error).message, { variant: "error" });
      });
  };

  const staffDepartmentHierarchyTestData =
    jsonData.data.staffDepartmentHierarchy;
  const staffDepartmentHierarchyTreeData = clone(
    staffDepartmentHierarchyTestData
  );
  const treeData: TreeNode[] = [];

  const flattenTreeDepartmentList = (
    source: StaffDepartmentHierarchyListProps[],
    idRoute: string[]
  ) => {
    for (const sourceItem of source) {
      treeData.push({
        id: sourceItem.department.id,
        title: sourceItem.department.name,
        idRoute: [...idRoute, sourceItem.department.id],
        children: [],
        isDepartment: true,
      });

      treeData.push(
        ...sourceItem.staffs.map((staff) => ({
          id: staff.id,
          title: staff.userName,
          idRoute: [...idRoute, sourceItem.department.id, staff.id],
          children: [],
          isDepartment: false,
        }))
      );

      if (sourceItem.childrens) {
        flattenTreeDepartmentList(sourceItem.childrens, [
          ...idRoute,
          sourceItem.department.id,
        ]);
      }
    }
  };

  staffDepartmentHierarchyTreeData.map((item) => {
    const idRoute = [
      item.companies.department.parentId,
      item.companies.department.id,
    ];

    treeData.push({
      id: item.companies.department.id,
      title: item.companies.department.name,
      idRoute,
      children: [],
      isDepartment: true,
    });

    flattenTreeDepartmentList(item.departments, idRoute);
  });

  useEffect(() => {
    alreadySelectData.length === 0
      ? setIsConfirmDisbale(true)
      : setIsConfirmDisbale(false);
  }, [alreadySelectData]);

  return {
    treeData,
    searchValue,
    handleSearchChange,
    treeSelectRef,
    alreadySelectData,
    isConfirmDisbale,
    setAlreadySelectData,
    handleAddRoleUsers,
  };
};
