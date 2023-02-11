import styles from "./index.module.scss"
import { Button, Snackbar, TextField } from "@mui/material"

const RegisterModal = () => {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.loginBox}>
        <div className={styles.signInTitleBox}>
          <div className={styles.title}>Sign in</div>
        </div>
        <TextField
          required
          fullWidth
          label="Username"
          className={styles.signInUsername}
          id="username"
          // value={username}
          // onChange={(e) => setUsername(e.target.value)}
          // onKeyUp={(e) => {
          //   e.key === "Enter" && handleLoginButton()
          // }}
        />
        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          className={styles.signInPassword}
          id="password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          // onKeyUp={(e) => {
          //   e.key === "Enter" && handleLoginButton()
          // }}
        />
        <Button
          fullWidth
          variant="contained"
          className={styles.signInButton}
          // onClick={handleLoginButton}
        >
          Sign in
        </Button>
      </div>
      <Snackbar
        // open={openSnackBar}
        autoHideDuration={3000}
        // onClose={() => {
        //   setOpenSnackBar(false)
        // }}
        message="username or password is incorrect"
      />
    </div>
  )
}
export default RegisterModal
