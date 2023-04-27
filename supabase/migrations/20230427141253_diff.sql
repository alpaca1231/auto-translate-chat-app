drop policy "Enable insert for authenticated users only" on "public"."messsages";

alter table "public"."messsages" drop constraint "messsages_room_id_fkey";

alter table "public"."messsages" drop constraint "messsages_user_id_fkey";

alter table "public"."translations" drop constraint "translations_message_id_fkey";

alter table "public"."messsages" drop constraint "messsages_pkey";

drop index if exists "public"."messsages_pkey";

drop table "public"."messsages";

create table "public"."messages" (
    "id" uuid not null,
    "room_id" uuid,
    "user_id" uuid,
    "content" character varying,
    "original_language" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone
);


alter table "public"."messages" enable row level security;

alter table "public"."rooms" drop column "daleted_at";

alter table "public"."rooms" add column "deleted_at" timestamp with time zone;

alter table "public"."users" drop column "daleted_at";

alter table "public"."users" add column "deleted_at" timestamp with time zone;

CREATE UNIQUE INDEX messsages_pkey ON public.messages USING btree (id);

alter table "public"."messages" add constraint "messsages_pkey" PRIMARY KEY using index "messsages_pkey";

alter table "public"."messages" add constraint "messages_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_room_id_fkey";

alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";

alter table "public"."translations" add constraint "translations_message_id_fkey" FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE not valid;

alter table "public"."translations" validate constraint "translations_message_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."messages"
as permissive
for update
to authenticated
using (true)
with check (true);
