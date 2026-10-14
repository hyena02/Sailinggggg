import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import Icon from "../../components/common/icon";
import { getErrorMessage } from "../../lib/api";
import "../../styles/home.css";
import { getChatMessages, getChatRooms, sendChatMessage } from "./chatApi";
import type { ChatMessage, ChatRoom } from "./chatTypes";
import "./Chats.css";

function getCurrentUserId(): string {
  try {
    const rawUser = sessionStorage.getItem("sailingUser");
    if (!rawUser) return "";

    const user = JSON.parse(rawUser) as { userId?: number | string };
    return user.userId == null ? "" : String(user.userId);
  } catch {
    return "";
  }
}

export default function ChatsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sending, setSending] = useState(false);

  const activeRoom = rooms.find(
    (room) => String(room.chatRoomId) === storeId || String(room.storeInfoId) === storeId,
  ) ?? null;
  const filteredRooms = rooms.filter((room) =>
    room.storeName.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  useEffect(() => {
    let active = true;

    getChatRooms()
      .then((items) => {
        if (active) setRooms(Array.isArray(items) ? items : []);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError, "채팅방 목록을 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storeId) {
      setMessages([]);
      return;
    }

    let active = true;
    setRoomLoading(true);
    setMessageError("");

    getChatMessages(storeId)
      .then((items) => {
        if (active) setMessages(Array.isArray(items) ? items : []);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setMessages([]);
        setMessageError(getErrorMessage(requestError, "메시지를 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setRoomLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storeId]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!storeId || !message.trim() || sending) return;

    setSending(true);
    setMessageError("");
    try {
      const savedMessage = await sendChatMessage(storeId, message.trim());
      setMessages((current) => [...current, savedMessage]);
      setMessage("");
    } catch (requestError) {
      setMessageError(getErrorMessage(requestError, "메시지를 전송하지 못했습니다."));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="subpage chats-page">
      <Header />
      <main className={`chats-shell container ${storeId ? "has-room" : "show-list"}`}>
        <aside className="chat-list">
          <header>
            <div><span>MY CHATS</span><h1>내 채팅</h1></div>
            <strong>{rooms.length}</strong>
          </header>
          <label>
            <Icon name="search" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="업체명 검색"
            />
          </label>

          <div className="chat-list__items">
            {loading ? (
              <p className="chat-state" role="status">채팅방을 불러오는 중입니다.</p>
            ) : error ? (
              <p className="chat-state" role="alert">
                채팅 API 미연결<br /><small>{error}</small>
              </p>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const isActive = String(room.chatRoomId) === storeId
                  || String(room.storeInfoId) === storeId;

                return (
                  <div
                    className={`chat-list-item ${isActive ? "is-active" : ""}`}
                    role="button"
                    tabIndex={0}
                    key={room.chatRoomId}
                    onClick={() => navigate(`/chats/${room.chatRoomId}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/chats/${room.chatRoomId}`);
                      }
                    }}
                  >
                    <span className="chat-list-avatar"><Icon name="building" size={22} /></span>
                    <div>
                      <strong>{room.storeName}</strong>
                      <p>{room.lastMessage || "최근 메시지가 없습니다."}</p>
                    </div>
                    <span className="chat-list-unread">
                      {room.unreadCount ? `${room.unreadCount}개` : ""}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="chat-state">표시할 채팅방이 없습니다.</p>
            )}
          </div>
        </aside>

        <section className="chat-room">
          <header>
            <button
              type="button"
              className="chat-mobile-back"
              onClick={() => navigate("/chats")}
              aria-label="채팅 목록"
            >
              <Icon name="chevron" size={18} />
            </button>
            <div>
              <span className="chat-room-avatar"><Icon name="building" size={22} /></span>
              <div>
                <strong>{activeRoom?.storeName || "채팅방"}</strong>
                <span>실제 메시지 API 연결 상태에 따라 이용할 수 있습니다.</span>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/stores")}>
              업체정보 <Icon name="chevron" size={15} />
            </button>
          </header>

          <div className="chat-room__messages">
            <div className="chat-date">대화 내역</div>
            {roomLoading ? (
              <p className="chat-state" role="status">메시지를 불러오는 중입니다.</p>
            ) : messageError ? (
              <p className="chat-state" role="alert">{messageError}</p>
            ) : messages.length > 0 ? (
              messages.map((item) => (
                <article
                  className={`room-message ${String(item.senderUserId) === currentUserId ? "is-sent" : "is-received"}`}
                  key={item.messageId}
                >
                  {item.content}
                  <small>{item.createdAt ? new Date(item.createdAt).toLocaleString("ko-KR") : ""}</small>
                </article>
              ))
            ) : (
              <p className="chat-state">표시할 대화 내역이 없습니다.</p>
            )}
          </div>

          <form onSubmit={submitMessage}>
            <span className="chat-attach-placeholder" aria-hidden="true">+</span>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={storeId ? "메시지를 입력해주세요" : "채팅방을 선택해주세요"}
              disabled={!storeId || Boolean(messageError)}
            />
            <button
              type="submit"
              aria-label="메시지 전송"
              disabled={!storeId || !message.trim() || sending}
            >
              <Icon name="arrow" size={19} />
            </button>
          </form>
          {messageError && (
            <p className="chat-form-error" role="alert">
              {messageError}<br />메시지 API가 구현되어 있는지 확인해주세요.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
