import { useLocation, useNavigate } from "react-router-dom";
import { IDepartmentDto } from "../../../../dtos/role";
import { useState } from "react";
import { clone } from "ramda";
import { useUpdateEffect } from "ahooks";

export type DepartmentDto = {
  [key: string]: string | boolean | undefined;
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
};

export type AllDepartmentData = {
  pullCrowdData: DepartmentDto[];
  notificationData: DepartmentDto[];
};

export const useAction = () => {
  const options: IDepartmentDto = {
    allDepartment: [
      {
        higherDepartment: {
          name: "WXF Office",
          id: "0",
          childrenDepartment: [
            { name: "Operating Support Center", id: "0-1" },
            { name: "Department A", id: "0-2" },
            { name: "Department B", id: "0-3" },
          ],
        },
      },
      {
        higherDepartment: {
          name: "IS Office",
          id: "1",
          childrenDepartment: [
            { name: "Department C", id: "1-1" },
            { name: "Department D", id: "1-2" },
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

  const [autocompleteShowLabel, setAutocompleteShowLabel] =
    useState<AllDepartmentData>({ pullCrowdData: [], notificationData: [] });

  const cloneCheckboxData = clone(checkboxData);

  const haveIsExpand = (option: DepartmentDto) => {
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
    const renderShowLabel: DepartmentDto[] = [];

    cloneCheckboxData[dataSource].forEach((item) => {
      item.isSelected && renderShowLabel.push(item);
    });

    setAutocompleteShowLabel((preValue) => {
      return { ...preValue, [dataSource]: renderShowLabel };
    });
  };

  const updateCloneCheckboxData = (
    dataSource: keyof AllDepartmentData,
    index: number,
    key: keyof DepartmentDto,
    value?: boolean,
    isRebellion?: boolean,
    parentIndex?: number
  ) => {
    if (value !== undefined) cloneCheckboxData[dataSource][index][key] = value;

    if (isRebellion !== undefined && isRebellion)
      cloneCheckboxData[dataSource][index][key] =
        !cloneCheckboxData[dataSource][index][key];

    if (parentIndex !== undefined)
      cloneCheckboxData[dataSource][index][key] =
        cloneCheckboxData[dataSource][parentIndex][key];
  };

  const expandTreeCheckbox = (
    dataSource: keyof AllDepartmentData,
    index: number,
    option: DepartmentDto
  ) => {
    updateCloneCheckboxData(dataSource, index, "isExpand", undefined, true);

    cloneCheckboxData[dataSource].forEach(
      (item, index) =>
        item.parentId === option.id &&
        updateCloneCheckboxData(dataSource, index, "isHide", undefined, true)
    );

    setCheckboxData((preValue) => {
      return { ...preValue, [dataSource]: cloneCheckboxData[dataSource] };
    });
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

    if (getChildrenUnifiedState(dataSource, parentIndex).isAllTrue) {
      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", false);
      updateCloneCheckboxData(dataSource, parentIndex, "isSelected", true);
    }

    if (getChildrenUnifiedState(dataSource, parentIndex).isAllFalse) {
      updateCloneCheckboxData(dataSource, parentIndex, "indeterminate", false);
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
    let parentIndex: number | null = null;
    let removeOptionIndex: number | null = null;

    removeOptionIndex = cloneCheckboxData[dataSource].findIndex(
      (item) => item.id === option.id
    );

    if (haveIsExpand(option)) {
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
      parentIndex = cloneCheckboxData[dataSource].findIndex(
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

  return {
    flatOptions,
    inputStyles,
    selectStyles,
    formStyles,
    location,
    checkboxData,
    autocompleteShowLabel,
    navigate,
    setCheckboxData,
    haveIsExpand,
    expandTreeCheckbox,
    updateParentCheckbox,
    updateChildrenCheckbox,
    removeOption,
  };
};
