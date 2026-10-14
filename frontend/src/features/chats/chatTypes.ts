export interface ChatRoom {
  chatRoomId: number;
  storeInfoId?: number;
  storeName: string;
  lastMessage?: string | null;
  updatedAt?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  messageId: number;
  senderUserId: number;
  content: string;
  createdAt: string;
}
