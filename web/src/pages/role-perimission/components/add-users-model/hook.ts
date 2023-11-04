import { useEffect, useRef, useState } from "react";
import { TreeNode } from "./props";
import { TreeSelectRef } from "../tree-select/props";
import jsonData from "./new tree structure.json";
import { clone, set } from "ramda";
import {
  StaffDepartmentHierarchyListProps,
  StaffFoundationHierarchyList,
} from "../../../../dtos/role-user-permissions";
import { GetFoundationTreeList } from "../../../../api/role-user-permissions";

export const useAction = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const treeSelectRef = useRef<TreeSelectRef>(null);

  const [alreadySelectData, setAlreadySelectData] = useState<TreeNode[]>([]);

  const [foundationTreeListData, setFoundationTreeListData] =
    useState<StaffFoundationHierarchyList[]>();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const test = jsonData.data.staffDepartmentHierarchy;
  const data = clone(test);
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
        status: true,
      });

      treeData.push(
        ...sourceItem.staffs.map((staff) => ({
          id: staff.id,
          title: staff.userName,
          idRoute: [...idRoute, sourceItem.department.id, staff.id],
          children: [],
          status: false,
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

  data.map((item) => {
    const idRoute = [
      item.companies.department.parentId,
      item.companies.department.id,
    ];

    treeData.push({
      id: item.companies.department.id,
      title: item.companies.department.name,
      idRoute,
      children: [],
      status: true,
    });

    flattenTreeDepartmentList(item.departments, idRoute);
  });

  const GetFoundationTreeListData = () => {
    GetFoundationTreeList()
      .then((res) => {
        res &&
          res.staffDepartmentHierarchy &&
          setFoundationTreeListData(res.staffDepartmentHierarchy);
      })
      .catch((err) => {
        // enqueueSnackbar((error as Error).message, { variant: "error" });
      });
  };

  return {
    treeData,
    searchValue,
    handleSearchChange,
    treeSelectRef,
    alreadySelectData,
    setAlreadySelectData,
  };
};
