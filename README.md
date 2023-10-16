<p align="center"><b>API restaurante</b></p>

## About

Esse projeto é baseado inicialmente no desafio de back-end da goomer. Aonde tem como objetivo principal criar uma API RESTful capaz de gerenciar os restaurantes e os produtos do seu cardápio.
Existe regras criados para o desafio aonde os campos em horário devia ser apresentado no formato `HH:mm`.

## Features

- Cadastrar/deletar/atualizar dados/listar dados do restaurante
- Logar e autenticar o restaurante
- Cadastrar/deletar/atualizar dados/listar produtos do restaurante através de autenticação
- Criar promoções e lista-las junto com o produto
- Listar todos os produtos por restaurante e suas promoções
- Listar todos os restaurantes

## Techs

- NodeJS
- Postgre
- Express
- Bcrypt
- JsonWebToken
- Variaveis de ambiente - DotEnv
- knex

## Requirements

- npm instalado no seu computador
- node instalado no seu computador
- um banco de dados postgree

## How to install

- Clone esse respositorio no seu computador
- Abra seu terminal na pasta salva e digite

```
npm install
```

Depois de instalar todas as dependecias

- Preenchar os dados do arquivo .env.exemplo, com o endereço do seu banco dados, a porta que o servidor irá utilizar e crie uma senha em string para sua api.
- Renomeie .env.exemplo para .env
- Abra seu banco de dados e rode o arquivo `schema.sql`
- Agora é só rodar a API :rocket:

```
npm start
```

**Recomendo o insomnia para visualizar as rotas e mandar as informações .**

## Routes

### Criar Restaurante

#### `POST` `/createRestaurant`

Essa rota feita para criar um restaurante
Informar o seguinte json

```
{
    "nome": "Restaurante Nome",
	"senha": "12345",
	"email":"restauranteNome@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": "04:30/23:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}}
```

Informe os horarios como um objeto, aonde o primeiro valor de `HH:mm/HH:mm` correponde ao horário inicio e após a `/` o horário de fechamento do restaurante. E caso não tenha horário de funcionamento no dia pode ser passado uma string vazia, ou não colocar o dia que retonará o valor como null.
**Lembrando que os horarios tem que ser passados no formato `HH:mm` e apenas valores de minutos de 15 em 15 min**

- Retorno

```
{
    "nome": "Restaurante Nome",
	"email":"restauranteNome@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": "04:30/23:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}}
```

### Listar um restaurante

#### `GET` `/dataRestaurant/:id`

Essa rota deve se informar o id do restaurante como parametro de rota para obter as informações deles

-Retorno

```
{
	"id": 1,
	"nome": "Restaurante Nome",
	"email":"restauranteNome@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": "04:30/23:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}
	"diasFechado": ["qui"]
}
```

**Lembrando que os horarios como null, ou strings vazias apareceram como diasFechado**

### Listar todos os restaurantes

#### `GET` `/listRestaurants`

Essa rota deve retornar um Array com varios objetos aonde cada objeto se tem os dados do restaurante e horário de funcionamento

-Retorno

```
[{
    "id": 1,
    "nome": "Restaurante Nome",
	"email":"restauranteNome@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": "04:30/23:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}},
{
    "id": 2,
    "nome": "Restaurante Teste",
	"email":"teste@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": null,
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}},
{
    "id": 3,
    "nome": "Restaurante teste 2",
	"email":"teste2@teste",
	"foto": "urlDaImagem....",
	"endereco": "endereco",
	"horarios": {
		"seg": "04:30/23:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "",
        "sex": null,
        "sab": "10:30/24:00",
        "dom": "10:30/24:00"
}},
]
```

### Listagem de todos os produtos

#### `GET` `/listAllProducts`

Essa rota retorna um array com todos os produtos com seus respectivos restaurantes e horário de funcionamento

- Retorno

