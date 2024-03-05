import { RefObject, useEffect, useRef, useState } from "react";
import { TreeNode } from "./props";
import { TreeSelectRef } from "../tree-select/props";

import { useSnackbar } from "notistack";
import { ModalBoxRef } from "../../../../dtos/modal";
import {
  AddRoleUser,
  GetRoleUser,
  GetTreeList,
} from "../../../../api/role-user-permissions";
import {
  IDepartmentTreeDto,
  IRoleUserItemDto,
} from "../../../../dtos/role-user-permissions";
import { useDebounceFn } from "ahooks";

export const useAction = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
  roleId: string;
  initUserList: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { addUsersRef, initUserList, roleId } = props;

  const [searchValue, setSearchValue] = useState<string>("");

  const [isTreeLoading, setIsTreeLoading] = useState<boolean>(false);

  const [isAddUserLoading, setIsAddUserLoading] = useState<boolean>(false);

  const treeSelectRef = useRef<TreeSelectRef>(null);

  const [alreadySelectData, setAlreadySelectData] = useState<TreeNode[]>([]);

  const [isConfirmDisbale, setIsConfirmDisbale] = useState<boolean>(true);

  const [totalRoleUserList, setTotalRoleUserList] = useState<
    IRoleUserItemDto[]
  >([]);

  const [foundationTreeData, setFoundationTreeData] = useState<
    IDepartmentTreeDto[]
  >([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleAddRoleUsers = useDebounceFn(
    () => {
      const roleUsers = alreadySelectData.map((item) => ({
        userId: item.id,
        roleId: roleId,
      }));
      setIsAddUserLoading(true);
      AddRoleUser({ roleUsers })
        .then(() => {
          enqueueSnackbar("添加用户成功!页面将在三秒后刷新", {
            variant: "success",
          });
          addUsersRef.current?.close();
          initUserList();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          enqueueSnackbar((error as Error).message, { variant: "error" });
        })
        .finally(() => {
          setIsAddUserLoading(false);
        });
    },
    { wait: 500 }
  ).run;

  const handleFoundationTree = () => {
    setIsTreeLoading(true);
    GetTreeList()
      .then((res) => {
        setFoundationTreeData(res?.staffDepartmentHierarchy ?? []);
        setIsTreeLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar((error as Error).message, { variant: "error" });
        setIsTreeLoading(false);
      });
  };

  const handleTotalRoleUserList = () => {
    GetRoleUser({
      PageIndex: 1,
      PageSize: 2147483647,
      RoleId: roleId,
    })
      .then((res) => {
        setTotalRoleUserList(res?.roleUsers ?? []);
      })
      .catch((error) => {
        enqueueSnackbar((error as Error).message, { variant: "error" });
      });
  };

  const foundationFlatTreeData: TreeNode[] = [];

  const flattenTreeDepartmentList = (
    source: IDepartmentTreeDto[],
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
    handleTotalRoleUserList();
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
    totalRoleUserList,
    isTreeLoading,
    isAddUserLoading,
  };
};
