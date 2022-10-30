import type { NextPage } from "next";
import * as React from "react";
import { ReactElement } from "react";
import Layout from "components/layout";
import styles from "styles/Home.module.css";
import { NextPageWithLayout } from "../_app";
import { useGetEventsQuery } from "../../features/api/apiSlice";
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
  Button,
  Grid,
} from "@mui/material";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import { format } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { yellow } from "@mui/material/colors";

type TablePageType = {};

const TablePage: NextPageWithLayout = () => {
  const {
    data: events,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEventsQuery();

  let content;
  const router = useRouter();

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    const sortedEvents = [...events.events];
    if (sortedEvents.length === 0) {
      content = <p>イベントが登録されていません。</p>;
    } else {
      sortedEvents.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      content = (
        <Box>
          <Grid container>
            <Grid xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/events/create");
                }}
              >
                イベント作成
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/friends");
                }}
                color="secondary"
              >
                友だち一覧
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  router.push("/settings");
                }}
                color="success"
              >
                設定
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>返答</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedEvents.map((event) => (
                  <TableRow
                    key={event.eventID}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link href={`/events/${event.eventID}`}>
                        <a>{event.eventName}</a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.createdAt), "yyyy/MM/dd HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    }
  } else if (isError) {
    content = (
      <Alert severity="error">
        イベント取得に失敗しました。時間をおいてから再読み込みしてください。
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>イベント一覧</title>
      </Head>
      <div className={styles.container}>
        <Box sx={{ "& > button": { m: 1 } }}>{content}</Box>
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