```
[
	{
		"restaurante": {
			"horariosFuncionamento": {
				"seg": "10:00/24:00",
				"ter": "10:30/24:00",
				"qua": "10:30/24:00",
				"qui": "10:30/24:00",
				"sex": "10:30/24:00",
				"sab": "10:30/24:00",
				"dom": "10:30/24:00"
			},
			"diasFechado": [],
			"restauranteNome": "Restaurante da Luiza",
			"email": "luizasrestaurante@teste",
			"foto": "url....",
			"endereco": "endereco"
		},
		"nome": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	},
	{
		"restaurante": {
			"horariosFuncionamento": {
				"seg": "10:00/24:00",
				"ter": "10:30/24:00",
				"qua": "10:30/24:00",
				"qui": "10:30/24:00",
				"sex": "10:30/24:00",
				"sab": "10:30/24:00",
				"dom": "10:30/24:00"
			},
			"diasFechado": [],
			"restauranteNome": "Restaurante da Luiza",
			"email": "luizasrestaurante@teste",
			"foto": "url....",
			"endereco": "endereco"
		},
		"nome": "afasdf",
		"precos": 2,
		"categoria": "pizza"
	},
	{
		"restaurante": {
			"horariosFuncionamento": {
				"seg": "10:00/24:00",
				"ter": "10:30/24:00",
				"qua": "10:30/24:00",
				"qui": "10:30/24:00",
				"sex": "10:30/24:00",
				"sab": "10:30/24:00",
				"dom": "10:30/24:00"
			},
			"diasFechado": [],
			"restauranteNome": "Restaurante da Luiza",
			"email": "luizasrestaurante@teste",
			"foto": "url....",
			"endereco": "endereco"
		},
		"nome": "vbczxbxzvcx",
		"precos": 2,
		"categoria": "pizza"
	}
]
```

### Listar todos os produtos de um restaurante

#### `GET` `/listRestaurantProduct/:restaurantId`

Essa rota deve informar um id do restaurante como parametro de rota.
Deve retorna um array com todos os produtos de um restaurante com suas respectivas promoções e horários delas

-Retorno

```
[
	{
		"numeroDoProduto": 1,
		"promo": {
			"numero": 1,
			"horarios": {
				"seg": "11:30/23:15"
			},
			"descricao": "Pizza",
			"preco": 1
		},
		"nomeDoProduto": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	},
	{
		"numeroDoProduto": 2,
		"promo": {
			"numero": 2,
			"horarios": {
				"seg": "11:30/23:15"
			},
			"descricao": "asdasd",
			"preco": 1
		},
		"nomeDoProduto": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	},
	{
		"numeroDoProduto": 3,
		"promo": {
			"numero": 3,
			"horarios": {
				"seg": "11:30/23:15"
			},
			"descricao": "asdasd",
			"preco": 1
		},
		"nomeDoProduto": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	},
	{
		"numeroDoProduto": 4,
		"promo": {
			"numero": 4,
			"horarios": {
				"seg": "11:30/23:15"
			},
			"descricao": "zcxvzxcv",
			"preco": 1
		},
		"nomeDoProduto": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	}
]
```

### Informações de um produto

#### `GET` `/dataProduct/:productId`

Essa rota necessita do id do produto como parametro para informar os dados de um produto

-Retorno

```
{
	"restaurante": {
		"horariosFuncionamento": {
			"seg": "10:00/24:00",
			"ter": "10:30/24:00",
			"qua": "10:30/24:00",
			"qui": "10:30/24:00",
			"sex": "10:30/24:00",
			"sab": "10:30/24:00",
			"dom": "10:30/24:00"
		},
		"diasFechado": [],
		"nome": "Restaurante da Luiza",
		"endereco": "endereco",
		"foto": "url....",
		"email": "luizasrestaurante@teste"
	},
	"produto": {
		"nome": "Pizza",
		"precos": 2,
		"categoria": "pizza"
	},
	"promocoes": [
		{
			"numero": 1,
			"horarios": {
				"seg": "11:30/23:15"
			},
			"descricao": "Pizza",
			"preco": 1
		}
	]
}
```

### Login restaurante

#### `POST` `/loginRestaurant`

Essa rota necessita de um body no formato json e tem como retorno um token de acesso

-Exemplo de envio

```
{
	"email":"luizasrestaurante@teste",
	"senha":"12345"
}
```

-Retorno

```
{
	"restaurante": {
		"id": 1,
		"email": "luizasrestaurante@teste",
		"nome": "Restaurante da Luiza"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWl6YXNyZXN0YXVyYW50ZUB0ZXN0ZSIsIm5vbWUiOiJSZXN0YXVyYW50ZSBkYSBMdWl6YSIsImlhdCI6MTY5NjIwMTUxMCwiZXhwIjoxNjk2MjMwMzEwfQ.0NDmCGHIRlzDqttTUbPUZ70Ly3p__98aZp36Ia54wnU"
}
```

