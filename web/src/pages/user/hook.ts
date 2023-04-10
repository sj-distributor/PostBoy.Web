import { useBoolean } from "ahooks"
import { clone } from "ramda"
import { useEffect, useRef, useState } from "react"
import { GetAllUsers, GetUserApikeys } from "../../api/user-management"
import { ModalBoxRef } from "../../dtos/modal"
import { IUserApikeysResponse, IUserResponse } from "../../dtos/user-management"

const useAction = () => {
  const [usersList, setUsersList] = useState<IUserResponse[]>([])
  const [openApikey, openApikeyAction] = useBoolean(false)
  const [userApikeyList, setUserApikey] = useState<IUserApikeysResponse[][]>([])
  const [openApikeyUserId, setOpenApikeyUserId] = useState<string[]>([])
  const registerRef = useRef<ModalBoxRef>(null)
  const addApikeyRef = useRef<ModalBoxRef>(null)
  const [userAccountId, setUserAccountId] = useState<string>("")
  const [success, successAction] = useBoolean(false)

  const onRegisterCancel = () => {
    registerRef.current?.close()
  }

  const onAddApikeyCancel = () => {
    addApikeyRef.current?.close()
  }

  const onListClick = async (userId: string) => {
    // 判断是否存过id,如果存储过不再重复调api
    if (!openApikeyUserId.find((x) => x === userId)) {
      const clickApiKeyUserId: string[] = openApikeyUserId
      clickApiKeyUserId.push(userId)
      setOpenApikeyUserId(clickApiKeyUserId)
      await GetUserApikeys(userId).then((res) => {
        if (!!res) {
          const apikeyList = clone(userApikeyList)
          apikeyList.push(res)
          setUserApikey(apikeyList)
        }
      })
    }
    openApikeyAction.toggle()
  }

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (!!res) {
        setUsersList(res)
      }
    })
  }, [])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        successAction.setFalse()
      }, 3000)
    }
  }, [success])

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
    success,
    successAction,
  }
}

export default useAction
