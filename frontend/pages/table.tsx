import type { NextPage } from "next";
import * as React from "react";
import { ReactElement } from "react";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import { NextPageWithLayout } from "./_app";

const Table: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <main>aaa</main>
    </div>
  );
};

Table.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Table;
