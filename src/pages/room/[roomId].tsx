import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMessages, useRooms } from "@/hooks";
import { Room } from "@/types/room.types";

type RoomPageProps = {};

const RoomPage: NextPage<RoomPageProps> = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const { roomId } = router.query;
  const { fetchRoom } = useRooms();
  const { messages, fetchMessages, observeMessages, postMessage } = useMessages();

  useEffect(() => {
    if (!roomId) return;
    (async () => {
      const data = await fetchRoom(roomId as string);
      if (!data) return;
      setRoom(data[0]);
      await fetchMessages(roomId as string);
      observeMessages(roomId as string);
    })();
  }, [roomId]);

  const handleSendMessage = () => {
    if (!roomId) return;
    postMessage(roomId as string, value);
    setValue("");
  };

  return (
    <>
      <h2>{room?.name}</h2>
      <p>room ID : {roomId}</p>
      <ul>
        {messages?.map((message) => (
          <li key={message.id}>{message.message}</li>
        ))}
      </ul>

      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => handleSendMessage()}>Send</button>
      </form>
    </>
  );
};

export default RoomPage;
