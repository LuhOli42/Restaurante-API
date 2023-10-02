const knex = require("../db/db");
const utils = require("../utils/utils");

const create = async (req, res) => {
  const { id: restaurante } = req.restaurant;
  const { nome, preco, categoria } = req.body;
  if (!nome || !preco || !categoria) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos: nome, preço, categoria" });
  }

  if (isNaN(preco)) {
    return res.status(400).json({ message: "Preço precisa ser um numero" });
  }

  if (!Number.isInteger(preco)) {
    return res
      .status(400)
      .json({ message: "digite o preço sem pontos em centavos" });
  }

  try {
    const verificarSeExiste = await knex("produtos")
      .where({ nome, restaurante })
      .first();
    if (verificarSeExiste) {
      return res.status(400).json({ message: "produto ja existe" });
    }

    const produto = await knex("produtos")
      .insert({
        nome,
        preco,
        categoria: categoria.toLowerCase(),
        restaurante,
      })
      .returning("*");

    if (produto.length === 0) {
      return res
        .status(400)
        .json({ message: "erro na hora do cadastro, tente novamente" });
    }

    return res.status(200).json(produto[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const newPromotion = async (req, res) => {
  const { id: restaurante } = req.restaurant;
  const { productId: produto_id } = req.params;
  const { descricao, horarios, preco } = req.body;
  if (!descricao || !preco || !horarios) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos: descricao, preço, horario" });
  }

  if (isNaN(preco)) {
    return res.status(400).json({ message: "Preço precisa ser um numero" });
  }

  if (!Number.isInteger(preco)) {
    return res
      .status(400)
      .json({ message: "digite o preço sem pontos em centavos" });
  }

  if (!utils.verificadorHorarios(horarios).verify) {
    return res
      .status(400)
      .json({ message: utils.verificadorHorarios(horarios).message });
  }

  try {
    const produtoCadastrado = await knex("produtos")
      .where({ id: produto_id })
      .first();

    if (!produtoCadastrado) {
      return res.status(400).json({ message: "Produto não localizado" });
    }
    const horarioFuncionamento = await knex("horario_de_funcionamento")
      .insert(horarios)
      .returning("*");

    if (!horarioFuncionamento) {
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }

    const promocaoCadastro = await knex("promocao_produtos")
      .insert({
        restaurante,
        descricao,
        preco,
        horarios_tabela: horarioFuncionamento[0].id,
        produto_id,
      })
      .returning("*");

    if (!promocaoCadastro[0]) {
      await knex("horario_de_funcionamento")
        .where({ id: horarioFuncionamento[0].id })
        .del();
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }

    return res.status(200).json(promocaoCadastro[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const update = async (req, res) => {
  const { nome, preco, categoria } = req.body;
  const { id: restaurante } = req.restaurant;
  const { productId: id } = req.params;

  if (!nome || !preco || !categoria) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos: nome, preço, categoria" });
  }

  if (isNaN(preco)) {
    return res.status(400).json({ message: "Preço precisa ser um numero" });
  }

  if (!Number.isInteger(preco)) {
    return res
      .status(400)
      .json({ message: "digite o preço sem pontos em centavos" });
  }

  try {
    const localizarProduto = await knex("produtos")
      .where({ id, restaurante })
      .first();

    if (!localizarProduto) {
      return res.status(404).json({ message: "Produto não localizado" });
    }

    if (nome !== localizarProduto.nome) {
      const localizarProdutoComNomeIgual = await knex("produtos")
        .where({ nome, restaurante })
        .first();

      if (localizarProdutoComNomeIgual) {
        return res
          .status(400)
          .json({ message: "Produto com esse nome ja cadastrado" });
      }
    }

    const atualizarProduto = await knex("produtos")
      .where({ id })
      .update({
        nome,
        preco,
        categoria,
      })
      .returning("*");

    if (!atualizarProduto[0]) {
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }

    return res.status(200).json({ message: "Produto atualizado" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const del = async (req, res) => {
  const { id: restaurante } = req.restaurant;
  const { productId: id } = req.params;
  try {
    const localizarProduto = await knex("produtos")
      .where({ id, restaurante })
      .first();

    if (!localizarProduto) {
      return res.status(404).json({ message: "Produto não localizado" });
    }

    const deletarPromocao = await knex("promocao_produtos")
      .where({ restaurante, produto_id: id })
      .del();

    const deletar = await knex("produtos").where({ id, restaurante }).del();

    if (deletar === 0) {
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }

    return res.status(200).json({ message: "Produto deletado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const data = async (req, res) => {
  const { productId: id } = req.params;
  try {
    const localizarProduto = await knex("produtos")
      .join("restaurantes as r", "produtos.restaurante", "r.id")
      .join("horario_de_funcionamento as h", "r.horarios", "h.id")
      .select(
        "produtos.nome as p_nome",
        "produtos.preco as p_precos",
        "produtos.categoria as p_categoria",
        "r.nome as r_nome",
        "r.endereco as r_endereco",
        "r.foto as r_foto ",
        "r.email as r_email",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .where("produtos.id", id)
      .then(function (rows) {
        if (!rows[0]) {
          return rows[0];
        }
        rows[0].restaurante = {};
        rows[0].produto = {};
        rows[0].restaurante.horariosFuncionamento = {};
        rows[0].restaurante.diasFechado = [];
        for (const [key, value] of Object.entries(rows[0])) {
          if (key.split("_")[0] === "r") {
            const nome = key.split("_")[1];
            rows[0].restaurante[nome] = value;

            delete rows[0][key];
          }
          if (key.split("_")[0] === "p") {
            const nome = key.split("_")[1];
            rows[0].produto[nome] = value;

            delete rows[0][key];
          }
          if (key.split("_")[0] === "h") {
            const nome = key.split("_")[1];
            if (value) {
              rows[0].restaurante.horariosFuncionamento[nome] = value;
            }
            if (!value) {
              rows[0].restaurante.diasFechado.push(nome);
            }
            delete rows[0][key];
          }
        }
        return rows[0];
      });
    if (!localizarProduto) {
      return res.status(404).json({ messagem: "Produto não localizado" });
    }
    const promocoes = await knex("promocao_produtos")
      .join(
        "horario_de_funcionamento as h",
        "promocao_produtos.horarios_tabela",
        "h.id"
      )
      .select(
        "promocao_produtos.descricao as pp_descricao",
        "promocao_produtos.preco as pp_preco",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .where("promocao_produtos.produto_id", id)
      .then(function (rows) {
        if (!rows.length === 0) {
          return rows;
        }
        for (let x = 0; x < rows.length; x++) {
          rows[x].numero = x + 1;
          rows[x].horarios = {};
          for (const [key, value] of Object.entries(rows[x])) {
            if (key.split("_")[0] === "pp") {
              const nome = key.split("_")[1];
              rows[x][nome] = value;
              delete rows[x][key];
            }
            if (key.split("_")[x] === "h") {
              const nome = key.split("_")[1];
              if (value) {
                rows[x].horarios[nome] = value;
              }
              delete rows[x][key];
            }
          }
        }
        return rows;
      });

    const objResults = { ...localizarProduto, promocoes };
    return res.status(200).json(objResults);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const listRestaurant = async (req, res) => {
  const { restaurantId: restaurante } = req.params;
  try {
    const existeRestaurante = await knex("restaurantes")
      .where({
        id: restaurante,
      })
      .first();

    if (!existeRestaurante) {
      return res.status(404).json({ message: "restaurante não localizado" });
    }
    const produtosEncontrados = await knex("produtos")
      .join("promocao_produtos as pp", "produtos.id", "pp.produto_id")
      .join("horario_de_funcionamento as h", "pp.horarios_tabela", "h.id")
      .select(
        "produtos.nome as p_nomeDoProduto",
        "produtos.preco as p_precos",
        "produtos.categoria as p_categoria",
        "pp.descricao as pp_descricao",
        "pp.preco as pp_preco",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .where("produtos.restaurante", restaurante)
      .then(function (rows) {
        if (!rows.length === 0) {
          return rows;
        }
        for (let x = 0; x < rows.length; x++) {
          rows[x].numeroDoProduto = x + 1;
          rows[x].promo = {};
          rows[x].promo.numero = x + 1;
          rows[x].promo.horarios = {};
          for (const [key, value] of Object.entries(rows[x])) {
            if (key.split("_")[0] === "pp") {
              const nome = key.split("_")[1];
              rows[x].promo[nome] = value;
              delete rows[x][key];
            }
            if (key.split("_")[0] === "h") {
              const nome = key.split("_")[1];
              if (value) {
                rows[x].promo.horarios[nome] = value;
              }
              delete rows[x][key];
            }
            if (key.split("_")[0] === "p") {
              const nome = key.split("_")[1];
              rows[x][nome] = value;
              delete rows[x][key];
            }
          }
        }
        return rows;
      });

    return res.status(200).json(produtosEncontrados);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listAllProducts = async (req, res) => {
  try {
    const todosOsProdutosComSeusRestaurantes = await knex("produtos")
      .join("restaurantes as r", "produtos.restaurante", "r.id")
      .join("horario_de_funcionamento as h", "r.horarios", "h.id")
      .select(
        "r.nome as r_restauranteNome",
        "r.email as r_email",
        "r.foto as r_foto",
        "r.endereco as r_endereco",
        "produtos.nome as p_nome",
        "produtos.preco as p_precos",
        "produtos.categoria as p_categoria",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .then(function (rows) {
        if (rows.length === 0) {
          return rows;
        }
        for (let x = 0; x < rows.length; x++) {
          rows[x].restaurante = {};
          rows[x].restaurante.horariosFuncionamento = {};
          rows[x].restaurante.diasFechado = [];
          for (const [key, value] of Object.entries(rows[x])) {
            if (key.split("_")[0] === "h") {
              const nome = key.split("_")[1];
              if (value) {
                rows[x].restaurante.horariosFuncionamento[nome] = value;
              }
              if (!value) {
                rows[x].restaurante.diasFechado.push(nome);
              }
              delete rows[x][key];
            }
            if (key.split("_")[0] === "r") {
              const nome = key.split("_")[1];
              rows[x].restaurante[nome] = value;
              delete rows[x][key];
            }
            if (key.split("_")[0] === "p") {
              const nome = key.split("_")[1];
              rows[x][nome] = value;
              delete rows[x][key];
            }
          }
        }
        return rows;
      });

    return res.status(200).json(todosOsProdutosComSeusRestaurantes);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  create,
  data,
  update,
  listAllProducts,
  listRestaurant,
  del,
  newPromotion,
};
