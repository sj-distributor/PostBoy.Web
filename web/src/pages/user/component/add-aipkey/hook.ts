import useBoolean, { Actions } from "ahooks/lib/useBoolean";
import { isEmpty } from "ramda";
import { useState } from "react";
import {
  GetUserApikeys,
  PostUserApikeysAdd,
} from "../../../../api/user-management";
import { IUserApikeysResponse } from "../../../../dtos/user-management";
import { AlertColor } from "@mui/material";

const useAction = (props: {
  userAccountId: string;
  onAddApikeyCancel: () => void;
  userApikeyList: IUserApikeysResponse[][];
  setUserApikey: React.Dispatch<React.SetStateAction<IUserApikeysResponse[][]>>;
  snackbarAction: Actions;
  setSnackBarData: React.Dispatch<
    React.SetStateAction<{
      severity: AlertColor | undefined;
      text: string;
    }>
  >;
}) => {
  const {
    userAccountId,
    onAddApikeyCancel,
    userApikeyList,
    setUserApikey,
    snackbarAction,
    setSnackBarData,
  } = props;
  const [apiKey, setAipKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, isLoadingAction] = useBoolean(false);

  const addApiKeySubmit = async () => {
    isLoadingAction.setTrue();
    await PostUserApikeysAdd({
      apiKey: apiKey,
      description: description,
      userAccountId: userAccountId,
    })
      .then(() => {
        onAddApikeyCancel();
        setSnackBarData({ severity: "success", text: "添加成功！" });
        snackbarAction.setTrue();
        isLoadingAction.setFalse();

        GetUserApikeys(userAccountId)
          .then((res) => {
            if (!!res) {
              if (!isEmpty(userApikeyList)) {
                const newList = userApikeyList.map((items) => {
                  items.map((x) => x.userAccountId);
                  if (items[0].userAccountId === res[0].userAccountId) {
                    items = res;
                  }
                  return items;
                });
                setUserApikey(newList);
              }
            }
          })
          .catch(() => {
            setSnackBarData({ severity: "error", text: "获取用户APIKEY失败" });
            snackbarAction.setTrue();
          });
      })
      .catch(() => {
        setSnackBarData({ severity: "error", text: "添加失败！" });
        snackbarAction.setTrue();
      });

    setAipKey("");
    setDescription("");
  };

  return {
    apiKey,
    setAipKey,
    description,
    setDescription,
    addApiKeySubmit,
    isLoading,
  };
};

export default useAction;
