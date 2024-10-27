import React, { useState, useCallback } from "react";
import "./App.css";
import { Paper, Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Chatbox from "./Chatbox";
import { useSearchParams } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import RemoveMarkdown from "remove-markdown";
// const headers = [
//   { label: "Label", key: "var" },
//   { label: "Transcript", key: "content" },
//   { label: "Sender", key: "role" },
//   { label: "Time", key: "id" },
// ];
// const headers = [
//   {
//     label: "ParticipantID",
//     key: "ParticipantID",
//   },
//   {
//     label: "Condition",
//     key: "Condition",
//   },
//   {
//     label: "TimeStart",
//     key: "TimeStart",
//   },
//   {
//     label: "TimeQ12",
//     key: "TimeQ12",
//   },
//   {
//     label: "Q12",
//     key: "Q12",
//   },
//   {
//     label: "TimeA12",
//     key: "TimeA12",
//   },
//   {
//     label: "A12",
//     key: "A12",
//   },
//   {
//     label: "TimeQ13",
//     key: "TimeQ13",
//   },
//   {
//     label: "Q13",
//     key: "Q13",
//   },
//   {
//     label: "TimeA13",
//     key: "TimeA13",
//   },
//   {
//     label: "A13",
//     key: "A13",
//   },
// ];
export function Chatbot() {
  let [searchParams] = useSearchParams();
  const [messages, setMessages] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("history");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [headers, setHeaders] = useState([]);
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem("startTime");

    return saved || Date.now();
  });
  const [outputMessages, setOutputMessages] = useState([]);

  const controller = new AbortController();
  const [typing, setTyping] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState(1);
  const getData = () => {
    var output = {
      ParticipantID: searchParams.get("id"),
      Condition: searchParams.get("mode"),
      TimeStart: startTime,
    };
    var headersTemp = [
      { label: "ParticipantID", key: "ParticipantID" },
      { label: "Condition", key: "Condition" },
      { label: "TimeStart", key: "TimeStart" },
    ];

    messages.map((mes) => {
      output[`Time${mes.var}`] = mes.id;
      output[mes.var] = mes.content.replace(/\"/g, '""');
      headersTemp = [
        ...headersTemp,
        { label: `Time${mes.var}`, key: `Time${mes.var}` },
        { label: mes.var, key: mes.var },
      ];
    });
    output["TimeEnd"] = Date.now();
    headersTemp = [...headersTemp, { label: "TimeEnd", key: "TimeEnd" }];
    setOutputMessages([output]);
    setHeaders(headersTemp);
  };
  React.useEffect(() => {
    localStorage.setItem("history", JSON.stringify(messages));
  }, [messages]);
  React.useEffect(
    () => localStorage.setItem("startTime", startTime),
    [startTime]
  );

  const getResponse = async (message) => {
    setTyping(true);
    const newChat = [
      ...messages,
      {
        role: "user",
        content: message,
        id: Date.now(),
        var: `Q${questionCount}`,
      },
    ];
    setMessages(newChat);
    const chat_history = newChat
      .map(
        (m) =>
          `{"role": "${m.role}", "content": "${RemoveMarkdown(m.content)
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/[|&;$%@"<>()+,]/g, "")}"}`
      )
      .join(",\n");
    // console.log(`{ \n  "messages": [{"role": "user", "content": "Please respond informally but professionally. Your are playing the role of a manager but shouldn't refer to yourself as a manager."},
    //     ${chat_history}],
    //    \n "temperature": 0.7,
    //    \n "max_tokens": -1,
    //    \n "stream": false
    //    \n}`);
    fetch("http://localhost:1234/v1/chat/completions", {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{ \n  "messages": [{"role": "user", "content": "Please respond informally but professionally. Your are playing the role of a manager but shouldn't refer to yourself as a manager."}, 
      ${chat_history}], 
       \n   "temperature": 0.7, 
       \n  "max_tokens": -1,
       \n "stream": false
       \n}`,
    })
      .then(async (res) => {
        res.json().then((resj) => {
          // console.log(resj.choices[0].message.content);
          setTyping(false);
          setMessages((prev_state) => [
            ...prev_state,
            {
              content: resj.choices[0].message.content,
              role: "system",
              id: Date.now(),
              var: `A${questionCount}`,
            },
          ]);
          setQuestionCount((prevState) => prevState + 1);
        });
      })
      .catch(() => {
        setTyping(false);
        setMessages((prev_state) => [
          ...prev_state,
          {
            content: "Whoops. looks like something went wrong.",
            role: "system",
            id: Date.now(),
            var: `A${questionCount}`,
          },
        ]);
        setQuestionCount((prevState) => prevState + 1);
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
          // width: "",
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
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                borderRadius: 5,
                display: "flex",
                opacity: 0.5,
                alignItems: "center",
                width: "90%",
              }}
              id="messageBoxPaper"
            >
              <IconButton sx={{ p: "10px" }} aria-label="stop">
                <StopCircleIcon
                  onClick={() => {
                    controller.abort();
                    setQuestionCount((prevState) => prevState + 1);
                    setTyping(false);
                  }}
                />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type message here..."
                multiline
                inputProps={{}}
                disabled={typing}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    getResponse(ev.target.value);
                    ev.target.value = "";
                    ev.preventDefault();
                  }
                }}
              />
              {/* <IconButton color="primary" sx={{ p: "10px" }} aria-label="send">
                <SendIcon />
              </IconButton> */}
            </Paper>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          width: "25%",
          display: "flex",
          alignItems: "end",
          justifyContent: "right",
          flexDirection: "row",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: "20vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            p: 3,
            m: 2,
          }}
        >
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
              data={outputMessages}
              asyncOnClick={true}
              filename={`${searchParams.get("id")}.csv`}
              style={{
                alignSelf: "center",
                color: "white",
                textAlign: "center",
              }}
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
