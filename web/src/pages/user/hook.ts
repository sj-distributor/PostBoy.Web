import { useBoolean } from "ahooks"
import { PostAuthRegister } from "../../api/user-management"

const useAction = () => {
  const [isShowRegister, isShowRegisterAction] = useBoolean(false)

  const onRegister = () => {
    isShowRegisterAction.setTrue()
  }

  const registerSubmit = (userName: string, password: string) => {
    PostAuthRegister({ userName: userName, password: password })
  }

  return { onRegister, isShowRegister }
}

export default useAction
