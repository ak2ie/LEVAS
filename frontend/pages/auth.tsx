import * as React from "react";
import type { NextPage } from "next";
import { Container, Stack, TextField, Alert, Collapse } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "../styles/Home.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import MinimumLayout from "../components/minimumLayout";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";

interface LoginFormInput {
  email: string;
  password: string;
}

type AuthDataType = {};

const Auth: NextPageWithLayout = () => {
  // フォーム バリデーション
  const schema = yup.object({
    email: yup
      .string()
      .required("必須入力です")
      .email("メールアドレスを入力してください"),
    password: yup.string().required("必須入力です"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);

  const router = useRouter();

  // Firebase認証
  const auth = getAuth();
  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    setLoading(true);
    setLoginError(false);
    signInWithEmailAndPassword(auth, data.email, data.password).catch(
      (error) => {
        setLoginError(true);
        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>LEVAS</h2>
        <Container maxWidth="sm" sx={{ pt: 5 }}>
          <Stack spacing={3}>
            <TextField
              required
              label="メールアドレス"
              {...register("email")}
              error={"email" in errors}
              helperText={errors.email?.message}
            />
            <TextField
              required
              label="パスワード"
              type="password"
              {...register("password")}
              error={"password" in errors}
              helperText={errors.password?.message}
            />
            <Collapse in={loginError}>
              <Alert severity="error">ログインに失敗しました</Alert>
            </Collapse>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              size="large"
              loading={loading}
            >
              ログイン
            </LoadingButton>
          </Stack>
        </Container>
      </main>
    </div>
  );
};

Auth.getLayout = function getLayout(page: ReactElement) {
  return <MinimumLayout>{page}</MinimumLayout>;
};

export default withAuthUser<AuthDataType>({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
