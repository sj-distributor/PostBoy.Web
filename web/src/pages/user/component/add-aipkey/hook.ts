import { useState } from "react"
import { PostUserApikeysAdd } from "../../../../api/user-management"

const useAction = (props: {
  userAccountId: string
  onAddApikeyCancel: () => void
  GetAllUsers: () => void
}) => {
  const { userAccountId, onAddApikeyCancel, GetAllUsers } = props
  const [apiKey, setAipKey] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const registerSubmit = () => {
    // PostUserApikeysAdd({
    //   apiKey: apiKey,
    //   description: description,
    //   userAccountId: userAccountId,
    // }).then(() => {
    //   onAddApikeyCancel()
    //   GetAllUsers()
    // })
    onAddApikeyCancel()
    GetAllUsers()
    setAipKey("")
    setDescription("")
  }
  return { apiKey, setAipKey, description, setDescription, registerSubmit }
}

export default useAction
