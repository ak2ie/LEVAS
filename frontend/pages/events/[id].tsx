import { AuthAction, withAuthUser } from "next-firebase-auth";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "components/layout";
import { useGetEventQuery } from "../../features/api/apiSlice";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styles from "styles/Home.module.css";
import { format } from "date-fns";

type EventType = {};

const Event: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const eventId = typeof id === "string" ? id : "";

  const {
    data: event,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEventQuery(eventId);

  let content;
  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    content = (
      <>
        <h2>{event.event.eventName}</h2>
        <p>{format(new Date(event.event.createdAt), "yyyy/MM/dd HH:mm")}</p>
        <p>メッセージ：{event.event.message}</p>
        {event.event.answers.length === 0 ? (
          <p>回答がありません。</p>
        ) : (
          <Box>
            <p>
              {event.event.leftButtonLabel}
              {
                event.event.answers.filter(
                  (answer) => answer.Attendance === event.event.leftButtonLabel
                ).length
              }
            </p>
            <p>
              {event.event.rightButtonLabel} :
              {
                event.event.answers.filter(
                  (answer) => answer.Attendance === event.event.rightButtonLabel
                ).length
              }
            </p>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>名前</TableCell>
                    <TableCell>回答</TableCell>
                    <TableCell>回答日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {event.event.answers.map((answer) => (
                    <TableRow
                      key={answer.userName}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {answer.userName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {answer.Attendance}
                      </TableCell>
                      <TableCell>
                        {format(new Date(answer.date), "yyyy/MM/dd HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </>
    );
  } else if (isError) {
    content = <Alert severity="error">エラー</Alert>;
  }

  return (
    <div className={styles.container}>
      <Box sx={{ "& > button": { m: 1 } }}>{content}</Box>
    </div>
  );
};

Event.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuthUser<EventType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Event);
