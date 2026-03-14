// import { runLLM } from "./llmService.js";
// import { buildPersonality } from "./personalityEngine.js";
// import { checkDeal } from "./negotiationEngine.js";
// import { getConversation, saveMessage } from "./memoryManager.js";
// import { validateResponse } from "./responseValidator.js";

// export async function runCloneAgent(userProfile, meetingId, message) {

//   const dealCheck = checkDeal(message, userProfile);

//   if (!dealCheck.allowed) {
//     return dealCheck.reply;
//   }

//   const personality = buildPersonality(userProfile);

//   const memory = getConversation(meetingId);

//   const messages = [
//     { role: "system", content: personality },
//     ...memory,
//     { role: "user", content: message }
//   ];

//   const reply = await runLLM(messages);

//   const cleanReply = validateResponse(reply);

//   saveMessage(meetingId, "user", message);
//   saveMessage(meetingId, "assistant", cleanReply);

//   return cleanReply;
// }