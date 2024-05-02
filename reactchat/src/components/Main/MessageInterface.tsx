import {
  Box,
  List,
  Avatar,
  useTheme,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
  TextField,
} from "@mui/material";
import Scroll from "./Scroll";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server as ServerType } from "../../@types/server.d";
import MessageInterfaceChannels from "./MessageInterfaceChannels";


interface ServerChannelProps {
  data: ServerType[];
}

interface SendMessageData {
  type: string;
  message: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageInterface = (props: ServerChannelProps) => {
  const { data } = props;
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { serverId, channelId } = useParams();
  const serverName = data?.[0]?.name ?? "Server";
  const { fetchData } = useCrud<ServerType>(
    [],
    `/messages?channel_id=${channelId}`
  );

  const socketUrl = channelId
    ? `ws://127.0.0.1:8000/${serverId}/${channelId}`
    : null;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected!");
      } catch (error) {
        console.log(error);
      }
    },
    onClose: () => {
      console.log("Closed!");
    },
    onError: () => {
      console.log("Error!");
    },
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendJsonMessage({
        type: "message",
        message
      } as SendMessageData);
      setMessage("");
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({
      type: "message",
      message
    } as SendMessageData);
    setMessage("");
  }

  function formatTimeStamp(timestamp: string): string {
    const date = new Date(Date.parse(timestamp));
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    console.log(formattedDate)
    return `${formattedDate} at ${formattedTime}`
  }

  return (
    <>
      <MessageInterfaceChannels data={data} />
      {
        channelId === undefined ? (
          <Box
            sx={{
              overflow: "hidden",
              p: { xs: 0 },
              height: `calc(80vh)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                letterSpacing={"-0.5px"}
                sx={{px: 5, maxWidth: "600px"}}
              >
                Welcome to { serverName }
              </Typography>

              <Typography>
                {/* { data?.[0]?.description ?? "This is our home" } */}
                { data?.[0]?.description ? data[0].description : "This is our home" }
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Box

            >
              <Scroll>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  {
                    newMessage.map((msg: Message, index: number) => (
                      <ListItem
                        key={index}
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={msg.sender}
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: "12px",
                            variant: "body2",
                          }}

                          primary={
                            <>
                              <Typography
                                component="span"
                                variant="body1"
                                color="text.primary"
                                sx={{ display: "inline", fontWeight: 600, textTransform: "capitalize" }}
                              >
                                {msg.sender}
                              </Typography>

                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {" at "} {formatTimeStamp(msg.timestamp)}
                              </Typography>
                            </>
                          }

                          secondary={
                            <>
                              <Typography
                                variant="body1"
                                style={{
                                  overflow: "visible",
                                  whiteSpace: "normal",
                                  textOverflow: "clip",
                                }}
                                sx={{
                                  display: "inline",
                                  lineHeight: 1.2,
                                  fontWeight: 400,
                                  fontSize: "12px",
                                }}
                                component="span"
                                color="text.primary"
                              >
                                {msg.content}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                  }
                </List>
              </Scroll>
            </Box>

            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                width: "100%",
              }}
            >

              <form
                // onSubmit={handleSubmit}
                style={{
                  bottom: 0,
                  right: 0,
                  padding: "1rem",
                  backgroundColor: theme.palette.background.default,
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline minRows={1}
                    value={message}
                    maxRows={4}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              </form>

            </Box>
          </>
        )
      }
    </>
  );
};

export default MessageInterface;
