const mysql = require('../mysql').pool;


// RETORNA TODOS OS PRODUTOS
exports.getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    } 
    conn.query('select * from Produtos;',
    (error, result, fields) => {
      conn.release();
      if(error) {
        return res.status(500).send({ error });
      }
      const response = {
        quantidade: result.length,
        produtos: result.map(produto => {
          return {
            id_produto: produto.id_produto,
            nome: produto.nome,
            preco: produto.preco,
            imagem_produto: produto.imagem_produto,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um produto específico',
              url: `http://localhost:3000/produtos/${produto.id_produto}`
            }
          }
        })
      }
      return res.status(200).send({ response })
    });

  });
}

// INSERE UM PRODUTO
exports.postProduto = (req, res, next) => {
  console.log(req.usuario);
  const { nome, preco } = req.body;
  const imagem_produto = req.file.path;

  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    }
    conn.query('insert into Produtos(nome, preco, imagem_produto) values (?, ?, ?);',
    [nome, preco, imagem_produto], 
    (error, result, fields) => {
      conn.release();

      if(error) {
        return res.status(500).send({ error: error, response: null });
      }
      const response = {
        mensagem: 'Produto inserido com sucesso',
        produtoCriado: {
          id_produto: result.id_produto,
          nome: nome,
          preco: preco,
          imagem_produto,
          request: {
            tipo: 'GET',
            descricao: 'Retorna todos os produtos',
            url: `http://localhost:3000/produtos`
          }
        }
      }
      res.status(201).send(response);
    });
  })
}

// RETORNA DADOS DE UM PRODUTO
exports.getUmProduto = (req, res, next) => {
  const id = req.params.id_produto;

  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    }

    conn.query('select * from Produtos where id_produto = ?;',
    [id],
    (error, result, fields) => {
      conn.release();
      if(error) {
        return res.status(500).send({ error });
      }
      if(result.length == 0){
        return res.status(404).send({ mensagem: 'Não foi encontrado um produto com este id' });
      }
      const response = {
        produto: {
          id_produto: result[0].id_produto,
          nome: result[0].nome,
          preco: result[0].preco,
          imagem_produto: result[0].imagem_produto,
          request: {
            tipo: 'GET',
            descricao: 'Retorna todos os produtos',
            url: `http://localhost:3000/produtos`
          }
        }
      }
      return res.status(200).send(response);
    })
  })
}

// ALTERA UM PRODUTO
exports.updateProduto = (req, res, next) => {
  const { id_produto, nome, preco } = req.body;

  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `update Produtos
        set nome = ?, preco = ?
        where id_produto = ?`,
      [nome, preco, id_produto],
      (error, result, fields) => {
        conn.release();
        if(error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: 'Produto atualizado com sucesso',
          produtoCriado: {
            id_produto: id_produto,
            nome: nome,
            preco: preco,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um produto específico',
              url: `http://localhost:3000/produtos/${id_produto}`
            }
          }
        }
        return res.status(202).send(response);
      }
    );
  });
}

// EXCLUI UM PRODUTO
exports.deleteProduto = (req, res, next) => {
  const id = req.body.id_produto;

  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    }

    conn.query('delete from Produtos where id_produto = ?',
    [id],
    (error, result, fields) => {
      conn.release();
      if(error) {
        return res.status(500).send({ error });
      }
      const response = {
        mensagem: 'Produto removido com sucesso',
        request: {
          tipo: 'POST',
          descricao: 'Insere um produto',
          url: 'http://localhost:3000/produtos',
          body: {
            nome: 'String',
            preco: 'Number'
          }
        }
      }
      return res.status(202).send(response);
    })
  })
}