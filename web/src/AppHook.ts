import { useEffect, useState } from "react"
import { InitialAppSetting } from "./appsettings"
import useActionEditor from "./uilts/wangEditor"

const useAction = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  useActionEditor()

  useEffect(() => {
    InitialAppSetting().then(() => setIsLoaded(true))
  }, [])

  return {
    isLoaded
  }
}

export default useAction
