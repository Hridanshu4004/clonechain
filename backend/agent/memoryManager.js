const meetings = {};

export function getConversation(meetingId) {
  return meetings[meetingId] || []
}

export function saveMessage(meetingId, role, content) {

  if (!meetings[meetingId]) {
    meetings[meetingId] = [];
  }

  meetings[meetingId].push({ role, content });

}