
drop table if exists produtos; 

drop table if exists categorias_produtos ;

drop table if exists promocao_produtos ;

drop table if exists restaurantes ;

drop table if exists horario_de_funcionamento ;


create table horario_de_funcionamento (
  id serial primary key unique,
  seg text,
  ter text,
  qua text,
  qui text,
  sex text,
  sab text,
  dom text
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

create table categorias_produtos (
    id serial primary key unique,
    descricao text not null
);

create table promocao_produtos (
    id serial primary key unique,
    descricao text not null,
    preco integer not null,
    dia_da_semana text not null,
    horario text not null
);

create table produtos (
    id serial primary key unique,
    restaurate integer references restaurantes(id) not null,
    nome text not null,
    preco integer not null,
    categoria integer references categorias_produtos(id) not null,
    promocao integer references promocao_produtos(id)
);
