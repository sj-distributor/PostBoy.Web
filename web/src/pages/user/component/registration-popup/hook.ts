import { useState } from "react"
import { PostAuthRegister } from "../../../../api/user-management"

const useAction = () => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const registerSubmit = () => {
    PostAuthRegister({ userName: username, password: password })
    setPassword("")
    setUsername("")
  }
  return { username, setUsername, password, setPassword, registerSubmit }
}

export default useAction
