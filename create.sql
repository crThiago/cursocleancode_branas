drop schema cccat16 cascade;

create schema cccat16;

create table cccat16.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);

create table cccat16.ride (
	ride_id      uuid primary key,
	passenger_id uuid not null,
	driver_id    uuid,
	status       text not null,
	fare         numeric,
	distance     numeric,
	from_lat     numeric,
	from_long     numeric,
	to_lat       numeric,
	to_long     numeric,
	date         timestamp
);

create table cccat16.position (
    position_id uuid primary key,
    ride_id uuid not null,
    lat numeric not null,
    long numeric not null,
    date timestamp
);
