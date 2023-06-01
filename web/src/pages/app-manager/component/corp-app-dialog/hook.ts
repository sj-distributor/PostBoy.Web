import { useEffect, useState } from "react"
import {
  AddApplication,
  AddCorp,
  ModifyApplication,
  ModifyCorp,
} from "../../../../api/app-manager"
import {
  AddOrModify,
  RowDataType,
  IManagerAppKeyData,
  IManagerCorpKeyData,
  IRequestCorpAdd,
  IRequestAppAdd,
} from "../../../../dtos/app-manager"

const useAction = (props: {
  rowData: IManagerCorpKeyData | IManagerAppKeyData
  rowDataType: AddOrModify
  tipsText: string
  onAddApikeyCancel: () => void
  reload: (corpUpdateId?: string) => void
  setTipsText: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { rowData, rowDataType, onAddApikeyCancel, reload, setTipsText } = props
  const [name, setName] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [corpId, setCorpId] = useState<string>("")
  const [appId, setAppId] = useState<string>("")
  const [agentId, setAgentId] = useState<number>(0)
  const [order, setOrder] = useState<number>(0)
  const [display, setDisplay] = useState<boolean>(true)

  const handleSubmit = async () => {
    if (rowData.key === RowDataType.Corporation) {
      const requestCorpData: IRequestCorpAdd = {
        corpName: name,
        corpId,
        contactSecret: secret,
        order,
      }
      rowDataType === AddOrModify.Add
        ? AddCorp([requestCorpData])
            .then(success)
            .catch((err) => {
              showErrorTip((err as Error).message)
            })
        : ModifyCorp([{ ...requestCorpData, id: rowData.data.id }])
            .then(success)
            .catch((err) => {
              showErrorTip((err as Error).message)
            })
    } else {
      const requestAppData: IRequestAppAdd = {
        appId,
        name,
        secret,
        display,
        agentId: Number(agentId),
        workWeChatCorpId: rowData.data.workWeChatCorpId,
      }
      rowDataType === AddOrModify.Add
        ? AddApplication([requestAppData])
            .then(success)
            .catch((err) => {
              showErrorTip((err as Error).message)
            })
        : ModifyApplication([{ ...requestAppData, id: rowData.data.id }])
            .then(success)
            .catch((err) => {
              showErrorTip((err as Error).message)
            })
    }
  }

  const showErrorTip = (text: string) => {
    setTipsText(text)
  }

  const success = () => {
    setTipsText(`${rowDataType} success`)
    onAddApikeyCancel()
    clearData()
    rowData.key === RowDataType.Corporation
      ? reload()
      : reload(rowData.data.workWeChatCorpId)
  }

  const clearData = () => {
    setName("")
    setSecret("")
  }

  const validate = () => {
    if (rowData.key === RowDataType.Corporation) {
      return [name, secret, corpId].every((x) => !!x)
    } else {
      return [name, secret, appId, agentId].every((x) => !!x)
    }
  }

  useEffect(() => {
    if (rowDataType === AddOrModify.Modify) {
      // Init data
      if (rowData.key === RowDataType.Corporation) {
        setName(rowData.data.corpName)
        setCorpId(rowData.data.corpId)
        setSecret(rowData.data.contactSecret)
        setOrder(rowData.data.order)
      } else {
        setName(rowData.data.name)
        setAppId(rowData.data.appId)
        setAgentId(rowData.data.agentId)
        setSecret(rowData.data.secret)
        setDisplay(rowData.data.display)
      }
    } else {
      clearData()
    }
  }, [])

  return {
    name,
    secret,
    corpId,
    appId,
    agentId,
    setAgentId,
    setAppId,
    setCorpId,
    setSecret,
    setName,
    handleSubmit,
    validate,
    order,
    setOrder,
    display,
    setDisplay,
  }
}

export default useAction
