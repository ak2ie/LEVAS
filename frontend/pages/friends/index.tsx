import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
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
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import Layout from "components/layout";
import { format } from "date-fns";
import { useGetEventsQuery, useGetFriendsQuery } from "features/api/apiSlice";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { ReactElement } from "react";
import styles from "styles/Home.module.css";

type FriendType = {};

const FriendPage: NextPageWithLayout = () => {
  const {
    data: friends,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFriendsQuery();

  let content;

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    if (friends.friends.length === 0) {
      content = <p>LINEアカウントに友だちがいません</p>;
    } else {
      content = (
        <>
          {friends.friends.map((friend) => (
            <Stack
              direction="row"
              marginY={3}
              alignItems="center"
              key={friend.userID}
            >
              <Avatar src={friend.imgUrl}></Avatar>
              <Typography fontSize="1.3em" marginLeft={2}>
                <Link href={`/friends/${friend.userID}`}>
                  <a>{friend.userName}</a>
                </Link>
              </Typography>
            </Stack>
          ))}
        </>
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
        <title>友だち一覧</title>
      </Head>
      <div className={styles.container}>
        <Box sx={{ "& > button": { m: 1 } }}>
          <Typography variant="h5" component="h2" marginY={2}>
            友だち一覧
          </Typography>
          {content}
        </Box>
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
