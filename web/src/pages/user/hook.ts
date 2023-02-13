import { useBoolean } from "ahooks"

const useAction = () => {
  const [isShowRegister, isShowRegisterAction] = useBoolean(false)

  const onRegister = () => {
    isShowRegisterAction.toggle()
  }

  return { onRegister, isShowRegister }
}

export default useAction
