import { useEffect, useState } from "react";

interface MovieIdProp {
  movieId: number;
  cookies: object
}

const Chat: React.FC<MovieIdProp> = ({ movieId, cookies }) => {
  const [messages, setMessages] = useState([]);
  const [guid, setGuid] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [username, setUsername] = useState(cookies.name || "Guest");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/cable");
    ws.onopen = () => {
      console.log("Connected to websocket server");
      setGuid(Math.random().toString(36).substring(2, 15));

      ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: guid,
            channel: "MessagesChannel"
          })
        })
      )
    }
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "ping") return;
      if (data.type === "welcome") return;
      if (data.type === "confirm_subscription") return;

      const message = data.message;
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  }, []);


  useEffect(() => {
    fetchMessages();
  }, [])

  useEffect(() => {
    // Filter messages with the specific movieId
    const filtered = messages.filter((message) => message.movieId === movieId);
    setFilteredMessages(filtered);
  }, [messages, movieId]); // Include movieId as a dependency
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = (e.target as HTMLFormElement).message.value;
    const postData = {
      content,
      movieId,
      username
    };

    (e.target as HTMLFormElement).message.value = "";

    await fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });
  }

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/messages");
    const data = await response.json();
    setMessages(data);
  }

  return (
    <>
      <div className="text-white">
        <h1>Chat</h1>
      </div>
      <div className="messages text-white" id="messages">
        {filteredMessages.map((message) =>
          <div className="message" key={message.id}>
            <p>{message.username} : {message.content}</p>
          </div>
        )}
      </div>
      <div className="messageForm text-white">
        <form onSubmit={handleSubmit}>
          <input className="messageInput" type="text" name="message" />
          <button className="messageButton" type="submit">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;