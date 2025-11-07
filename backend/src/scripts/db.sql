create table film_studios (
    id serial primary key,
    name varchar(50) not null,
    description varchar(300) not null,
    year_creation integer not null check (year_creation >= 1900),
    founder varchar(50) not null
);

-- Tabla de reservas
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    director varchar(100) not null,
    film_studio_id integer not null references film_studios(id),
    image_path text not null
);

create table genres (
    id serial primary key,
    name varchar(50) not null
);

insert into genres (name) values ('Accion'), ('Adventure'), ('Comedy'), ('Drama'), ('Horror'), ('Science Fiction'), ('Fantasy'), ('Romance'), ('Thriller'), ('Animation');

create table genres_in_movies(
    movie_id integer not null references movies(id) on delete cascade,
    genre_id integer not null references genres(id) on delete cascade,
    primary key (movie_id, genre_id)
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