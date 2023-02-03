import { useEffect, useState } from "react";
import {
  IDepartmentData,
  IDepartmentAndUserListValue,
  DepartmentAndUserType,
  ITagsList
} from "../../../../dtos/enterprise";

const useAction = (props: {
  departmentAndUserList: IDepartmentData[];
  AppId: string;
  isLoading: boolean;
  setTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>;
  setDeptUserList: React.Dispatch<React.SetStateAction<IDepartmentData[]>>;
}) => {
  const { departmentAndUserList, AppId, isLoading, setDeptUserList } = props;
  const [departmentSelectedList, setDepartmentSelectedList] = useState<
    IDepartmentAndUserListValue[]
  >([]);

  const handleDeptOrUserClick = (clickedItem: IDepartmentAndUserListValue) => {
    let departmentIndex: number;
    if (clickedItem.type === DepartmentAndUserType.Department) {
      departmentIndex = departmentAndUserList.findIndex(
        (e) => e.id === clickedItem.id
      );
      setDeptUserList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue[departmentIndex].selected =
          !newValue[departmentIndex].selected;
        return newValue;
      });
    } else {
      departmentIndex = departmentAndUserList.findIndex(
        (e) => e.name === clickedItem.parentid
      );
      const userIndex = departmentAndUserList[
        departmentIndex
      ].departmentUserList.findIndex((e) => e.userid === clickedItem.id);
      setDeptUserList((prev) => {
        const newValue = prev.filter((e) => !!e);
        newValue[departmentIndex]["departmentUserList"][userIndex]["selected"] =
          !newValue[departmentIndex]["departmentUserList"][userIndex][
            "selected"
          ];
        return newValue;
      });
    }
  };

  const setSearchToDeptValue = (valueArr: IDepartmentAndUserListValue[]) => {
    valueArr.length <= 0
      ? setDepartmentSelectedList([])
      : setDepartmentSelectedList(valueArr);

    setDeptUserList((prev) => {
      const newValue = prev.filter((e) => !!e);
      valueArr.length <= 0
        ? newValue.forEach((department) => {
            department.departmentUserList.forEach((user) => {
              user.selected = false;
            });
          })
        : newValue.forEach((department) => {
            department.departmentUserList.forEach((user) => {
              if (valueArr.find((e) => e.id === user.userid)) {
                user.selected = true;
              } else {
                user.selected = false;
              }
            });
          });
      return newValue;
    });
  };

  useEffect(() => {
    departmentAndUserList.length > 0 &&
      !isLoading &&
      setDepartmentSelectedList((prev) => {
        const newValue = prev.filter((e) => !!e);
        departmentAndUserList.forEach((department) => {
          department.departmentUserList.forEach((user) => {
            const hasItemIndex = newValue.findIndex(
              (item) => item.id === user.userid
            );
            user.selected
              ? hasItemIndex <= -1 &&
                newValue.push({
                  id: user.userid,
                  name: user.name,
                  parentid: department.name
                })
              : hasItemIndex > -1 &&
                newValue[hasItemIndex].parentid === department.name &&
                newValue.splice(hasItemIndex, 1);
          });
        });
        return newValue;
      });
  }, [departmentAndUserList]);

  useEffect(() => {
    setDepartmentSelectedList([]);
  }, [AppId]);

  return {
    departmentSelectedList,
    handleDeptOrUserClick,
    setSearchToDeptValue
  };
};
export default useAction;
