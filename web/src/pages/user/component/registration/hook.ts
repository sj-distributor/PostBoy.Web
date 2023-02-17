import { useState } from "react"
import { PostAuthRegister } from "../../../../api/user-management"

const useAction = (props: {
  onRegisterCancel: () => void
  GetAllUsers: () => void
}) => {
  const { onRegisterCancel, GetAllUsers } = props
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const registerSubmit = () => {
    // PostAuthRegister({ userName: username, password: password }).then(() => {
    //   onRegisterCancel()
    //   GetAllUsers()
    // })
    onRegisterCancel()
    GetAllUsers()
    setPassword("")
    setUsername("")
  }
  return { username, setUsername, password, setPassword, registerSubmit }
}

export default useAction
