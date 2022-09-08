import { AuthAction, withAuthUser } from "next-firebase-auth";
import type { NextPage } from "next";
import * as React from "react";

type DemoDataType = {
  name: string;
};

const Demo: NextPage = () => {
  return <div>Hello!</div>;
};

export default withAuthUser<DemoDataType>({
  // <--- Ensure that the type is provided
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  //   LoaderComponent: Loading,
})(Demo);
