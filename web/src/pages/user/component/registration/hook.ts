import useBoolean, { Actions } from "ahooks/lib/useBoolean";
import { useState } from "react";
import { GetAllUsers, PostAuthRegister } from "../../../../api/user-management";
import { IUserListItem } from "../../../../dtos/user-management";
import { AlertColor } from "@mui/material";

const useAction = (props: {
  onRegisterCancel: () => void;
  setUsersList: React.Dispatch<React.SetStateAction<IUserListItem[]>>;
  snackbarAction: Actions;
  setSnackBarData: React.Dispatch<
    React.SetStateAction<{
      severity: AlertColor | undefined;
      text: string;
    }>
  >;
}) => {
  const { onRegisterCancel, setUsersList, snackbarAction, setSnackBarData } =
    props;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, isLoadingAction] = useBoolean(false);
  const [usersDto, setUserDto] = useState<{
    count: number;
    page: number;
    pageSize: number;
  }>({
    count: 0,
    page: 1,
    pageSize: 20,
  });

  const registerSubmit = () => {
    isLoadingAction.setTrue();
    PostAuthRegister({ userName: username, password: password }).then(() => {
      onRegisterCancel();

      setSnackBarData({ severity: "success", text: "注册成功!" });
      snackbarAction.setTrue();
      isLoadingAction.setFalse();
      GetAllUsers({
        Page: usersDto.page,
        PageSize: usersDto.pageSize,
      })
        .then((res) => {
          setUsersList(res?.users ?? []);
          setUserDto((prev) => ({ ...prev, count: res?.count ?? 0 }));
        })
        .catch((error) => {
          setSnackBarData({ severity: "error", text: "获取用户数据失败" });
          snackbarAction.setTrue();
        });
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
