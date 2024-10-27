import { Box, Paper, Typography } from "@mui/material";
import { produce } from "immer";
import Typing from "./Typing";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { useSearchParams } from "react-router-dom";
import ChatBubble from "./ChatBubble";
const PRESENT = {
  content: [
    `Hi! You will be working on the 3-way match testing for this audit. Below are documentation
  guidelines for performing this task. Please take 5-7 minutes to look through the documentation
  guidelines and the material provided in the envelope in front of you and develop any initial
  questions you may have for me.
  
  Please **save your questions until after you have finished reviewing** the documentation guidelines
  and materials in the envelope. **Once you have gathered all your questions and have finished
  reviewing** the materials, please send a message in the chat to let me know if you have any
  questions.`,

    `Please ensure that the company name, invoice date, and invoice number on your computer screen match
  the information on the related invoice in your envelope, and also that the amount paid is the correct
  amount owed per the invoice in your envelope.
  * If you find an error in one of these four categories, please check the box below that category.
  * Example: if you found that an incorrect amount was paid because a discount should have been
  taken (i.e., the amount paid is $45,677, but the invoice indicates the amount paid should have
  been $41,109 with the discount), you would check the box below the &quot;Amount Paid&quot; column.
  * If you find no errors for an invoice (i.e., all four categories are accurate), please check the box below
  the rightmost column labeled &quot;No Error Found.&quot;
  * Example: if you find no errors (i.e., the company name, invoice date, and invoice number
  exactly match that information on the invoice, and the amount paid is correct per the invoice),
  you would check the box below the &quot;No Error Found&quot; column.`,
  ],
  source: "assistant",
  id: "present",
};

const ABSENT = {
  content: [
    `Hi! You will be working on the 3-way match testing for this audit. Below are documentation
  guidelines for performing this task. Please take 5-7 minutes to look through the documentation
  guidelines and the material provided in the envelope in front of you and develop any initial
  questions you may have for me.
  
  Please **ask me questions as they come up in your review** of the documentation guidelines and
  materials in the envelope. **As you review the materials and questions come up**, please send a
  message in the chat to let me know your questions as they come up.`,
    `Please ensure that the company name, invoice date, and invoice number on your computer screen match
  the information on the related invoice in your envelope, and also that the amount paid is the correct
  amount owed per the invoice in your envelope.
  * If you find an error in one of these four categories, please check the box below that category.
  * Example: if you found that an incorrect amount was paid because a discount should have been
  taken (i.e., the amount paid is $45,677, but the invoice indicates the amount paid should have
  been $41,109 with the discount), you would check the box below the &quot;Amount Paid&quot; column.
  * If you find no errors for an invoice (i.e., all four categories are accurate), please check the box below
  the rightmost column labeled &quot;No Error Found.&quot;
  * Example: if you find no errors (i.e., the company name, invoice date, and invoice number
  exactly match that information on the invoice, and the amount paid is correct per the invoice),
  you would check the box below the &quot;No Error Found&quot; column.`,
  ],
  source: "assistant",
  id: "absent",
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
  let [searchParams] = useSearchParams();
  React.useEffect(() => console.log(searchParams.get("mode")), []);
  const listRef = React.useRef(null);
  React.useEffect(() => {
    let lastItem = listRef.current.lastChild;
    lastItem?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <Box
      ref={listRef}
      id="simplebar"
      sx={{
        height: "85%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowY: "scroll",
        overflow: "overlay",
      }}
    >
      {searchParams.get("mode") == "absent" ? (
        <ChatBubble message={PRESENT} image={true} key="present" />
      ) : (
        <ChatBubble message={ABSENT} image={true} key="absent" />
      )}
      {messages.length == 0 ? (
        <></>
      ) : (
        messages.map((message, i) => <ChatBubble message={message} key={i} />)
      )}
      <Box
        sx={{
          width: "50%",
          px: 1,
          m: 2,
        }}
      >
        {typing ? <Typing /> : null}
      </Box>
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
