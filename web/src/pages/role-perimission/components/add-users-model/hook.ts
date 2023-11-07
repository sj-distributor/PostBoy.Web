import { RefObject, useEffect, useRef, useState } from "react";
import { TreeNode } from "./props";
import { TreeSelectRef } from "../tree-select/props";

import { useSnackbar } from "notistack";
import { ModalBoxRef } from "../../../../dtos/modal";
import {
  AddRoleUser,
  GetTreeList,
} from "../../../../api/role-user-permissions";
import {
  DepartmentTreeDto,
  StaffDepartmentHierarchyListProps,
} from "../../../../dtos/role-user-permissions";
import jsonData from "./latest tree.json";
import { clone, set } from "ramda";
import { Message } from "@mui/icons-material";

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

  const [foundationTreeData, setFoundationTreeData] = useState<
    DepartmentTreeDto[]
  >([]);

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

  const handleFoundationTree = () => {
    GetTreeList()
      .then((res) => {
        res &&
          res.staffDepartmentHierarchy.length > 0 &&
          setFoundationTreeData(res.staffDepartmentHierarchy);
      })
      .catch((error) => {
        enqueueSnackbar((error as Error).message, { variant: "error" });
      });
  };

  const foundationFlatTreeData: TreeNode[] = [];

  const flattenTreeDepartmentList = (
    source: DepartmentTreeDto[],
    idRoute: string[]
  ) => {
    for (const sourceItem of source) {
      foundationFlatTreeData.push({
        id: sourceItem.department.id,
        title: sourceItem.department.name,
        idRoute: [
          ...idRoute,
          sourceItem.department.parentId,
          sourceItem.department.id,
        ],
        children: [],
        isDepartment: true,
      });

      foundationFlatTreeData.push(
        ...sourceItem.staffs.map((staff) => ({
          id: staff.id,
          title: staff.userName,
          idRoute: [
            ...idRoute,
            sourceItem.department.parentId,
            sourceItem.department.id,
            staff.id,
          ],
          children: [],
          isDepartment: false,
        }))
      );

      if (sourceItem.childrens) {
        flattenTreeDepartmentList(sourceItem.childrens, [
          ...idRoute,
          sourceItem.department.parentId,
        ]);
      }
    }
    return foundationFlatTreeData;
  };

  const treeData = flattenTreeDepartmentList(foundationTreeData, []);

  useEffect(() => {
    alreadySelectData.length === 0
      ? setIsConfirmDisbale(true)
      : setIsConfirmDisbale(false);
  }, [alreadySelectData]);

  useEffect(() => {
    handleFoundationTree();
  }, []);

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
