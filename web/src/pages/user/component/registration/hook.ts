import useBoolean, { Actions } from "ahooks/lib/useBoolean";
import { useState } from "react";
import { PostAuthRegister } from "../../../../api/user-management";
import { AlertColor } from "@mui/material";
import { convertRoleErrorText } from "../../../../uilts/convert-error";

const useAction = (props: {
  onRegisterCancel: () => void;
  getAllUsersData: () => void;
  snackbarAction: Actions;
  setSnackBarData: React.Dispatch<
    React.SetStateAction<{
      severity: AlertColor | undefined;
      text: string;
    }>
  >;
}) => {
  const { onRegisterCancel, snackbarAction, setSnackBarData, getAllUsersData } =
    props;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, isLoadingAction] = useBoolean(false);

  const registerSubmit = () => {
    isLoadingAction.setTrue();
    PostAuthRegister({ userName: username, password: password })
      .then(() => {
        onRegisterCancel();

        setSnackBarData({ severity: "success", text: "注册成功!" });
        snackbarAction.setTrue();
        isLoadingAction.setFalse();
        getAllUsersData();
      })
      .catch((error: Error) => {
        setSnackBarData({
          severity: "error",
          text: convertRoleErrorText(error),
        });
        snackbarAction.setTrue();
      });

    setPassword("");
    setUsername("");
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    registerSubmit,
    isLoading,
  };
};

export default useAction;
