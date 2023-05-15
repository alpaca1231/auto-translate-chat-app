alter table "public"."rooms" alter column "id" set default uuid_generate_v4();

create policy "Enable insert for authenticated users only"
on "public"."rooms"
as permissive
for insert
to authenticated
with check (true);



