import useBoolean, { Actions } from "ahooks/lib/useBoolean"
import { useState } from "react"
import { GetAllUsers, PostAuthRegister } from "../../../../api/user-management"
import { IUserResponse } from "../../../../dtos/user-management"

const useAction = (props: {
  onRegisterCancel: () => void
  setUsersList: React.Dispatch<React.SetStateAction<IUserResponse[]>>
  successAction: Actions
}) => {
  const { onRegisterCancel, setUsersList, successAction } = props
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, isLoadingAction] = useBoolean(false)

  const registerSubmit = () => {
    isLoadingAction.setTrue()
    PostAuthRegister({ userName: username, password: password }).then(() => {
      onRegisterCancel()
      successAction.setTrue()
      isLoadingAction.setFalse()
      GetAllUsers().then((res) => {
        if (!!res) {
          setUsersList(res)
        }
      })
    })

    setPassword("")
    setUsername("")
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    registerSubmit,
    isLoading,
  }
}

export default useAction
