import { requestJson } from "../../lib/api";
import type { ChatMessage, ChatRoom } from "./chatTypes";

export function getChatRooms(): Promise<ChatRoom[]> {
  return requestJson<ChatRoom[]>("/api/chats");
}

export function getChatMessages(roomId: string | number): Promise<ChatMessage[]> {
  return requestJson<ChatMessage[]>(`/api/chats/${encodeURIComponent(String(roomId))}/messages`);
}

export function sendChatMessage(roomId: string | number, content: string): Promise<ChatMessage> {
  return requestJson<ChatMessage>(`/api/chats/${encodeURIComponent(String(roomId))}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
