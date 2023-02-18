import { useEffect, useState } from "react"
import { AuthAccont } from "../../api/login"
import { useLocation, useNavigate } from "react-router-dom"
import useAuth from "../../auth"

const useAction = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false)
  const { authStatus, signIn } = useAuth()

  const handleLoginButton = async () => {
    const data = await AuthAccont({ userName: username, password })
    !!data ? signIn(data, navigateTo) : setOpenSnackBar(true)
  }

  const navigateTo = () => {
    if (authStatus || localStorage.getItem("token")) {
      location.state?.from?.pathname
        ? location.state?.from?.pathname === "/user"
          ? navigate("/home")
          : navigate(location.state.from.pathname, { replace: true })
        : navigate("/home")
    }
  }

  useEffect(() => {
    navigateTo()
  }, [])

  return {
    username,
    password,
    openSnackBar,
    setOpenSnackBar,
    setUsername,
    setPassword,
    handleLoginButton,
  }
}

export default useAction
