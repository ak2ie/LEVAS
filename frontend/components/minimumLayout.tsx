import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const MinimumLayout = ({ children }: Props) => {
  return (
    <div>
      ミニマム
      <header className="">
        <Link href="/">
          <a>Home</a>
        </Link>
      </header>
      <div className="content">{children}</div>
    </div>
  );
};

export default MinimumLayout;