## As próximas rotas necessitam de um token de acesso passado no seu login

### Atualizar dados do restaurante

#### `PUT` `/updateRestaurant`

Essa rota necessita o envio de um json no body da requisição

-Exemplo de envio

```
{
	"nome": "Restaurante da Luiza",
	"senha": "12345",
	"email":"luizasrestaurante@teste",
	"foto": "url....",
	"endereco": "endereco",
	"horarios": {
		"seg": "10:00/24:00",
        "ter": "10:30/24:00",
        "qua": "10:30/24:00",
        "qui": "10:30/24:00",
        "sex": "10:30/24:00",
        "sab": "10:30/24:00",
        "dom":"10:30/24:00"
}}
```

Lembrando que informe os horarios como um objeto, aonde o primeiro valor de `HH:mm/HH:mm` correponde ao horário inicio e após a `/` o horário de fechamento do restaurante. E caso não tenha horário de funcionamento no dia pode ser passado uma string vazia, ou não colocar o dia que retonará o valor como null.
**Lembrando que os horarios tem que ser passados no formato `HH:mm` e apenas valores de minutos de 15 em 15 min**

-Retorno

```
{
	"mensagem": "Restaurante atualizado com sucesso"
}
```

### Deletar restaurante

#### `DELETE` `/deleteRestaurante`

Essa rota deleta o restaurante

-Retorno

```
{
	"messagem": "Restaurante deletado com sucesso"
}
```

### Criar produto

#### `POST` `/createProduct`

Essa rota necessario o envio de um json no body da requisição

-Exemplo de envio

```
{
	"nome":"vbczxbxzvcx",
	"preco":2,
  "categoria":"pizza"
}
```

-Retorno

```
{
	"id": 6,
	"restaurante": 1,
	"nome": "vbczxbxzvcx",
	"preco": 2,
	"categoria": "pizza"
}
```

### Criar nova promoção

#### `POST` `/newPromotion/:productId`

Essa rota necessario o envio de um json no body da requisição

-Exemplo de envio

```
{
	"descricao":"zcxvzxcv",
	"preco":1,
    "horarios":{"seg":"11:30/23:15"}
}
```

Lembrando que informe os horarios como um objeto, aonde o primeiro valor de `HH:mm/HH:mm` correponde ao horário inicio e após a `/` o horário de final da promoção. E caso não o dia não tenha promoção do produto, pode ser passado uma string vazia, ou não colocar o dia que retonará o valor como null.
**Lembrando que os horarios tem que ser passados no formato `HH:mm` e apenas valores de minutos de 15 em 15 min**

-Retorno

```
{
	"id": 4,
	"descricao": "zcxvzxcv",
	"preco": 1,
	"horarios_tabela": 10,
	"restaurante": 1,
	"produto_id": 4
}
```

### Atualizar produto

#### `PUT` `/updateProduct/:productId`

Essa rota necessario o envio de um json no body da requisição. E um id como parametro de rota

-Exemplo de envio

```
{
	"nome":"aaaa",
	"preco":2,
  "categoria":"pizza"
}
```

-Retorno

```
{ message: "Produto atualizado" }
```

### Deletar produto

#### `DELETE` `/deleteProduto/:productId`

Essa rota deleta o produto

-Retorno

```
{
	"message": "Produto deletado"
}
```

## Proximas features

- [x] Criar promoções
- [ ] Adicionar migrations
- [ ] Arrumar a resposta de criar/listar todos os produtos,dados e atualizar o restaurante para informar o Id
- [ ] Atualizar/deletar promoção
- [ ] Otimizar a filtragem do banco de dados
- [ ] Uniformizar e corrigir menssagens.
- [ ] Listar restaurante por horario de funcionamento
- [ ] Verificador de senhas se a quantidade digitos foram digitas
- [ ] Autorizar apenas após confirmação o cadastro de produtos do restaurante
- [ ] integrar com Api viacep para poder cadastrar os restaurantes a partir do cep
- [ ] Integrar AWS cloud para salvar fotos do produtos e restaurantes
- [ ] Criar um Rest de clientes
- [ ] Poder favoritar, colocar no carrinho e mostrar valor total do produto dos clientes
- [ ] Utilizar uma api de de pagamentos (ainda não selecionadas) para realizar os pagamentos

## Futuras ideias

- Poder integrar com sistema de geolocalização podendo criar um mini ifood, filtrando restaurantes pertos de sua geolocalização
