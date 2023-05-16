create table "public"."messages" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "room_id" uuid,
    "message" text,
    "language" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone
);


alter table "public"."messages" enable row level security;

create table "public"."rooms" (
    "id" uuid not null default uuid_generate_v4(),
    "create_user_id" uuid,
    "name" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone
);


alter table "public"."rooms" enable row level security;

create table "public"."translations" (
    "id" uuid not null default uuid_generate_v4(),
    "message_id" uuid,
    "message" text,
    "language" character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."translations" enable row level security;

create table "public"."user_rooms" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "room_id" uuid,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone
);


alter table "public"."user_rooms" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "name" character varying,
    "image_url" text,
    "language" character varying,
    "role" character varying default 'user'::character varying,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted_at" timestamp with time zone
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX rooms_pkey ON public.rooms USING btree (id);

CREATE UNIQUE INDEX translations_pkey ON public.translations USING btree (id);

CREATE UNIQUE INDEX user_rooms_pkey ON public.user_rooms USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."rooms" add constraint "rooms_pkey" PRIMARY KEY using index "rooms_pkey";

alter table "public"."translations" add constraint "translations_pkey" PRIMARY KEY using index "translations_pkey";

alter table "public"."user_rooms" add constraint "user_rooms_pkey" PRIMARY KEY using index "user_rooms_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."messages" add constraint "messages_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) not valid;

alter table "public"."messages" validate constraint "messages_room_id_fkey";

alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";

alter table "public"."rooms" add constraint "rooms_create_user_id_fkey" FOREIGN KEY (create_user_id) REFERENCES users(id) not valid;

alter table "public"."rooms" validate constraint "rooms_create_user_id_fkey";

alter table "public"."translations" add constraint "translations_message_id_fkey" FOREIGN KEY (message_id) REFERENCES messages(id) not valid;

alter table "public"."translations" validate constraint "translations_message_id_fkey";

alter table "public"."user_rooms" add constraint "user_rooms_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) not valid;

alter table "public"."user_rooms" validate constraint "user_rooms_room_id_fkey";

alter table "public"."user_rooms" add constraint "user_rooms_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_rooms" validate constraint "user_rooms_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

create policy "Enable all access for authenticated users only"
on "public"."messages"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable delete for authenticated users only"
on "public"."rooms"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."rooms"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."rooms"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."rooms"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable all access for authenticated users only"
on "public"."translations"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable delete for users based on user_id"
on "public"."user_rooms"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."user_rooms"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."user_rooms"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."users"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


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


create policy "Enable update for authenticated users only"
on "public"."users"
as permissive
for update
to authenticated
using (true)
with check (true);



