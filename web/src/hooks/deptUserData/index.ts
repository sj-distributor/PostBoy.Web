import { useMemo, useState } from "react";
import {
  DepartmentAndUserType,
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  IDeptAndUserList,
  IDeptUserDataHookProp,
} from "../../dtos/enterprise";

const useDeptUserData = ({ appId, schemaType }: IDeptUserDataHookProp) => {
  // 部门和用户数组
  const [departmentAndUserList, setDepartmentAndUserList] = useState<
    IDepartmentKeyControl[]
  >([]);
  //
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentKeyControl[]
  >([]);

  const departmentKeyValue = useMemo(() => {
    const result = departmentAndUserList.find((e) => e.key === appId);

    return result as IDepartmentKeyControl;
  }, [departmentAndUserList, appId]);

  const searchKeyValue = useMemo(() => {
    const result = flattenDepartmentList.find((e) => e.key === appId);
    return result?.data as IDepartmentAndUserListValue[];
  }, [flattenDepartmentList, appId]);

  const recursiveSearchDeptOrUser = (
    dataList: IDepartmentAndUserListValue[],
    callback: (e: IDepartmentAndUserListValue) => void
  ) => {
    for (const key in dataList) {
      callback(dataList[key]);
      dataList[key].children.length > 0 &&
        recursiveSearchDeptOrUser(dataList[key].children, callback);
    }
    return dataList;
  };

  const deduplicationArray = (
    list: IDepartmentAndUserListValue[],
    callback?: (
      x: IDepartmentAndUserListValue,
      y: IDepartmentAndUserListValue
    ) => boolean
  ) => {
    if (!Array.isArray(list)) return [];
    return list.filter((item, index) => {
      return (
        index ===
        list.findIndex((x) => (callback ? callback(x, item) : x.id === item.id))
      );
    });
  };

  const recursiveTransformList = (
    sourceList: IDeptAndUserList[],
    resultList: IDepartmentAndUserListValue[],
    flattenList: IDepartmentAndUserListValue[],
    idRoute: number[]
  ): IDepartmentAndUserListValue[] => {
    sourceList.forEach((source) => {
      const department: IDepartmentAndUserListValue = {
        id: source.department.id,
        name: source.department.name.toLocaleUpperCase(),
        type: source.childrens?.length
          ? DepartmentAndUserType.Department
          : DepartmentAndUserType.User,
        parentid: source.department.parentid,
        selected: false,
        isCollapsed: false,
        idRoute: [...idRoute, source.department.id],
        children: [],
        department_leader: source.department.department_leader,
      };

      let users;
      if (schemaType) {
        users = source.childrens?.map((item) => ({
          id: item.department.id,
          name: item.department.name.toLocaleUpperCase(),
          type: DepartmentAndUserType.User,
          parentid: item.department.parentid,
          selected: false,
          isCollapsed: false,
          idRoute: [...idRoute, source.department.id],
          children: [],
          department_leader: source.department.department_leader as
            | [string]
            | [],
        }));
        const uniqueIds = new Set(
          source.childrens?.map((obj) => obj.department.id)
        );

        users = users.filter((obj) => !uniqueIds.has(obj.id));
      } else {
        users = source.users.map((user) => ({
          id: user.userid,
          name: user.userid,
          type: DepartmentAndUserType.User,
          parentid: user.department,
          selected: false,
          isCollapsed: false,
          idRoute: [...idRoute, source.department.id],
          children: [],
          department_leader: source.department.department_leader as
            | [string]
            | [],
        }));
      }
      department.children.push(...users);

      flattenList.push({ ...department }, ...users);
      resultList.unshift(department);
      source.childrens?.length > 0 &&
        recursiveTransformList(
          source.childrens,
          department.children,
          flattenList,
          [...idRoute, source.department.id]
        );
    });

    return resultList;
  };

  const findActiveData = (appid: string, source: IDepartmentKeyControl[]) => {
    return source.find((item) => item.key === appid);
  };

  const loadDeptUsersFromWebWorker = (data: {
    AppId: string;
    workWeChatUnits: IDeptAndUserList[];
  }) => {
    const flattenList: IDepartmentAndUserListValue[] = [];
    const dataList = recursiveTransformList(
      data.workWeChatUnits,
      [],
      flattenList,
      []
    );

    return new Promise((resolve) => {
      setDepartmentAndUserList((prev) => {
        const newData = prev.slice();
        const foldData = findActiveData(data.AppId, newData);

        foldData && (foldData.data = dataList);

        return !!foldData
          ? newData
          : [...newData, { key: data.AppId, data: dataList }];
      });

      setFlattenDepartmentList((prev) => {
        const newData = prev.slice();
        const flattenData = findActiveData(data.AppId, newData);
        flattenData && (flattenData.data = flattenList);

        return !!flattenData
          ? newData
          : [...newData, { key: data.AppId, data: flattenList }];
      });
      resolve(true);
    });
  };

  return {
    departmentAndUserList,
    flattenDepartmentList,
    departmentKeyValue,
    searchKeyValue,
    setDepartmentAndUserList,
    deduplicationArray,
    setFlattenDepartmentList,
    recursiveSearchDeptOrUser,
    loadDeptUsersFromWebWorker,
  };
};
export default useDeptUserData;
