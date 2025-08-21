import { Box, Paper, Typography } from "@mui/material";
import Typing from "./Typing";
import React, { useState } from "react";
import ChatBubble from "./ChatBubble";

const INSTRUCTIONS = {
  content: [
    `Hi! You will be working on the 3-way match testing for this audit. Below are documentation
     guidelines for performing this task. Please take 5-7 minutes to look through the documentation
     guidelines and the material provided in the envelope in front of you and develop any initial
     questions you may have for me.`,
    `Please ensure that the company name, invoice date, and invoice number on your computer screen match
   the information on the related invoice in your envelope, and that the amount paid is the correct
   amount owed per the invoice in your envelope.
   * If you find an error in one of these four categories, you will check the box below that category.
      * Example: if you found that an incorrect amount was paid because a discount should have been
   taken (i.e., the amount paid is $45,677, but the invoice indicates the amount paid should have
   been $41,109 with the discount), you will check the box below the "Amount Paid" column.
   * If you find no errors for an invoice (i.e., all four categories are accurate), you will check the box below
   the rightmost column labeled "No Error Found."
      * Example: if you find no errors (i.e., the company name, invoice date, and invoice number
   exactly match that information on the invoice, and the amount paid is correct per the invoice),
   you will check the box below the "No Error Found" column.`,
  ],
  source: "assistant",
  id: "instructions",
};

const convertTime = (someMillisecondValue) => {
  var date = new Date();
  date.setTime(someMillisecondValue);
  var minute = date.getMinutes();
  var hour = date.getHours();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  return `${month}/${day}/${year} ${hour}:${minute}`;
};

export function Chatbox({ messages, typing }) {
  const listRef = React.useRef(null);
  
  React.useEffect(() => {
    let lastItem = listRef.current?.lastChild;
    lastItem?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);
  
  console.log("messages ", messages);
  
  return (
    <Box
      ref={listRef}
      id="simplebar"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "#ffffff",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#e0e0e0",
          borderRadius: "3px",
          "&:hover": {
            bgcolor: "#cccccc",
          },
        },
      }}
    >
      <Box sx={{ py: 1.5 }}>
        <ChatBubble message={INSTRUCTIONS} image={true} key="instructions" />
      </Box>
      
      {messages.length > 0 && (
        <Box sx={{ py: 0.5 }}>
          {messages.map((message, i) => (
            <ChatBubble message={message} key={i} />
          ))}
        </Box>
      )}
      
      {typing && !messages.some(msg => msg.isStreaming) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            px: 2,
            mb: 1.5,
          }}
        >
          <Typing />
        </Box>
      )}
    </Box>
  );
}

export default Chatbox;
// const getResponse = (message) => {
//   fetch("http://localhost:1234/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: `{ \n  "messages": [ \n    { "role": "system", "content": "You are a manager communicating in the tone of an online chat." },\n    { "role": "user", "content": "${message}" }\n  ], \n  "temperature": 0.7, \n  "max_tokens": 1000,\n  "stream": true\n}`,
//   }).then(async (res) => {
//     const time = Date.now();
//     const reader = res.body.getReader();
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         return;
//       }
//       if (
//         new Decoder().decode(value).substring(5).indexOf("[DONE]") ==
//           -1 &&
//         new TextDecoder().decode(value).substring(5) != ""
//       ) {
//         let temp = JSON.parse(new TextDecoder().decode(value).substring(6));
//         console.log(temp);
//         console.log("updating");
//         handleStream(time, temp.choices[0].delta.content);
//       }
//     }
//   });
// };
