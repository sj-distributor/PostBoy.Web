import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useState } from "react";
import styles from "./index.module.scss";
const Login = () => {
  const [boolean, setBoolean] = useState(false);
  return (
    <div className={styles.pageWrap}>
      <div className={styles.loginBox}>
        <div className={styles.signInTitleBox}>
          <div className={styles.title}>Sign in</div>
        </div>
        <TextField
          required
          fullWidth
          label="Email Addres"
          className={styles.signInUserName}
          id="email"
        />
        <TextField
          required
          fullWidth
          label="Password"
          className={styles.signInPassword}
          id="password"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={boolean}
              onClick={() => {
                setBoolean((prev: boolean) => {
                  return !prev;
                });
              }}
            />
          }
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
