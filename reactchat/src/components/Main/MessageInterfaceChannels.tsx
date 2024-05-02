import {
    AppBar,
    Toolbar,
    Box,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    Drawer,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import { MEDIA_URL } from "../../config";
import { useParams } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ServerChannels from "../SecondaryDraw/ServerChannels";
import { Server as ServerType } from "../../@types/server.d";


interface ServerChannelProps {
  data: ServerType[];
}


const MessageInterfaceChannels = (props: ServerChannelProps) => {
    const { data } = props;
    const theme = useTheme();
    const { serverId, channelId } = useParams();
    const [sideMenu, setSideMenu] = useState(false);
    const channelName = data.find(
        (server) => server.id === Number(serverId)
    )?.channel_server?.find(
        (channel) => channel.id === Number(channelId)
    )?.name || "home";

    const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

    useEffect(() => {
        if (isSmallScreen && sideMenu) {
        setSideMenu(false);
        }
    }, [isSmallScreen]);

    const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setSideMenu(open);
    };

    const list = () => (
        <Box
            sx={{ paddingTop: `${theme.primaryAppBar.height}px`, minWidth: 200 }}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <ServerChannels data={data} />
        </Box>
    );

    return (
        <>
            <AppBar
                sx={{
                    backgroundColor: theme.palette.background.default,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
                color="default"
                position="sticky"
                elevation={0}
            >
                <Toolbar
                    variant="dense"
                    sx={{
                        minHeight: theme.primaryAppBar.height,
                        height: theme.primaryAppBar.height,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: "block", sm: "none" },
                        }}
                    >
                        <ListItemAvatar
                            sx={{
                                minWidth: "40px",
                            }}
                        >
                            <Avatar
                                src={`${MEDIA_URL}${data?.[0]?.icon}`}
                                sx={{ width: "30px", height: "30px" }}
                                alt="Server Icon"
                            />
                        </ListItemAvatar>
                    </Box>

                    <Typography noWrap component="div">
                        { channelName }
                    </Typography>

                    <Box sx={{ flexGrow: 1 }}></Box>

                    <Box
                        sx={{
                            display: { xs: "block", sm: "none" },
                        }}
                    >
                        <IconButton
                            color="inherit"
                            edge="end"
                            aria-label="open drawer"
                            onClick={toggleDrawer(true)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>

                    <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
                        {list()}
                    </Drawer>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default MessageInterfaceChannels;
