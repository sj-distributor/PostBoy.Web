import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import styles from "./index.module.scss";
const Login = () => {
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
        />
        <TextField
          required
          fullWidth
          label="Password"
          className={styles.signInPassword}
          id="password"
        />
        <FormControlLabel
          control={<Checkbox />}
          className={styles.signInRememberMe}
          label="Remember me"
        />
        <Button fullWidth variant="contained" className={styles.signInButton}>
          Sign in
        </Button>
      </div>
    </div>
  );
};
export default Login;
