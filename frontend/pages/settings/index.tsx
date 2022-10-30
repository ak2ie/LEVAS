import * as React from "react";
import { ReactElement } from "react";
import Layout from "components/layout";
import styles from "styles/Home.module.css";
import { NextPageWithLayout } from "../_app";
import {
  useUpdateChannelSettingsMutation,
  useGetChannelSettingsQuery,
} from "../../features/api/apiSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Stack,
  TextField,
  Alert,
  Collapse,
  CircularProgress,
  Typography,
} from "@mui/material";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";

type TablePageType = {};

interface UpdateSeetingsFormInput {
  channelID: string;
  channelSecret: string;
}

const SettingPage: NextPageWithLayout = () => {
  const [updateSettings, { isLoading: isSaving, isError, isSuccess, error }] =
    useUpdateChannelSettingsMutation();

  const {
    data: channelSettings,
    isLoading: isGetSettingsLoading,
    isError: isGetSettingsError,
    isSuccess: isGetSettingsSuccess,
  } = useGetChannelSettingsQuery();

  /* --------------------------------------------------------------------------
   * フォームバリデーション
   * -------------------------------------------------------------------------- */
  const schema = yup.object({
    channelID: yup.string().required("必須入力です"),
    channelSecret: yup.string().required("必須入力です"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSeetingsFormInput>({
    resolver: yupResolver(schema),
  });

  /* --------------------------------------------------------------------------
   * フォーム送信
   * -------------------------------------------------------------------------- */
  const onSubmit: SubmitHandler<UpdateSeetingsFormInput> = async (data) => {
    await updateSettings({
      channelID: data.channelID,
      channelSecret: data.channelSecret,
    }).unwrap();
  };

  // チャネルID・トークン保存有無表示
  let attention;
  if (isGetSettingsLoading) {
    attention = <CircularProgress />;
  } else if (isGetSettingsSuccess) {
    attention = channelSettings.result ? (
      <Alert severity="warning">
        チャネルID・シークレットは登録済のため更新不要です。
      </Alert>
    ) : (
      <></>
    );
  }

  return (
    <>
      <Head>
        <title>設定</title>
      </Head>
      <div className={styles.container}>
        <Box sx={{ "& > button": { m: 1 } }}>
          <Typography variant="h5" component="h2" marginY={2}>
            チャネルID・シークレット登録
          </Typography>
          <Stack spacing={3}>
            {attention}
            <Alert severity="warning">
              登録時にLINEのWebhook
              URLは本システム用に変更されます。他のBotなどは使用できなくなりますのでご注意ください。
            </Alert>
            <TextField
              label="チャネルID"
              variant="outlined"
              disabled={isSaving}
              {...register("channelID")}
              error={"channelID" in errors}
              helperText={errors.channelID?.message}
            />
            <TextField
              label="チャネルシークレット"
              variant="outlined"
              disabled={isSaving}
              {...register("channelSecret")}
              error={"channelSecret" in errors}
              helperText={errors.channelSecret?.message}
            />
            <LoadingButton
              loading={isSaving}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
            >
              登録
            </LoadingButton>
            <Collapse in={isError}>
              <Alert severity="error">
                登録に失敗しました。
                {error && "data" in error && error.status === 400
                  ? "入力内容が不正です。"
                  : "時間をおいてから再実行してください。"}
              </Alert>
            </Collapse>
            <Collapse in={isSaving}>
              <Alert severity="info">
                登録には1～2分ほどかかる場合があります。
              </Alert>
            </Collapse>
            <Collapse in={isSuccess}>
              <Alert severity="success">登録に成功しました。</Alert>
            </Collapse>
          </Stack>
        </Box>
      </div>
    </>
  );
};

SettingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuthUser<TablePageType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(SettingPage);
