import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

export const useAction = () => {
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

  const [selectedValue, setSelectedValue] = useState<number>(0);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setSelectedValue(event.target.value as number);
  };

  return { inputStyles, selectStyles, selectedValue, handleChange };
};
