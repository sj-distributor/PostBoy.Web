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
  const [deptOrUserValueList, setDeptOrUserValueList] = useState<
    IDepartmentAndUserListValue[]
  >([]);
  const [tagsValue, setTagsValue] = useState<string>(setDialogValue.tagsValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeptOrUserClick = (clickedItem: IDepartmentAndUserListValue) => {
    const resultIndex = deptOrUserValueList.findIndex(
      (e) => e.id === clickedItem.id
    );
    resultIndex <= -1
      ? clickedItem.type === DepartmentAndUserType.Department
        ? setDeptOrUserValueList((prev) => {
            const newValue = prev.filter((e) => !!e);
            newValue.push({
              id: clickedItem.id,
              name: clickedItem.name,
              type: DepartmentAndUserType.Department,
              parentid: clickedItem.parentid
            });
            return newValue;
          })
        : setDeptOrUserValueList((prev) => [...prev, clickedItem])
      : setDeptOrUserValueList((prev) => {
          const newValue = prev.filter((e) => !!e);
          newValue.splice(resultIndex, 1);
          return newValue;
        });
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
              departmentUserList: userList.userlist
            });
            return newValue;
          });
        departmentList.department[departmentList.department.length - 1] ===
          department && setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setDeptOrUserValueList(setDialogValue.deptOrUserValueList);
  }, [open]);

  useEffect(() => {
    setDepartmentList([]);
    setIsLoading(true);
    loadDeptUsers();
  }, [AppId]);

  return {
    departmentList,
    tagsValue,
    deptOrUserValueList,
    isLoading,
    setTagsValue,
    handleDeptOrUserClick
  };
};
export default useAction;
