set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.translated_messages()
 RETURNS SETOF messages
 LANGUAGE sql
AS $function$
    SELECT
        messages.id,
        messages.user_id,
        messages.room_id,
        COALESCE(translations.message, messages.message) AS message,
        COALESCE(translations.language, messages.language) AS language,
        messages.created_at,
        messages.updated_at,
        messages.deleted_at
    FROM
        messages
    LEFT JOIN
        translations ON messages.id = translations.message_id
$function$
;


