import React, { useState } from "react";
import "./chat.css";
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  useSubscription,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Chip, Grid, TextField, Button } from "@material-ui/core";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

export const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/", //connect to server
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      text
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $text: String!) {
    postMessage(user: $user, text: $text)
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return (
    <div style={{ marginBottom: "5rem" }}>
      {data.messages.map(({ id, user: messageUser, text }) => {
        return (
          <div
            key={id}
            style={{ textAlign: user === messageUser ? "right" : "left" }}
          >
            <p style={{ marginBottom: "0.3rem" }}>{messageUser}</p>
            <Chip
              style={{ fontSize: "0.9rem" }}
              color={user === messageUser ? "primary" : "secondary"}
              label={text}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Chat = () => {
  const [user, setUser] = useState("Victoria");
  const [text, setText] = useState("");
  const [postMessage] = useMutation(POST_MESSAGE);
  const sendMessage = () => {
    if (text.length > 0 && user.length > 0) {
      postMessage({
        variables: {
          user: user,
          text: text,
        },
      });
      setText("");
    } else {
      alert("Missing fields!");
    }
  };
  const [name, setName] = useState("");

  return (
    <Container>
      {/* <h3>Welcome to DevThoughts! A simple chat app for the GraphQL series!</h3> */}
      <Messages user={user} />
      <div className="container">
        <div className="left">
          <div className="users">
            <button className="username">{user}</button>
            <button className="username">{user}</button>
            <button className="username">{user}</button>
          </div>
          <TextField
            onChange={(e) => {
              setUser(e.target.value);
            }}
            value={user}
            size="small"
            fullWidth
            variant="outlined"
            required
            label="Required"
            label="Enter name"
          />
        </div>
        <Grid item xs={8}>
          <TextField
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            size="small"
            fullWidth
            variant="outlined"
            required
            label="Required"
            label="Enter message here"
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={sendMessage}
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#60a820", color: "white" }}
          >
            Send
          </Button>
        </Grid>
      </div>
    </Container>
  );
};
