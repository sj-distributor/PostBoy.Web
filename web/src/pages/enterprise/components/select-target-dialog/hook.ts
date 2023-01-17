import { useEffect, useState } from "react";
import {
  GetDepartmentList,
  GetDepartmentUsersList
} from "../../../../api/enterprise";
import {
  IDepartmentListData,
  IDepartmentUsersData,
  ITargetDialogValue
} from "../../../../dtos/enterprise";

const useAction = (props: {
  open: boolean;
  setDialogValue: ITargetDialogValue;
  AppId: string;
}) => {
  const { open, setDialogValue, AppId } = props;

  const [departmentList, setDepartmentList] = useState<IDepartmentListData[]>(
    []
  );
  const [departmentUserValue, setDepartmentUserValue] =
    useState<IDepartmentUsersData>();
  const [tagsValue, setTagsValue] = useState<string>(setDialogValue.tagsValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserClick = (user: IDepartmentUsersData) => {
    setDepartmentUserValue(user);
  };

  const handleDepartmentClick = (department: IDepartmentListData) => {
    setDepartmentList((prevList) => {
      return prevList.map((item) => {
        if (item.id === department.id) {
          item.isCollapse = !item.isCollapse;
        }
        return item;
      });
    });
  };

  const asyncSettingDepartmentList = async () => {
    const departmentList = !!AppId ? await GetDepartmentList({ AppId }) : null;
    if (!!departmentList && departmentList.errcode === 0) {
      for (const department of departmentList.department) {
        const userList = await GetDepartmentUsersList({
          AppId,
          DepartmentId: department.id
        });
        !!userList &&
          userList.errcode === 0 &&
          setDepartmentList((prevList) => {
            const newValue = prevList.slice();
            newValue.push({
              ...department,
              departmentUserList: userList.userlist,
              isCollapse: false
            });
            return newValue;
          });
        departmentList.department[departmentList.department.length - 1] ===
          department && setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setDepartmentUserValue(setDialogValue.departmentUserValue);
  }, [open]);

  useEffect(() => {
    setDepartmentList([]);
    setIsLoading(true);
    asyncSettingDepartmentList();
  }, [AppId]);

  return {
    departmentList,
    tagsValue,
    departmentUserValue,
    isLoading,
    setTagsValue,
    handleDepartmentClick,
    handleUserClick
  };
};
export default useAction;
