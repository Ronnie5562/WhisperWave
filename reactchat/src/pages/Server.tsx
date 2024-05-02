import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import MessageInterface from "../components/Main/MessageInterface";
import ServerChannels from "../components/SecondaryDraw/ServerChannels";
import UserServers from "../components/PrimaryDraw/UserServers";
import { useNavigate, useParams } from "react-router-dom";
import useCrud from "../hooks/useCrud";
import { Server as ServerType } from "../@types/server.d";
import { useEffect } from "react";

const Server = () => {
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();

  const { dataCRUD, error, isLoading, fetchData } = useCrud<ServerType>(
    [],
    `/servers/select?by_serverid=${serverId}`
  );

  if (error !== null && error.message === "400") {
    navigate("/");
    return null;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const isChannel = (): Boolean => {
    if (!channelId) {
      return true;
    }

    return dataCRUD.some((server) =>
      server.channel_server.some(
        (channel) => channel.id === parseInt(channelId)
      )
    );
  }

  useEffect(() => {
    if (!isChannel()) {
      navigate(`/server/${serverId}`);
    }
  }, [isChannel, channelId])

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <UserServers open={false} data={dataCRUD} />
      </PrimaryDraw>
      <SecondaryDraw>
        <ServerChannels data={dataCRUD} />
      </SecondaryDraw>
      <Main>
        <MessageInterface data={dataCRUD} />
      </Main>
    </Box>
  );
};

export default Server;
