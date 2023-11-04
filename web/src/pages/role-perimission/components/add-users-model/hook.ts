import { RefObject, useEffect, useRef, useState } from "react";
import { TreeNode } from "./props";
import { TreeSelectRef } from "../tree-select/props";

import { useSnackbar } from "notistack";
import { ModalBoxRef } from "../../../../dtos/modal";
import { AddRoleUser } from "../../../../api/role-user-permissions";

export const useAction = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
  initUserList: () => void;
}) => {
  const treeData: TreeNode[] = [
    {
      id: 1,
      idRoute: [1],
      title: "节点1",
      children: [
        {
          id: 4,
          idRoute: [1, 4],
          title: "节点1-4",
          children: [
            {
              id: 5,
              idRoute: [1, 4, 5],
              title: "节点1-4-5",
              children: [
                {
                  id: 6,
                  idRoute: [1, 4, 5, 6],
                  title: "节点1-4-5-6",
                  children: [],
                },
                {
                  id: 12,
                  idRoute: [1, 4, 5, 12],
                  title: "节点1-4-5-12",
                  children: [],
                },
                {
                  id: 9,
                  idRoute: [1, 4, 5, 9],
                  title: "节点1-4-5-9",
                  children: [
                    {
                      id: 10,
                      idRoute: [1, 4, 5, 9, 10],
                      title: "节点1-4-5-9-10",
                      children: [],
                    },
                    {
                      id: 11,
                      idRoute: [1, 4, 5, 9, 11],
                      title: "节点1-4-5--9-11",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      idRoute: [2],
      title: "节点2",
      children: [
        {
          id: 7,
          idRoute: [2, 7],
          title: "节点2-7",
          children: [],
        },
      ],
    },
    {
      id: 3,
      idRoute: [3],
      title: "节点3",
      children: [
        {
          id: 8,
          idRoute: [3, 8],
          title: "节点3-8",
          children: [
            {
              id: 15,
              idRoute: [3, 8, 15],
              title: "节点3-8-15",
              children: [
                {
                  id: 16,
                  idRoute: [3, 8, 15, 16],
                  title: "节点3-8-15-16",
                  children: [],
                },
                {
                  id: 17,
                  idRoute: [3, 8, 15, 17],
                  title: "节点3-8-15-17",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const { addUsersRef, initUserList } = props;

  const [searchValue, setSearchValue] = useState<string>("");

  const treeSelectRef = useRef<TreeSelectRef>(null);

  const [alreadySelectData, setAlreadySelectData] = useState<TreeNode[]>([]);

  const [isConfirmDisbale, setIsConfirmDisbale] = useState<boolean>(true);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleAddRoleUsers = () => {
    // AddRoleUser({ roleUsers })
    //   .then(() => {
    //     enqueueSnackbar("添加用户成功!", { variant: "success" });
    //     addUsersRef.current?.close();
    //     initUserList();
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar((error as Error).message, { variant: "error" });
    //   });
  };

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
