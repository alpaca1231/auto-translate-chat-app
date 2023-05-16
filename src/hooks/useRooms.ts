import { supabase } from "@/lib/supabase";
import { useUser } from "./useUser";
import { Room } from "@/types/room.types";
import { UserRoom } from "@/types/user-room.types";

const ROOM_TABLE = "rooms";
const USER_ROOM_TABLE = "user_rooms";

export const useRooms = () => {
  const { user } = useUser();
  // 全てのroomを取得する
  const fetchAllRooms = async () => {
    const { data, error } = await supabase.from(ROOM_TABLE).select("*");

    if (error) {
      throw error;
    }
    return data;
  };

  // roomIDを指定してroomを取得する
  const fetchRoom = async (roomId: string) => {
    const { data, error } = await supabase.from(ROOM_TABLE).select("*").eq("id", roomId);

    if (error) {
      throw error;
    }
    return data;
  };

  // userが参加しているroomを取得する
  const fetchUserRooms = async (userId: string) => {
    const { data, error } = await supabase
      .from(USER_ROOM_TABLE)
      .select("id, rooms (id, name, create_user_id)")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    return data;
  };

  // roomを作成する
  const createRoom = async (name: Room["name"]) => {
    if (!user || !name) return;
    const { data, error } = await supabase
      .from(ROOM_TABLE)
      .insert({ name, create_user_id: user.id })
      .select();
    if (error) {
      throw error;
    }
    if (!user || !data) return;
    const userRoom = { user_id: user.id, room_id: data[0].id };
    const { error: userRoomError } = await supabase.from(USER_ROOM_TABLE).insert([userRoom]);
    if (userRoomError) {
      throw userRoomError;
    }
    fetchUserRooms(user.id);
    return data;
  };

  // userをroomに参加させる
  const joinRoom = async (userRoom: UserRoom) => {
    const { data, error } = await supabase.from(USER_ROOM_TABLE).insert([userRoom]);

    if (error) {
      throw error;
    }
    return data;
  };

  return { fetchAllRooms, fetchRoom, fetchUserRooms, createRoom, joinRoom };
};
