import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/message.types";
import { useUser } from "./useUser";

const MESSAGE_TABLE = "messages";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUser();
  const fetchMessages = async (roomId: Message["room_id"]) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }
    setMessages(data);
    return data;
  };

  const observeMessages = async (roomId: Message["room_id"]) => {
    try {
      supabase
        .channel("messages:room_id=eq." + roomId)
        .on(
          "postgres_changes", // 固定
          {
            event: "*",
            schema: "public",
            table: MESSAGE_TABLE,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              console.log("payload: ", payload);
              setMessages((prev) => [...prev, payload.new as Message]);
            }
          }
        )
        .subscribe();

      return () => supabase.channel("messages:room_id=eq." + roomId).unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  const postMessage = async (
    roomId: NonNullable<Message["room_id"]>,
    message: NonNullable<Message["message"]>
  ) => {
    const { data, error } = await supabase.from(MESSAGE_TABLE).insert([
      {
        room_id: roomId,
        message: message,
        user_id: user?.id,
        language: user?.language,
      },
    ]);

    if (error) {
      throw error;
    }
    return data;
  };

  return { messages, fetchMessages, observeMessages, postMessage };
};
