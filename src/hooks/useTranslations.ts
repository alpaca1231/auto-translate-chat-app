import { supabase } from "@/lib/supabase";
import { apiClient } from "@/lib/axios";
import { Translation, TranslateAPIResponse } from "@/types/translations.types";
import { Message } from "@/types/message.types";

const TRANSLATION_TABLE = "translations";

export const useTranslations = () => {
  // DBから翻訳されたメッセージを取得する
  const fetchTranslation = async (
    messageId: NonNullable<Translation["message_id"]>,
    language: NonNullable<Translation["language"]>
  ) => {
    const { data, error } = await supabase
      .from(TRANSLATION_TABLE)
      .select("*")
      .eq("message_id", messageId)
      .eq("language", language)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }
    return data[0];
  };

  // DBに翻訳されたメッセージを保存する
  const postTranslation = async (
    messageId: NonNullable<Translation["message_id"]>,
    language: NonNullable<Translation["language"]>,
    message: NonNullable<Translation["message"]>
  ) => {
    const { data, error } = await supabase
      .from(TRANSLATION_TABLE)
      .insert([{ message_id: messageId, language, message }]);
    if (error) throw error;
    return data;
  };

  /**
   * openAIのAPIでメッセージを翻訳する
   * 実行時にDBに翻訳されたメッセージを保存する
   * @param { NonNullable<Translation["message_id"]> } messageId
   * @param { NonNullable<Message["message"]> } message
   * @param { NonNullable<Translation["language"]> } language
   * @returns { Promise<TranslateAPIResponse["message"]> } - 翻訳されたメッセージ
   */
  const fetchTranslateFromAPI = async (
    messageId: NonNullable<Translation["message_id"]>,
    message: NonNullable<Message["message"]>,
    language: NonNullable<Translation["language"]>
  ): Promise<TranslateAPIResponse["message"]> => {
    const res = await apiClient.post<TranslateAPIResponse>("/translate", { message, language });
    if (res.status !== 200) {
      throw new Error("error");
    }
    const translatedMessage = res.data.message;
    await postTranslation(messageId, language, translatedMessage);
    return translatedMessage;
  };

  /**
   * DBから翻訳されたメッセージを取得する
   * DBに翻訳されたメッセージがない場合はopenAIのAPIでメッセージを翻訳する
   * 実行時にDBに翻訳されたメッセージを保存する
   * @param { NonNullable<Translation["message_id"]> } messageId
   * @param { NonNullable<Translation["language"]> } language
   * @param { NonNullable<Message["message"]> } message
   * @returns { Promise<TranslateAPIResponse["message"]> } - 翻訳されたメッセージ
   */
  const fetchTranslatedMessage = async (
    messageId: NonNullable<Translation["message_id"]>,
    language: NonNullable<Translation["language"]>,
    message: NonNullable<Message["message"]>
  ) => {
    const result = await fetchTranslation(messageId, language);
    if (result) {
      return result.message;
    }
    const translatedMessage = await fetchTranslateFromAPI(messageId, message, language);
    return translatedMessage;
  };

  return {
    fetchTranslateFromAPI,
    fetchTranslatedMessage,
  };
};
