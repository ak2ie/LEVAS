import type { NextPage } from "next";
import * as React from "react";
import { ReactElement } from "react";
import Layout from "components/layout";
import styles from "styles/Home.module.css";
import { NextPageWithLayout } from "../_app";
import {
  useGetEventsQuery,
  useAddEventMutation,
} from "../../features/api/apiSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Container,
  Stack,
  TextField,
  Alert,
  Collapse,
  CircularProgress,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
} from "@mui/material";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import { format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";

type TablePageType = {};

interface CreateEventFormInput {
  eventName: string;
  leftButtonLabel: string;
  rightButtonLabel: string;
  message: string;
}

const TablePage: NextPageWithLayout = () => {
  const [
    addNewEvent,
    { isLoading: saving, isError: saveError, isSuccess, error },
  ] = useAddEventMutation();
  const [eventData, setEventData] = React.useState({
    eventName: "",
    leftButtonLabel: "",
    rightButtonLabel: "",
    message: "",
  });
  const onSubmit: SubmitHandler<CreateEventFormInput> = (data) => {
    setEventData({
      eventName: data.eventName,
      leftButtonLabel: data.leftButtonLabel,
      rightButtonLabel: data.rightButtonLabel,
      message: data.message,
    });
    setDialogOpen(true);
  };

  const [dislogOpen, setDialogOpen] = React.useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSendLINE = async () => {
    setDialogOpen(false);
    console.log(eventData);
    await addNewEvent({
      eventName: eventData.eventName,
      leftButtonLabel: eventData.leftButtonLabel,
      rightButtonLabel: eventData.rightButtonLabel,
      message: eventData.message,
    }).unwrap();
  };

  const schema = yup.object({
    eventName: yup.string().required("必須入力です").max(100),
    leftButtonLabel: yup
      .string()
      .required("必須入力です")
      .max(20, "20文字以下で入力してください"),
    rightButtonLabel: yup
      .string()
      .required("必須入力です")
      .max(20, "20文字以下で入力してください"),
    message: yup
      .string()
      .required("必須入力です")
      .max(240, "240文字以下で入力してください"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormInput>({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <Head>
        <title>イベント作成</title>
      </Head>
      <div className={styles.container}>
        <Box sx={{ "& > button": { m: 1 } }}>
          <Typography variant="h5" component="h2" marginY={2}>
            イベント作成
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="イベント名"
              variant="outlined"
              disabled={saving}
              {...register("eventName")}
              error={"eventName" in errors}
              helperText={errors.eventName?.message}
            />
            <Grid container>
              <Grid md={6} sm={12} item={true}>
                <TextField
                  label="左ボタン名"
                  variant="outlined"
                  disabled={saving}
                  fullWidth
                  {...register("leftButtonLabel")}
                  error={"leftButtonLabel" in errors}
                  helperText={errors.leftButtonLabel?.message}
                />
              </Grid>
              <Grid md={6} sm={12} item={true}>
                <TextField
                  label="右ボタン名"
                  variant="outlined"
                  disabled={saving}
                  fullWidth
                  {...register("rightButtonLabel")}
                  error={"rightButtonLabel" in errors}
                  helperText={errors.rightButtonLabel?.message}
                />
              </Grid>
            </Grid>
            <TextField
              label="メッセージ本文"
              variant="outlined"
              multiline
              disabled={saving}
              rows={3}
              {...register("message")}
              error={"message" in errors}
              helperText={errors.message?.message}
            />
            <LoadingButton
              loading={saving}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
            >
              送信
            </LoadingButton>
            <Collapse in={saveError}>
              <Alert severity="error">
                送信に失敗しました。
                {error && "data" in error && error.status === 429 ? (
                  <>
                    今月中に配信可能なメッセージ数の上限を超過している可能性があります。
                    <Link href="https://www.linebiz.com/jp/manual/OfficialAccountManager/account-settings/">
                      <a target="_blank">LINE Official Account Manager</a>
                    </Link>
                    をご確認ください。
                  </>
                ) : (
                  "時間をおいてから再実行してください。"
                )}
              </Alert>
            </Collapse>
            <Collapse in={isSuccess}>
              <Alert severity="success">送信に成功しました</Alert>
            </Collapse>
          </Stack>
          <Dialog
            open={dislogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                LINEでイベントを送信してよろしいですか？
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>キャンセル</Button>
              <Button onClick={handleSendLINE} autoFocus>
                送信
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </>
  );
};

TablePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuthUser<TablePageType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(TablePage);
