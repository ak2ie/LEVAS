import type { NextPage } from "next";
import * as React from "react";
import { ReactElement } from "react";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import { NextPageWithLayout } from "./_app";
import {
  useGetPostsQuery,
  useAddNewPostMutation,
} from "../features/api/apiSlice";
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
} from "@mui/material";
import { withAuthUser, AuthAction } from "next-firebase-auth";

type TablePageType = {};

const TablePage: NextPageWithLayout = () => {
  const [addNewPost, { isLoading: saving, isError: saveError }] =
    useAddNewPostMutation();
  const handleSave = async () => {
    await addNewPost({ text: text }).unwrap();
    setText("");
  };

  const [text, setText] = React.useState("");
  const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const rows = [
    {
      name: "山田",
      result: "参加",
    },
    {
      name: "加藤",
      result: "不参加",
    },
  ];

  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery("1");

  let content;

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    content = <p>{posts.title}</p>;
  } else if (isError) {
    content = <Alert severity="error">エラー</Alert>;
  }

  return (
    <div className={styles.container}>
      {content}
      <Box sx={{ "& > button": { m: 1 } }}>
        <Collapse in={saveError}>
          <Alert severity="error">保存に失敗しました</Alert>
        </Collapse>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>返答</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TextField
          label="テキスト"
          variant="outlined"
          multiline
          rows={3}
          value={text}
          onChange={handleText}
        />
        <LoadingButton
          loading={saving}
          onClick={handleSave}
          variant="contained"
        >
          保存
        </LoadingButton>
      </Box>
    </div>
  );
};

TablePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuthUser<TablePageType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(TablePage);
