drop index if exists "auth"."refresh_tokens_token_idx";


drop policy "Enable insert for authenticated users only" on "public"."messages";

drop policy "Enable insert for authenticated users only" on "public"."rooms";

drop policy "Enable insert for authenticated users only" on "public"."translations";

alter table "public"."rooms" add column "create_user_id" uuid;

alter table "public"."users" drop column "user_id";

alter table "public"."users" alter column "id" drop default;

alter table "public"."rooms" add constraint "rooms_create_user_id_fkey" FOREIGN KEY (create_user_id) REFERENCES users(id) not valid;

alter table "public"."rooms" validate constraint "rooms_create_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

create policy "Enable all access for authenticated users only"
on "public"."messages"
as permissive
for all
to authenticated
using (true)
with check (true);


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



