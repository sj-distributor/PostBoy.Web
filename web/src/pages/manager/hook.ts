import { useEffect, useRef, useState } from "react"
import { GetCorpAppList, GetCorpsList } from "../../api/enterprise"
import { ICorpAppData, ICorpData } from "../../dtos/enterprise"
import { ModalBoxRef } from "../../dtos/modal"

const useAction = () => {
  const addCorpRef = useRef<ModalBoxRef>(null)
  const addAppRef = useRef<ModalBoxRef>(null)
  // 获取的企业数组
  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  // 获取的App数组
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[][]>([])
  const [corpAppLoadedList, setCorpAppLoadedList] = useState<string[]>([])

  const onAddCorpCancel = () => addCorpRef.current?.close()

  const onAddAppCancel = () => addAppRef.current?.close()

  const onListClick = async (userId: string) => {
    if (!corpAppLoadedList.some((x) => x === userId)) {
      setCorpAppLoadedList((prev) => [...prev, userId])
      const corpAppResult: ICorpAppData[] | null | undefined =
        await GetCorpAppList({
          CorpId: userId,
        })
      !!corpAppResult &&
        setCorpAppList((prev) => {
          return [...prev, corpAppResult.filter((x) => x.display)]
        })
    }
  }
  // 初始化企业数组
  useEffect(() => {
    GetCorpsList().then((data: ICorpData[] | null | undefined) => {
      if (data) {
        setCorpsList(data)
      }
    })
  }, [])

  return {
    corpsList,
    corpAppList,
    corpAppLoadedList,
    addCorpRef,
    onAddCorpCancel,
    addAppRef,
    onAddAppCancel,
    onListClick,
  }
}

export default useAction
