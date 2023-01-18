import { useEffect, useState } from "react";
import {
  GetDepartmentList,
  GetDepartmentUsersList
} from "../../../../api/enterprise";
import {
  IDepartmentData,
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

  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([]);
  const [tagsValue, setTagsValue] = useState<string>(setDialogValue.tagsValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeptOrUserClick = (clickedItem: IDepartmentAndUserListValue) => {
    let resultIndex: number;
    if (clickedItem.type === DepartmentAndUserType.Department) {
      resultIndex = departmentList.findIndex((e) => e.id === clickedItem.id);
      setDepartmentList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue[resultIndex].selected = !newValue[resultIndex].selected;
        return newValue;
      });
    } else {
      const userList = departmentList.find(
        (e) => e.id === clickedItem.parentid
      );
      if (userList) {
        resultIndex = userList.departmentUserList.findIndex(
          (e) => e.userid === clickedItem.id
        );
        setDepartmentList((prev) => {
          const newValue = prev.filter((e) => !!e);
          const newUserList = newValue.find(
            (e) => e.id === clickedItem.parentid
          );
          if (newUserList) {
            newUserList.departmentUserList[resultIndex].selected =
              !newUserList.departmentUserList[resultIndex].selected;
          }
          return newValue;
        });
      }
    }
  };

  const loadDeptUsers = async () => {
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
            const newValue = prevList.filter((e) => !!e);
            newValue.push({
              ...department,
              departmentUserList: userList.userlist.map((e) => {
                e.selected = false;
                return e;
              }),
              selected: false
            });
            return newValue;
          });
        departmentList.department[departmentList.department.length - 1] ===
          department && setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setDepartmentList(setDialogValue.deptAndUserValueList);
  }, [open]);

  useEffect(() => {
    setDepartmentList([]);
    setIsLoading(true);
    loadDeptUsers();
  }, [AppId]);

  return {
    departmentList,
    tagsValue,
    isLoading,
    setTagsValue,
    handleDeptOrUserClick
  };
};
export default useAction;
