import { Box, Paper, Typography } from "@mui/material";
import { produce } from "immer";
import Typing from "./Typing";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { useSearchParams } from "react-router-dom";

export function ChatBubble({ message }) {
  React.useEffect(() => console.log(message), []);
  return (
    <Paper
      sx={{
        maxWidth: "50%",
        px: 1,
        fontSize: ".9rem",
        m: 2,
        borderRadius: 2,
        bgcolor: message.role == "user" ? "#FF5F05" : "#13294B",
        alignSelf: message.role == "user" ? "flex-end" : "flex-start",
        // color: message.source == "user" ? "white" : "black",
        color: "white",
      }}
      key={message.id}
    >
      {/* <Typography variant="caption">
                  {convertTime(message.id)}
                </Typography> */}
      <Markdown>{message.text}</Markdown>
    </Paper>
  );
}

export default ChatBubble;
