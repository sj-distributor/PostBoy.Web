import { useEffect, useState } from "react";
import {
  GetDepartmentList,
  GetDepartmentUsersList
} from "../../../../api/enterprise";
import {
  IDepartmentListData,
  IDepartmentAndUserListValue,
  ITargetDialogValue,
  DepartmentAndUserType
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
  const [deptOrUserValueList, setDeptOrUserValueList] = useState<
    IDepartmentAndUserListValue[]
  >(setDialogValue.deptOrUserValueList);
  const [tagsValue, setTagsValue] = useState<string>(setDialogValue.tagsValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserClick = (user: IDepartmentAndUserListValue) => {
    !deptOrUserValueList.find((e) => e.id === user.id) &&
      setDeptOrUserValueList((prev) => [...prev, user]);
  };

  const handleDepartmentClick = (department: IDepartmentListData) => {
    setDepartmentList(
      departmentList.map((item) => {
        if (item.id === department.id) {
          item.isCollapse = !item.isCollapse;
        }
        return item;
      })
    );
    !deptOrUserValueList.find((e) => e.id === department.id) &&
      setDeptOrUserValueList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue.push({
          id: department.id,
          name: department.name,
          type: DepartmentAndUserType.Department,
          parentid: department.parentid
        });
        return newValue;
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
    setDepartmentList((prev) => {
      const newValue = prev.filter((e) => !!e);
      return newValue.map((e) => {
        e.isCollapse = !!deptOrUserValueList.find((item) => item.id === e.id);
        return e;
      });
    });
  }, [open]);

  useEffect(() => {
    setDepartmentList([]);
    setIsLoading(true);
    asyncSettingDepartmentList();
  }, [AppId]);

  return {
    departmentList,
    tagsValue,
    deptOrUserValueList,
    isLoading,
    setTagsValue,
    handleDepartmentClick,
    handleUserClick
  };
};
export default useAction;
