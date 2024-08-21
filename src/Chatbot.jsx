import React, { useState, useCallback } from "react";
import "./App.css";
import { Paper, Box, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Chatbox from "./Chatbox";
import { useSearchParams } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";

const headers = [
  { label: "Label", key: "var" },
  { label: "Transcript", key: "text" },
  { label: "Sender", key: "source" },
  { label: "Time", key: "id" },
];
export function Chatbot() {
  let [searchParams] = useSearchParams();
  const [messages, setMessages] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("history");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [messagesTemp, setMessagesTemp] = useState([]);
  const [typing, setTyping] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState(1);
  const getData = () => {
    var temp = messages;
    for (var i = 0; i < messages.length; i++) {
      temp[i].text = messages[i].text.replace(/\"/g, '""');
    }
    setMessagesTemp(temp);
  };
  React.useEffect(() => {
    console.log(messages);
    localStorage.setItem("history", JSON.stringify(messages));
  }, [messages]);
  const getResponse = (message) => {
    const chat_history = messages
      .map((m) => `{"role": "${m.role}", "content": "${m.text}"}`)
      .join(",\n");
    console.log(chat_history);
    setTyping(true);
    fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{ \n  "messages": [ \n    { "role": "system", "content": "You are a manager communicating in the tone of an online chat." },\n { "role": "user", "content": "${message}" }\n  ], \n   "temperature": 0.7, \n  "max_tokens": -1,\n "stream": false\n}`,
    }).then(async (res) => {
      const time = Date.now();

      res.json().then((resj) => {
        console.log(resj.choices[0].message.content);
        setTyping(false);
        setMessages((prev_state) => [
          ...prev_state,
          {
            text: resj.choices[0].message.content,
            role: "system",
            id: time,
            var: `A${questionCount}`,
          },
        ]);
        setQuestionCount((prevState) => prevState + 1);
      });
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          width: "50vw",
          m: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              height: "5%",
              px: 2,
            }}
          >
            <h3
              sx={{
                align: "left",
              }}
            >
              GiesChatBot
            </h3>
          </Box>
          <Chatbox messages={messages} typing={typing} />
          <Box
            sx={{
              widht: "100%",
              height: "10%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{
                width: "90%",
              }}
              multiline
              disabled={typing}
              InputProps={{
                sx: {
                  borderRadius: 5,
                },
                endAdornment: <SendIcon />,
              }}
              placeholder="Type message here..."
              //   defaultValue={"what is a 3 way match in accounting?"}
              onKeyDown={(ev) => {
                const time = Date.now();
                if (ev.key === "Enter") {
                  setMessages((prev_state) => [
                    ...prev_state,
                    {
                      text: ev.target.value,
                      role: "user",
                      id: time,
                      var: `Q${questionCount}`,
                    },
                  ]);
                  getResponse(ev.target.value);
                  ev.target.value = "";
                  ev.preventDefault();
                }
              }}
            ></TextField>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "end",
          justifyContent: "right",
          flexDirection: "row",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",

            p: 3,
            m: 2,
          }}
        >
          {/* <Button
            variant="contained"
            onClick={() => {
              console.log(messages);
            }}
          >
            Done
          </Button> */}
          <Button
            color={"error"}
            onClick={() => {
              localStorage.setItem("history", []);
              setMessages([]);
            }}
          >
            Clear History
          </Button>
          <Box
            sx={{
              border: 1,
              bgcolor: "primary.main",
              p: 1,
              color: "primary.main",
              borderRadius: 1,
            }}
          >
            <CSVLink
              data={messagesTemp}
              asyncOnClick={true}
              filename={`${searchParams.get("id")}.csv`}
              style={{ alignSelf: "center", color: "white" }}
              onClick={getData}
              headers={headers}
              enclosingCharacter={`"`}
              target="_blank"
            >
              Done
            </CSVLink>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
