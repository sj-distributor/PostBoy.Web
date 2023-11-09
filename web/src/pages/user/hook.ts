import { useBoolean } from "ahooks";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";
import { GetAllUsers, GetUserApikeys } from "../../api/user-management";
import { ModalBoxRef } from "../../dtos/modal";
import {
  IUserApikeysResponse,
  IUserListItem,
} from "../../dtos/user-management";
import { AlertColor } from "@mui/material";

const useAction = () => {
  const [usersList, setUsersList] = useState<IUserListItem[]>([]);
  const [openApikey, openApikeyAction] = useBoolean(false);
  const [userApikeyList, setUserApikey] = useState<IUserApikeysResponse[][]>(
    []
  );
  const [openApikeyUserId, setOpenApikeyUserId] = useState<string[]>([]);
  const registerRef = useRef<ModalBoxRef>(null);
  const addApikeyRef = useRef<ModalBoxRef>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userAccountId, setUserAccountId] = useState<string>("");
  const [snackbar, snackbarAction] = useBoolean(false);
  const [snackbarData, setSnackBarData] = useState<{
    severity: AlertColor | undefined;
    text: string;
  }>({
    severity: "success",
    text: "",
  });
  const [usersDto, setUserDto] = useState<{
    count: number;
    page: number;
    pageSize: number;
    keyword?: string;
  }>({
    count: 0,
    page: 1,
    pageSize: 20,
    keyword: "",
  });

  const onRegisterCancel = () => {
    registerRef.current?.close();
  };

  const onAddApikeyCancel = () => {
    addApikeyRef.current?.close();
  };

  const onListClick = async (userId: string) => {
    // 判断是否存过id,如果存储过不再重复调api
    if (!openApikeyUserId.find((x) => x === userId)) {
      const clickApiKeyUserId: string[] = openApikeyUserId;
      clickApiKeyUserId.push(userId);
      setOpenApikeyUserId(clickApiKeyUserId);
      await GetUserApikeys(userId)
        .then((res) => {
          if (!!res) {
            const apikeyList = clone(userApikeyList);
            apikeyList.push(res);
            setUserApikey(apikeyList);
          }
        })
        .catch(() => {
          setSnackBarData({ severity: "error", text: "获取用户APIKEY失败" });
          snackbarAction.setTrue();
        });
    }
    openApikeyAction.toggle();
  };

  const getAllUsersData = () => {
    setLoading(true);
    GetAllUsers({
      Page: usersDto.page,
      PageSize: usersDto.pageSize,
      UserName: usersDto.keyword,
    })
      .then((res) => {
        setUsersList(res?.users ?? []);
        setUserDto((prev) => ({ ...prev, count: res?.count ?? 0 }));
      })
      .catch(() => {
        setSnackBarData({ severity: "error", text: "获取用户数据失败" });
        snackbarAction.setTrue();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  useEffect(() => {
    if (snackbar) {
      setTimeout(() => {
        snackbarAction.setFalse();
      }, 3000);
    }
  }, [snackbar]);

  useEffect(() => {
    getAllUsersData();
  }, [usersDto.page, usersDto.pageSize]);

  return {
    usersList,
    setUsersList,
    registerRef,
    onRegisterCancel,
    addApikeyRef,
    onAddApikeyCancel,
    userAccountId,
    userApikeyList,
    setUserApikey,
    onListClick,
    setUserAccountId,
    snackbar,
    snackbarAction,
    usersDto,
    isLoading,
    setUserDto,
    getAllUsersData,
    snackbarData,
    setSnackBarData,
  };
};

export default useAction;
