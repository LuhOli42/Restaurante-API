drop table if exists produtos; 

drop table if exists promocao_produtos ;

drop table if exists restaurantes ;

drop table if exists horario_de_funcionamento ;


create table horario_de_funcionamento (
  id serial primary key unique,
  seg text default null,
  ter text default null,
  qua text default null,
  qui text default null,
  sex text default null,
  sab text default null,
  dom text default null
);

create table restaurantes (
    id serial primary key unique,
    email text not null,
    nome text not null,
    senha text not null,
    foto text,
    endereco text not null,
    horarios integer references horario_de_funcionamento(id) not null
);

create table produtos (
    id serial primary key unique,
    restaurante integer references restaurantes(id) not null,
    nome text not null unique,
    preco integer not null,
    categoria text not null
);

create table promocao_produtos (
    id serial primary key unique,
    descricao text not null,
    preco integer not null,
    horarios_tabela integer references horario_de_funcionamento(id) not null,
    restaurante integer references restaurantes(id) not null,
    produto_id integer references produtos(id) not null
);
