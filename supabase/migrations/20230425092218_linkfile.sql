create type "auth"."code_challenge_method" as enum ('s256', 'plain');

create table "auth"."flow_state" (
    "id" uuid not null,
    "user_id" uuid,
    "auth_code" text not null,
    "code_challenge_method" auth.code_challenge_method not null,
    "code_challenge" text not null,
    "provider_type" text not null,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" text not null
);


CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id);

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);

alter table "auth"."flow_state" add constraint "flow_state_pkey" PRIMARY KEY using index "flow_state_pkey";


create table "public"."messsages" (
    "id" uuid not null,
    "room_id" uuid,
    "content" character varying,
    "original_language" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "daleted_at" timestamp with time zone,
    "user_id" uuid
);


alter table "public"."messsages" enable row level security;

create table "public"."rooms" (
    "id" uuid not null,
    "name" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "daleted_at" timestamp with time zone
);


alter table "public"."rooms" enable row level security;

create table "public"."translations" (
    "id" uuid not null,
    "message_id" uuid,
    "content" character varying,
    "language" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "update_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."translations" enable row level security;

create table "public"."user_rooms" (
    "id" uuid not null default uuid_generate_v4(),
    "room_id" uuid,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone,
    "user_id" uuid
);


alter table "public"."user_rooms" enable row level security;

create table "public"."users" (
    "id" uuid not null default uuid_generate_v4(),
    "email" character varying,
    "name" character varying,
    "image_url" character varying,
    "role" character varying default 'user'::character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "daleted_at" timestamp with time zone,
    "user_id" character varying,
    "language" character varying
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX messsages_pkey ON public.messsages USING btree (id);

CREATE UNIQUE INDEX rooms_pkey ON public.rooms USING btree (id);

CREATE UNIQUE INDEX translations_pkey ON public.translations USING btree (id);

CREATE UNIQUE INDEX user_rooms_pkey ON public.user_rooms USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."messsages" add constraint "messsages_pkey" PRIMARY KEY using index "messsages_pkey";

alter table "public"."rooms" add constraint "rooms_pkey" PRIMARY KEY using index "rooms_pkey";

alter table "public"."translations" add constraint "translations_pkey" PRIMARY KEY using index "translations_pkey";

alter table "public"."user_rooms" add constraint "user_rooms_pkey" PRIMARY KEY using index "user_rooms_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."messsages" add constraint "messsages_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."messsages" validate constraint "messsages_room_id_fkey";

alter table "public"."messsages" add constraint "messsages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."messsages" validate constraint "messsages_user_id_fkey";

alter table "public"."translations" add constraint "translations_message_id_fkey" FOREIGN KEY (message_id) REFERENCES messsages(id) ON DELETE CASCADE not valid;

alter table "public"."translations" validate constraint "translations_message_id_fkey";

alter table "public"."user_rooms" add constraint "user_rooms_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."user_rooms" validate constraint "user_rooms_room_id_fkey";

alter table "public"."user_rooms" add constraint "user_rooms_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_rooms" validate constraint "user_rooms_user_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."messsages"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."rooms"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable read access for all users"
on "public"."rooms"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."translations"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."user_rooms"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert access for all users"
on "public"."users"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."users"
as permissive
for update
to public
using (((auth.jwt() ->> 'email'::text) = (email)::text))
with check (((auth.jwt() ->> 'email'::text) = (email)::text));



