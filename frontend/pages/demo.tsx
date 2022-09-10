import type { NextPage } from "next";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import * as React from "react";

type DemoDataType = {
  name: string;
};

const Demo: NextPage = () => {
  return <div>Hello!</div>;
};

export default withAuthUser<DemoDataType>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo);
