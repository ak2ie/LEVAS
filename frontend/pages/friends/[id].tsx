import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import Layout from "components/layout";
import { format } from "date-fns";
import {
  useAddEventMutation,
  useGetEventsQuery,
  useGetFriendsQuery,
  useUpdateFriendMutation,
} from "features/api/apiSlice";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { ReactElement, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "styles/Home.module.css";
import * as yup from "yup";

type FriendType = {};

type FriendUpdateFormInput = {
  name: string;
  memo: string;
};

const FriendPage: NextPageWithLayout = () => {
  const [
    updateFriend,
    { isLoading: updating, isError: isUpdateError, isSuccess: isUpdateSuccess },
  ] = useUpdateFriendMutation();

  const {
    data: friends,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFriendsQuery();

  let content;
  const router = useRouter();

  const schema = yup.object({
    name: yup
      .string()
      .required("必須入力です")
      .max(100, "100文字以下で入力してください"),
    memo: yup.string().max(500, "500文字以下で入力してください"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FriendUpdateFormInput>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isSuccess) {
      if (friends.friends.length > 0) {
        const friend = friends.friends.filter(
          (friend) => friend.userID === friendID
        );
        let defaultValues = {
          name: friend[0].userName,
          memo: friend[0].memo,
        };
        reset({ ...defaultValues });
      }
    }
  }, [isSuccess]);

  const { id } = router.query;
  const friendID = typeof id === "string" ? id : "";

  const onSubmit: SubmitHandler<FriendUpdateFormInput> = async (data) => {
    await updateFriend({
      userID: friendID,
      userName: data.name,
      memo: data.memo,
    }).unwrap();
  };

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    if (friends.friends.length === 0) {
      router.push("/friends");
    } else {
      const friend = friends.friends.filter(
        (friend) => friend.userID === friendID
      );

      if (friend.length === 0) {
        router.push("/friends");
      }

      content = (
        <Box>
          <Stack direction="row" marginY={3} alignItems="center">
            <Avatar src={friend[0].imgUrl}></Avatar>
            <Stack marginLeft={3}>
              <Typography variant="caption">LINE 表示名</Typography>
              <Typography fontWeight="bold" fontSize="1.3em">
                {friend[0].lineUserName}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <TextField
              label="名前"
              variant="outlined"
              disabled={isLoading || updating}
              {...register("name")}
              error={"name" in errors}
              helperText={errors.name?.message}
            />
            <TextField
              label="メモ"
              variant="outlined"
              disabled={isLoading || updating}
              multiline
              rows={5}
              {...register("memo")}
              error={"memo" in errors}
              helperText={errors.memo?.message}
            />
            <LoadingButton
              loading={updating}
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
            >
              保存
            </LoadingButton>
            <Collapse in={isUpdateError}>
              <Alert severity="error">保存に失敗しました</Alert>
            </Collapse>
            <Collapse in={isUpdateSuccess}>
              <Alert severity="success">保存しました</Alert>
            </Collapse>
          </Stack>
        </Box>
      );
    }
  } else if (isError) {
    content = (
      <Alert severity="error">
        友だち取得に失敗しました。時間をおいてから再読み込みしてください。
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>友だち情報更新</title>
      </Head>
      <div className={styles.container}>
        <Box sx={{ "& > button": { m: 1 } }}>{content}</Box>
      </div>
    </>
  );
};

FriendPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuthUser<FriendType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(FriendPage);
