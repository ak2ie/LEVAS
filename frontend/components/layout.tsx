import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { withAuthUser, useAuthUser } from "next-firebase-auth";

type Props = {
  children?: ReactNode;
};
const drawerWidth = 240;

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const AuthUser = useAuthUser();
  const isLogined = AuthUser.id !== null ? true : false;
  const handleLogin = async () => {
    if (isLogined) {
      const auth = getAuth();
      await signOut(auth);
      router.push("/");
    } else {
      router.push("/auth");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link color="inherit" href="/">
                <a>LEVAS</a>
              </Link>
            </Typography>
            <Button color="inherit" onClick={handleLogin}>
              {isLogined ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg">{children}</Container>
      <footer className=""></footer>
    </>
  );
};

export default withAuthUser<Props>()(Layout);
