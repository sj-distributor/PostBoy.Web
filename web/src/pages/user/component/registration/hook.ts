import { useState } from "react"
import { PostAuthRegister } from "../../../../api/user-management"
import { IUserResponse } from "../../../../dtos/user-management"

const useAction = (props: {
  onRegisterCancel: () => void
  GetAllUsers: () => Promise<IUserResponse[] | null | undefined>
  setUsersList: React.Dispatch<React.SetStateAction<IUserResponse[]>>
}) => {
  const { onRegisterCancel, GetAllUsers, setUsersList } = props
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const registerSubmit = () => {
    PostAuthRegister({ userName: username, password: password }).then(() => {
      onRegisterCancel()
      GetAllUsers().then((res) => {
        if (!!res) {
          setUsersList(res)
        }
      })
    })

    setPassword("")
    setUsername("")
  }

  return { username, setUsername, password, setPassword, registerSubmit }
}

export default useAction
