import { useState } from "react"
import {
  PostAuthRegister,
  PostUserApikeysAdd,
} from "../../../../api/user-management"

const useAction = (props: { userAccountId: string }) => {
  const { userAccountId } = props
  const [aipKey, setAipKey] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const registerSubmit = () => {
    PostUserApikeysAdd({
      aipKey: aipKey,
      description: description,
      userAccountId: userAccountId,
    })
    setAipKey("")
    setDescription("")
  }
  return { aipKey, setAipKey, description, setDescription, registerSubmit }
}

export default useAction
