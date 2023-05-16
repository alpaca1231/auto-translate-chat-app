import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useUser, useRooms } from "@/hooks";
import { Room } from "@/types/room.types";
import Link from "next/link";

type RoomsProps = {};

type Rooms = Pick<Room, "id" | "name" | "create_user_id">[];

const Rooms: NextPage<RoomsProps> = () => {
  const [rooms, setRooms] = useState<Rooms>([]);
  const { user } = useUser();
  const { fetchUserRooms, createRoom } = useRooms();

  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      const data = await fetchUserRooms(user.id);
      if (data) {
        setRooms(data.map((value) => value.rooms) as Rooms); // FIXME: 型安全じゃないのどうにかしたい
      }
    })();
  }, [user?.id]);

  return (
    <>
      <h1>Rooms</h1>
      <button onClick={() => createRoom("test")}>Create room</button>
      <p>{user?.name}が参加しているROOM</p>
      {rooms.map((room) => (
        <Link href={`/room/${room.id}`} key={room.id}>
          <p>{room.name}</p>
        </Link>
      ))}
    </>
  );
};

export default Rooms;
