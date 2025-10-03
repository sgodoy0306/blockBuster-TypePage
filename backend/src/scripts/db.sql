create table film_studios (
    id serial primary key,
    name varchar(50) not null,
    description varchar(300) not null,
    year_creation integer not null check (year_creation >= 1900),
    founder varchar(50) not null
);


create table movies (
    id serial primary key,
    name varchar(50) not null,
    year integer not null check ( year >= 1970 ),
    description varchar(300) not null,
    price integer not null,
    stock integer not null,
    duration integer not null,
    mpa_rating varchar(10) not null,
    genre varchar(50) not null,
    director varchar(100) not null,
    film_studio_id integer not null references film_studios(id),
    image_path text not null
);


create table actors (
    id serial primary key,
    name varchar(80) not null 
);

create table actors_in_movies (
    movie_id integer not null references movies(id) on delete cascade,
    actor_id integer not null references actors(id) on delete cascade,
    primary key (movie_id, actor_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);