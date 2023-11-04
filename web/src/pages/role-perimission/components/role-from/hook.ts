import { useLocation, useNavigate } from "react-router-dom";
import { IDepartmentDto } from "../../../../dtos/role";
import { useEffect, useState } from "react";
import { clone } from "ramda";
import { useUpdateEffect } from "ahooks";
import { AllDepartmentData, DepartmentDto } from "./props";
import jsonData from "./departments.json";

export interface UserData {
  id: string;
  userName: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  parentId: string;
}

export interface StaffDepartmentHierarchyList {
  childrens: StaffDepartmentHierarchyList[];
  department: DepartmentData;
  staffs: UserData[] | null;
}

export interface DepartmentTreeList {
  departments: StaffDepartmentHierarchyList[];
  companies: StaffDepartmentHierarchyList;
}

export const useAction = () => {
  const options: IDepartmentDto = {
    allDepartment: [
      {
        higherDepartment: {
          name: "WXF Office",
          id: "888",
          childrenDepartment: [
            { name: "Operating Support Center", id: "81" },
            { name: "Department A", id: "82" },
            { name: "Department B", id: "83" },
          ],
        },
      },
      {
        higherDepartment: {
          name: "IS Office",
          id: "999",
          childrenDepartment: [
            { name: "Department C", id: "91" },
            { name: "Department D", id: "92" },
          ],
        },
      },
    ],
  };

  const inputStyles = {
    border: 1,
    flex: 1,
    marginLeft: "0.3rem",
    borderColor: "#c4c4c4",
    paddingX: 1.4,
    paddingY: 0.65,
    borderRadius: 1,
    boxShadow: 1,
  };

  const selectStyles = { marginLeft: "0.3rem", flex: 1 };

  const formStyles = { flexBasis: "25%" };

  const location = useLocation();

  const navigate = useNavigate();

  const flatOptions = options.allDepartment.reduce((accumulator, item) => {
    const higherDepartment: DepartmentDto = {
      name: item.higherDepartment.name,
      id: item.higherDepartment.id,
      isSelected: false,
      isHide: false,
    };

    accumulator.push(higherDepartment);

    if (
      item.higherDepartment.childrenDepartment &&
      item.higherDepartment.childrenDepartment.length > 0
    ) {
      higherDepartment.isExpand = false;
      higherDepartment.indeterminate = false;

      accumulator.push(
        ...item.higherDepartment.childrenDepartment.map((childrenItem) => ({
          name: childrenItem.name,
          id: childrenItem.id,
          isSelected: false,
          parentId: item.higherDepartment.id,
          isHide: true,
        }))
      );
    }

    return accumulator;
  }, [] as DepartmentDto[]);

  const [checkboxData, setCheckboxData] = useState<AllDepartmentData>({
    pullCrowdData: flatOptions,
    notificationData: flatOptions,
  });

  const [showLabel, setShowLabel] = useState<AllDepartmentData>({
    pullCrowdData: [],
    notificationData: [],
  });

  const cloneCheckboxData = clone(checkboxData);

  const isHaveExpand = (option: DepartmentDto) => {
    return Object.hasOwn(option, "isExpand");
  };

  const getChildrenUnifiedState = (
    dataSource: keyof AllDepartmentData,
    parentIndex: number
  ) => {
    const childrenDepartment = cloneCheckboxData[dataSource].filter(
      (item) => item.parentId === cloneCheckboxData[dataSource][parentIndex].id
    );

    let isAllTrue = true;
    let isAllFalse = true;

    for (const child of childrenDepartment) {
      if (child.isSelected) isAllFalse = false;
      else isAllTrue = false;
    }

    return { isAllTrue, isAllFalse };
  };

  const renderShowLabel = (dataSource: keyof AllDepartmentData) => {
    const result: DepartmentDto[] = [];

    cloneCheckboxData[dataSource].forEach((item) => {
      item.isSelected && result.push(item);
    });

    setShowLabel((preValue) => {
      return { ...preValue, [dataSource]: result };
    });
  };

  const updateCloneCheckboxData = (
    dataSource: keyof AllDepartmentData,
    index: number,
    key: keyof DepartmentDto,
    fixedValue?: boolean,
    isRebellionSelfValue?: boolean,
    parentIndex?: number
  ) => {
    if (fixedValue !== undefined) {
      cloneCheckboxData[dataSource][index][key] = fixedValue;
    } else if (isRebellionSelfValue !== undefined && isRebellionSelfValue) {
      cloneCheckboxData[dataSource][index][key] =
        !cloneCheckboxData[dataSource][index][key];
    } else if (parentIndex !== undefined) {
      cloneCheckboxData[dataSource][index][key] =
        cloneCheckboxData[dataSource][parentIndex][key];
    }
  };

  const updateCloneCheckboxDatas = (
    dataSource: keyof AllDepartmentData,
    id: string,
    key: keyof DepartmentDto
  ) => {
    console.log(cloneCheckboxData);
    const data = cloneCheckboxData[dataSource].map((item) => {
      if (item.idRoute?.find((item) => item.includes(id))) {
        console.log(item);
        return {
          ...item,
          isExpand: !item.isExpand,
        };
      } else {
        return item;
      }
    });

    const setChildrenData = (data: any) => {
      console.log(data);
    };

    data.forEach((item) => {
      if (item.parentId === id) {
        item.isHide = !item.isHide;
        item.isExpand = item.isHide;
      }
    });

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: data };
    });
  };

  const expandTreeCheckbox = (
    dataSource: keyof AllDepartmentData,
    index: number,
    option: DepartmentDto
  ) => {
    console.log(dataSource, index, option);
    updateCloneCheckboxDatas(dataSource, option.id, "isExpand");
    // updateCloneCheckboxData(dataSource, index, "isExpand", undefined, true);

    // cloneCheckboxData[dataSource].forEach((item, index) => {
    //   item.parentId === option.id &&
    //     updateCloneCheckboxData(dataSource, index, "isHide", undefined, true);
    // });

    // setCheckboxData((preValue) => {
    //   return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    // });
  };

  const updateParentCheckbox = (
    dataSource: keyof AllDepartmentData,
    parameterIndex: number,
    option: DepartmentDto
  ) => {
    updateCloneCheckboxData(dataSource, parameterIndex, "indeterminate", false);

    updateCloneCheckboxData(
      dataSource,
      parameterIndex,
      "isSelected",
      undefined,
      true
    );

    cloneCheckboxData[dataSource].forEach((item, index) => {
      if (item.parentId === option.id) {
        updateCloneCheckboxData(
          dataSource,
          index,
          "isSelected",
          undefined,
          undefined,
          parameterIndex
        );
      }
    });

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  const updateChildrenCheckbox = (
    dataSource: keyof AllDepartmentData,
    index: number
  ) => {
    const parentIndex = cloneCheckboxData[dataSource].findIndex(
      (x) => cloneCheckboxData[dataSource][index].parentId === x.id
    );

    updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", true);

    updateCloneCheckboxData(dataSource, index, "isSelected", undefined, true);

    const { isAllTrue, isAllFalse } = getChildrenUnifiedState(
      dataSource,
      parentIndex
    );

    const changeIndeterminateToFalse = () => {
      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", false);
    };

    if (isAllTrue) {
      changeIndeterminateToFalse();
      updateCloneCheckboxData(dataSource, parentIndex, "isSelected", true);
    }

    if (isAllFalse) {
      changeIndeterminateToFalse();
      updateCloneCheckboxData(dataSource, parentIndex, "isSelected", false);
    }

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  const removeOption = (
    dataSource: keyof AllDepartmentData,
    option: DepartmentDto
  ) => {
    const removeOptionIndex = cloneCheckboxData[dataSource].findIndex(
      (item) => item.id === option.id
    );

    if (isHaveExpand(option)) {
      cloneCheckboxData[dataSource].forEach((item, index) => {
        item.parentId === option.id &&
          updateCloneCheckboxData(dataSource, index, "isSelected", false);
      });

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "isSelected",
        false
      );

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "indeterminate",
        false
      );
    } else {
      const parentIndex = cloneCheckboxData[dataSource].findIndex(
        (x) => x.id === option.parentId
      );

      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", true);

      updateCloneCheckboxData(
        dataSource,
        removeOptionIndex,
        "isSelected",
        false
      );

      if (getChildrenUnifiedState(dataSource, parentIndex).isAllFalse) {
        updateCloneCheckboxData(
          dataSource,
          parentIndex,
          "indeterminate",
          false
        );

        updateCloneCheckboxData(dataSource, parentIndex, "isSelected", false);
      }
    }

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
  };

  useUpdateEffect(() => {
    renderShowLabel("pullCrowdData");
  }, [checkboxData.pullCrowdData]);

  useUpdateEffect(() => {
    renderShowLabel("notificationData");
  }, [checkboxData.notificationData]);

  useEffect(() => {
    const data: DepartmentTreeList[] = jsonData.data.staffDepartmentHierarchy;
    console.log(data);
    const flatData: any[] = [];
    data.map((fItem) => {
      flatData.push({
        name: fItem.companies.department.name,
        id: fItem.companies.department.id,
        isSelected: false,
        isHide: false,
        childrens: flatOptions,
        idRoute: [fItem.companies.department.id],
      });

      const getChildrenData = (
        data: StaffDepartmentHierarchyList[],
        idRoute: string[]
      ) => {
        data.map((item) => {
          flatData.push({
            name: item.department.name,
            id: item.department.id,
            isSelected: false,
            isHide: true,
            childrens: flatOptions,
            idRoute: [...idRoute, item.department.id],
            parentId: item.department.parentId,
          });
          if (item.childrens.length) {
            getChildrenData(item.childrens, [...idRoute, item.department.id]);
          }
        });
      };
      getChildrenData(fItem.departments, [fItem.companies.department.id]);
    }, [] as DepartmentDto[]);

    console.log(flatData);
    setCheckboxData((prev) => ({
      pullCrowdData: flatData,
      notificationData: flatData,
    }));
  }, []);

  return {
    flatOptions,
    inputStyles,
    selectStyles,
    formStyles,
    location,
    checkboxData,
    showLabel,
    navigate,
    setCheckboxData,
    isHaveExpand,
    expandTreeCheckbox,
    updateParentCheckbox,
    updateChildrenCheckbox,
    removeOption,
  };
};
