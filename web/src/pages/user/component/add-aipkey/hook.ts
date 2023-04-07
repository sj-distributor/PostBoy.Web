import useBoolean, { Actions } from "ahooks/lib/useBoolean"
import { isEmpty } from "ramda"
import { useState } from "react"
import {
  GetUserApikeys,
  PostUserApikeysAdd,
} from "../../../../api/user-management"
import { IUserApikeysResponse } from "../../../../dtos/user-management"

const useAction = (props: {
  userAccountId: string
  onAddApikeyCancel: () => void
  userApikeyList: IUserApikeysResponse[][]
  setUserApikey: React.Dispatch<React.SetStateAction<IUserApikeysResponse[][]>>
  successAction: Actions
}) => {
  const {
    userAccountId,
    onAddApikeyCancel,
    userApikeyList,
    setUserApikey,
    successAction,
  } = props
  const [apiKey, setAipKey] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isLoading, isLoadingAction] = useBoolean(false)

  const addApiKeySubmit = async () => {
    isLoadingAction.setTrue()
    await PostUserApikeysAdd({
      apiKey: apiKey,
      description: description,
      userAccountId: userAccountId,
    }).then(() => {
      onAddApikeyCancel()
      successAction.setTrue()
      isLoadingAction.setFalse()

      GetUserApikeys(userAccountId).then((res) => {
        if (!!res) {
          if (!isEmpty(userApikeyList)) {
            const newList = userApikeyList.map((items) => {
              items.map((x) => x.userAccountId)
              if (items[0].userAccountId === res[0].userAccountId) {
                items = res
              }
              return items
            })
            setUserApikey(newList)
          }
        }
      })
    })

    setAipKey("")
    setDescription("")
  }

  return {
    apiKey,
    setAipKey,
    description,
    setDescription,
    addApiKeySubmit,
    isLoading,
  }
}

export default useAction
