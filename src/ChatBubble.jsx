import { Box, Paper, Typography } from "@mui/material";
import { produce } from "immer";
import Typing from "./Typing";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { useSearchParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
export function ChatBubble({ message, image }) {
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
      {Array.isArray(message.content) ? (
        <Markdown>{message.content[0]}</Markdown>
      ) : (
        <Markdown>{message.content}</Markdown>
      )}
      {image ? (
        <Zoom>
          <img
            src="src/assets/gies_bot_3_way_match.png"
            style={{ width: "100%" }}
          />
        </Zoom>
      ) : (
        <></>
      )}
      {Array.isArray(message.content) ? (
        <Markdown>{message.content[1]}</Markdown>
      ) : (
        <></>
      )}
    </Paper>
  );
}

export default ChatBubble;
