import axios from "axios";

export async function runLLM(messages) {

  const response = await axios.post(
    "http://localhost:11434/api/chat",
    {
      model: "llama3",
      messages: messages,
      stream: false,
    }
  );

  return response.data.message.content;

}