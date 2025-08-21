import { Box, Paper, Typography } from "@mui/material";
import { produce } from "immer";
import Typing from "./Typing";
import React, { useState } from "react";
import Markdown from "react-markdown";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

// CSS for streaming indicator (removed blinking cursor)
const streamingStyles = {
  // No visual indicator for streaming - removed blinking cursor
};

export function ChatBubble({ message, image }) {
  const isUser = message.role === "user";
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1.5,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "50%",
          px: 2,
          py: 1.5,
          fontSize: "14px",
          borderRadius: 2.5,
          bgcolor: isUser ? "#f0f7ff" : "#f8f9fa",
          color: isUser ? "#1a1a1a" : "#333333",
          border: isUser ? "1px solid #e3f2fd" : "1px solid #f0f0f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
          },
          transition: "box-shadow 0.2s ease-in-out",
          ...(message.isStreaming && streamingStyles),
        }}
        key={message.id}
      >
        {Array.isArray(message.content) ? (
          <Box>
            <Markdown 
              components={{
                p: ({ children }) => (
                  <Typography 
                    component="p" 
                    sx={{ 
                      mb: 1.2, 
                      lineHeight: 1.5,
                      fontSize: "14px",
                      "&:last-child": { mb: 0 }
                    }}
                  >
                    {children}
                  </Typography>
                ),
                strong: ({ children }) => (
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontWeight: 600,
                      color: isUser ? "#1976d2" : "#666666"
                    }}
                  >
                    {children}
                  </Typography>
                ),
                ul: ({ children }) => (
                  <Box component="ul" sx={{ pl: 1.5, mb: 1.2 }}>
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Typography 
                    component="li" 
                    sx={{ 
                      mb: 0.3,
                      lineHeight: 1.5,
                      fontSize: "14px"
                    }}
                  >
                    {children}
                  </Typography>
                ),
              }}
            >
              {message.content[0]}
            </Markdown>
            
            {image && (
              <Box sx={{ my: 1.5 }}>
                <Zoom>
                  <img 
                    src="/gies_bot_3_way_match.png" 
                    style={{ 
                      width: "100%", 
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }} 
                    alt="3-way match diagram"
                  />
                </Zoom>
              </Box>
            )}
            
            <Markdown 
              components={{
                p: ({ children }) => (
                  <Typography 
                    component="p" 
                    sx={{ 
                      mb: 1.2, 
                      lineHeight: 1.5,
                      fontSize: "14px",
                      "&:last-child": { mb: 0 }
                    }}
                  >
                    {children}
                  </Typography>
                ),
                strong: ({ children }) => (
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontWeight: 600,
                      color: isUser ? "#1976d2" : "#666666"
                    }}
                  >
                    {children}
                  </Typography>
                ),
                ul: ({ children }) => (
                  <Box component="ul" sx={{ pl: 1.5, mb: 1.2 }}>
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Typography 
                    component="li" 
                    sx={{ 
                      mb: 0.3,
                      lineHeight: 1.5,
                      fontSize: "14px"
                    }}
                  >
                    {children}
                  </Typography>
                ),
              }}
            >
              {message.content[1]}
            </Markdown>
          </Box>
        ) : (
          <Markdown 
            components={{
              p: ({ children }) => (
                <Typography 
                  component="p" 
                  sx={{ 
                    mb: 1.2, 
                    lineHeight: 1.5,
                    fontSize: "14px",
                    "&:last-child": { mb: 0 }
                  }}
                >
                  {children}
                </Typography>
              ),
              strong: ({ children }) => (
                <Typography 
                  component="span" 
                  sx={{ 
                    fontWeight: 600,
                    color: isUser ? "#1976d2" : "#666666"
                  }}
                >
                  {children}
                </Typography>
              ),
              ul: ({ children }) => (
                <Box component="ul" sx={{ pl: 1.5, mb: 1.2 }}>
                  {children}
                </Box>
              ),
              li: ({ children }) => (
                <Typography 
                  component="li" 
                  sx={{ 
                    mb: 0.3,
                    lineHeight: 1.5,
                    fontSize: "14px"
                  }}
                >
                  {children}
                </Typography>
              ),
            }}
          >
            {message.content}
          </Markdown>
        )}
      </Paper>
    </Box>
  );
}

export default ChatBubble;
