# --- !Ups

CREATE TABLE details
(
    key character varying,
    value character varying,
    product_id bigint,
    CONSTRAINT "product_id_FK" FOREIGN KEY (product_id)
        REFERENCES public.product (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

# --- !Downs

drop table if exists details;