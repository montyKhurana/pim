# --- !Ups

create table "product" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar not null,
  "category" varchar,
  "code" varchar,
  "price" decimal
);

# --- !Downs

drop table if exists "product";