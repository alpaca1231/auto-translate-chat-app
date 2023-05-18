import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser, useTranslations } from "@/hooks";
import { Message } from "@/types/message.types";

const MESSAGE_TABLE = "messages";

export const useMessages = (roomId?: Message["room_id"]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUser();
  const { fetchTranslateFromAPI, fetchTranslatedMessage } = useTranslations();

  useEffect(() => {
    if (!roomId || !user?.language) return;
    fetchTranslatedMessages(roomId, user.language);
    observeMessages(roomId, user.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user]);

  /**
   * roomIDを指定して翻訳されたメッセージを全件取得する
   * 実行時にmessagesにセットする
   * useMessagesの初回レンダリング時に実行する
   * @param { Message["room_id"] } roomId - roomID
   * @param { string } fromLanguage - 翻訳する言語
   * @returns { Promise<Message[]> } - 翻訳されたメッセージ
   */
  const fetchTranslatedMessages = async (roomId: Message["room_id"], fromLanguage: string) => {
    const { data, error } = await supabase
      .rpc("translated_messages")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const translatedMessages = await Promise.all(
      data.map(async (contents: Message) => {
        const { id, message, language } = contents;
        if (!message || language === fromLanguage) return contents;
        const translateMessage = await fetchTranslateFromAPI(id, message, fromLanguage);
        return { ...contents, message: translateMessage };
      })
    );
    setMessages(translatedMessages);
    return translatedMessages;
  };

  const observeMessages = async (roomId: Message["room_id"], fromLanguage: string) => {
    if (!user) return;
    try {
      supabase
        .channel("messages:room_id=eq." + roomId)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: MESSAGE_TABLE,
          },
          async (payload) => {
            const { id, room_id, message, language } = payload.new;
            if (room_id !== roomId) return;

            // ユーザーの言語と一致する場合は翻訳しない
            if (language === fromLanguage) {
              setMessages((prev) => [...prev, payload.new as Message]);
              return;
            }

            const translatedMessage = await fetchTranslatedMessage(id, fromLanguage, message);
            setMessages((prev) =>
              prev.map((message) => {
                if (message.id === id) {
                  return { ...message, message: translatedMessage };
                }
                return message;
              })
            );
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
        user_id: user?.id,
        room_id: roomId,
        message,
        language: user?.language,
        // language: "en", // TODO: 動作確認用
      },
    ]);

    if (error) {
      throw error;
    }
    return data;
  };

  return { messages, postMessage };
};
