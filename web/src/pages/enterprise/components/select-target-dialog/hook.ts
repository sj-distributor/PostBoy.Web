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
import { clone } from "ramda";

const useAction = (props: {
  open: boolean;
  departmentList: IDepartmentData[];
  AppId: string;
}) => {
  const { open, departmentList } = props;

  const [newDepartmentList, setNewDepartmentList] = useState<IDepartmentData[]>(
    []
  );
  const [tagsValue, setTagsValue] = useState<string>("");

  const handleDeptOrUserClick = (clickedItem: IDepartmentAndUserListValue) => {
    let departmentIndex: number;
    if (clickedItem.type === DepartmentAndUserType.Department) {
      departmentIndex = newDepartmentList.findIndex(
        (e) => e.id === clickedItem.id
      );
      setNewDepartmentList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue[departmentIndex].selected =
          !newValue[departmentIndex].selected;
        return newValue;
      });
    } else {
      departmentIndex = newDepartmentList.findIndex(
        (e) => e.id === clickedItem.parentid
      );
      const userIndex = newDepartmentList[
        departmentIndex
      ].departmentUserList.findIndex((e) => e.userid === clickedItem.id);
      setNewDepartmentList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue[departmentIndex]["departmentUserList"][userIndex]["selected"] =
          !newValue[departmentIndex]["departmentUserList"][userIndex][
            "selected"
          ];
        return newValue;
      });
    }
  };

  useEffect(() => {
    setNewDepartmentList(clone(departmentList));
  }, [open, departmentList]);

  return {
    tagsValue,
    newDepartmentList,
    setTagsValue,
    handleDeptOrUserClick
  };
};
export default useAction;
