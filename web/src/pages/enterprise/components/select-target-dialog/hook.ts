import { useEffect, useState } from "react";
import { ITargetDialogValue } from "../../../../dtos/enterprise";

const useAction = (setDialogValue: ITargetDialogValue) => {
  const [memberValue, setMemberValue] = useState<string>(
    setDialogValue.memberValue
  );
  const [departmentValue, setDepartmentValue] = useState<string>(
    setDialogValue.departmentValue
  );
  const [tagsValue, setTagsValue] = useState<string>(setDialogValue.tagsValue);

  return {
    memberValue,
    departmentValue,
    tagsValue,
    setMemberValue,
    setDepartmentValue,
    setTagsValue
  };
};
export default useAction;
