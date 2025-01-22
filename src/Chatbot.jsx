import React, { useState, useCallback } from "react";
import "./App.css";
import { Paper, Box, Button, IconButton, Chip, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SendIcon from "@mui/icons-material/Send";
import Chatbox from "./Chatbox";
import { useSearchParams } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import InputBase from "@mui/material/InputBase";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveMarkdown from "remove-markdown";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
import { context } from "./context";
console.log(context);
export function Chatbot() {
  let [searchParams] = useSearchParams();

  const [openFinish, setOpenFinish] = React.useState(false);
  const handleOpenFinish = () => setOpenFinish(true);
  const handleCloseFinish = () => setOpenFinish(false);
  const [openClear, setOpenClear] = React.useState(false);
  const handleOpenClear = () => setOpenClear(true);
  const handleCloseClear = () => setOpenClear(false);

  const [userID, setUserID] = useState(() => {
    searchParams.get("id") || "test";
  });
  const [mode, setMode] = useState(() => {
    searchParams.get("mode") || "absent";
  });
  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState(() => {
  //   const saved = localStorage.getItem("history");
  //   const initialValue = JSON.parse(saved);
  //   return initialValue || [];
  // });

  const [headers, setHeaders] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [outputMessages, setOutputMessages] = useState([]);

  const controller = new AbortController();
  const [typing, setTyping] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState(1);
  const getData = () => {
    var output = {
      ParticipantID: userID,
      Condition: mode,
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
    console.log(`${mode}_${userID}`);
    let saved = localStorage.getItem(`${mode}_${userID}`);

    if (messages.length !== 0 && saved) {
      let savedState = JSON.parse(saved);
      console.log(savedState);
      savedState.messages = messages;
      localStorage.setItem(`${mode}_${userID}`, JSON.stringify(savedState));
      console.log("updated ", savedState);
    }
  }, [messages]);
  // React.useEffect(
  //   () => localStorage.setItem("startTime", startTime),
  //   [startTime]
  // );
  React.useEffect(() => {
    const tempID = searchParams.get("id") || "test";
    const tempMode = searchParams.get("mode") || "absent";
    setUserID(tempID);
    setMode(tempMode);
    let saved = localStorage.getItem(`${tempMode}_${tempID}`);
    console.log("savsed", saved);
    if (saved == null) {
      let savedState = {
        startTime: Date.now(),
        userID: tempID,
        mode: tempMode,
        messages: [],
      };

      localStorage.setItem(`${mode}_${userID}`, JSON.stringify(savedState));
    } else {
      const savedState = JSON.parse(saved);
      console.log(savedState);
      setStartTime(savedState.startTime);
      setUserID(savedState.userID);
      setMode(savedState.mode);
      setMessages(savedState.messages || []);
    }
  }, []);

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
    // const chat_history = newChat
    //   .map(
    //     (m) =>
    //       `{"role": "${m.role}", "content": "${RemoveMarkdown(m.content)
    //         .replace(/(\r\n|\n|\r)/gm, "")
    //         .replace(/[|&;$%@"<>()+,]/g, "")}"}`
    //   )
    //   .join(",\n");
    fetch("http://localhost:1234/v1/chat/completions", {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: context }, ...newChat],
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      }),
    })
      .then(async (res) => {
        res.json().then((resj) => {
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
        p: 2,
      }}
    >
      <Paper
        sx={{
          // height: "100%",
          display: "flex",
          // width: "",
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
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
            <IconButton onClick={handleOpenClear}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <Chatbox messages={messages} typing={typing} mode={mode} />
          <Box
            sx={{
              width: "100%",
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
                opacity: 0.8,
                alignItems: "center",
                width: "90%",
              }}
              id="messageBoxPaper"
            >
              <IconButton sx={{ p: "10px" }} aria-label="stop">
                {/* <StopCircleIcon
                  onClick={() => {
                    controller.abort();
                    setQuestionCount((prevState) => prevState + 1);
                    setTyping(false);
                  }}
                /> */}
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
          // border: 1,
          width: "25%",
          display: "flex",
          alignItems: "flex-end",
          // justifyContent: "space-between",
          flexDirection: "column",
          ml: 1,
          mr: 2,
          mt: 1,
          // my: 2,
        }}
      >
        <Button onClick={handleOpenFinish} variant="contained">
          Finish
        </Button>
        <Modal
          open={openFinish}
          onClose={handleCloseFinish}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
            ></Typography>
            <Box
              sx={{
                border: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                p: 1,
                color: "primary.main",
                borderRadius: 1,
              }}
            >
              <CSVLink
                data={outputMessages}
                asyncOnClick={true}
                filename={`${userID}.csv`}
                style={{
                  color: "white",
                }}
                onClick={getData}
                headers={headers}
                enclosingCharacter={`"`}
                target="_blank"
              >
                Download results
              </CSVLink>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Modal open={openClear} onClose={handleCloseClear}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Box>
              User ID: <Chip label={userID} />
            </Box>
            <Box>
              Treatment: <Chip label={mode} />
            </Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.setItem(`${mode}_${userID}`, null);
                setMessages([]);
                handleCloseClear();
              }}
            >
              Clear This Users History
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.clear();
                setMessages([]);
                handleCloseClear();
              }}
            >
              Clear All Users History
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
// body: `{ \n  "messages": [{"role": "user", "content": "Please respond informally but professionally. Your are playing the role of a manager but shouldn't refer to yourself as a manager."},
