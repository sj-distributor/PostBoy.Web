import { SelectChangeEvent } from "@mui/material/Select";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IRoleOptions } from "../../../../dtos/role";

export const useAction = () => {
  const options: IRoleOptions[] = [
    { value: 10, label: "选项1" },
    { value: 20, label: "选项2" },
    { value: 30, label: "选项3" },
  ];
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

  return {
    options,
    inputStyles,
    selectStyles,
    formStyles,

    location,
    navigate,
  };
};
