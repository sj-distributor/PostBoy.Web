import { useLocation, useNavigate } from "react-router-dom";
import { IDepartmentDto } from "../../../../dtos/role";
import { useEffect, useState } from "react";
import { clone } from "ramda";

export type DepartmentDto = {
  [key: string]: any;
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
  parentId?: string;
  isHide?: boolean;
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

  const [checkboxData, setCheckboxData] =
    useState<DepartmentDto[]>(flatOptions);

  const [autocompleteShowLabel, setAutocompleteShowLabel] = useState<
    DepartmentDto[]
  >([]);

  const cloneCheckboxData = clone(checkboxData);

  const getChildrenUnifiedState = (parentIndex: number) => {
    const childrenDepartment = cloneCheckboxData.filter(
      (item) => item.parentId === cloneCheckboxData[parentIndex].id
    );

    const isAllTrue = childrenDepartment?.every((x) => x?.isSelected === true);

    const isAllFalse = childrenDepartment?.every((x) => x.isSelected === false);

    return { isAllTrue, isAllFalse };
  };

  const renderShowLabel = () => {
    const renderShowLabel: DepartmentDto[] = [];

    cloneCheckboxData.forEach((item) => {
      item.isSelected && renderShowLabel.push(item);
    });

    setAutocompleteShowLabel(renderShowLabel);
  };

  const updateData = (
    index: number,
    key: keyof DepartmentDto,
    value?: boolean,
    isRebellion?: boolean,
    parentIndex?: number
  ) => {
    if (value !== undefined) cloneCheckboxData[index][key] = value;

    if (isRebellion !== undefined && isRebellion)
      cloneCheckboxData[index][key] = !cloneCheckboxData[index][key];

    if (parentIndex !== undefined)
      cloneCheckboxData[index][key] = cloneCheckboxData[parentIndex][key];
  };

  const expandTreeCheckbox = (index: number, option: DepartmentDto) => {
    updateData(index, "isExpand", undefined, true);

    cloneCheckboxData.forEach(
      (item, index) =>
        item.parentId === option.id &&
        updateData(index, "isHide", undefined, true)
    );

    setCheckboxData(cloneCheckboxData);
  };

  const updateParentCheckbox = (
    parameterIndex: number,
    option: DepartmentDto
  ) => {
    updateData(parameterIndex, "indeterminate", false);

    updateData(parameterIndex, "isSelected", undefined, true);

    cloneCheckboxData.forEach((item, index) => {
      if (item.parentId === option.id) {
        updateData(index, "isSelected", undefined, undefined, parameterIndex);
      }
    });

    setCheckboxData(cloneCheckboxData);
  };

  const updateChildrenCheckbox = (index: number) => {
    const parentIndex = cloneCheckboxData.findIndex(
      (x) => cloneCheckboxData[index].parentId === x.id
    );

    updateData(parentIndex, "indeterminate", true);

    updateData(index, "isSelected", undefined, true);

    if (getChildrenUnifiedState(parentIndex).isAllTrue) {
      updateData(parentIndex, "indeterminate", false);

      updateData(parentIndex, "isSelected", true);
    } else if (getChildrenUnifiedState(parentIndex).isAllFalse) {
      updateData(parentIndex, "indeterminate", false);

      updateData(parentIndex, "isSelected", false);
    }

    setCheckboxData(cloneCheckboxData);
  };

  const removeOption = (option: DepartmentDto) => {
    let parentIndex: number | null = null;
    let removeOptionIndex: number | null = null;

    removeOptionIndex = cloneCheckboxData.findIndex(
      (item) => item.id === option.id
    );

    if (Object.hasOwn(option, "isExpand")) {
      cloneCheckboxData.forEach((item, index) => {
        item.parentId === option.id && updateData(index, "isSelected", false);
      });

      updateData(removeOptionIndex, "isSelected", false);
      updateData(removeOptionIndex, "indeterminate", false);
    } else {
      parentIndex = cloneCheckboxData.findIndex(
        (x) => x.id === option.parentId
      );

      updateData(parentIndex, "indeterminate", true);
      updateData(removeOptionIndex, "isSelected", false);

      if (getChildrenUnifiedState(parentIndex).isAllFalse) {
        updateData(parentIndex, "indeterminate", false);
        updateData(parentIndex, "isSelected", false);
      }
    }

    setCheckboxData(cloneCheckboxData);
  };

  useEffect(() => {
    renderShowLabel();
  }, [checkboxData]);

  return {
    flatOptions,
    inputStyles,
    selectStyles,
    formStyles,
    location,
    checkboxData,
    cloneCheckboxData,
    autocompleteShowLabel,
    navigate,
    getChildrenUnifiedState,
    setCheckboxData,
    updateData,
    expandTreeCheckbox,
    updateParentCheckbox,
    updateChildrenCheckbox,
    removeOption,
  };
};
