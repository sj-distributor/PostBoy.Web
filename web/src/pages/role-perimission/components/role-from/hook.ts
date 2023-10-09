import { useLocation, useNavigate } from "react-router-dom";
import { IDepartmentDto } from "../../../../dtos/role";

export const useAction = () => {
  const options: IDepartmentDto = {
    allDepartment: [
      {
        higherDepartment: {
          name: "WXF Office",
          id: "0-0",
          childrenDepartment: [
            { name: "Operating Support Center", id: "0-0-1" },
            { name: "Department A", id: "0-0-2" },
            { name: "Department B", id: "0-0-3" },
          ],
        },
      },
      {
        higherDepartment: {
          name: "IS Office",
          id: "0-1",
          childrenDepartment: [
            { name: "Department C", id: "0-1-1" },
            { name: "Department D", id: "0-1-2" },
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

  return {
    options,
    inputStyles,
    selectStyles,
    formStyles,
    location,
    navigate,
  };
};
