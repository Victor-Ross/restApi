const mysql = require('../mysql').pool;


// RETORNA TODOS OS PEDIDOS
exports.getPedidos = (req, res, next) => {

  mysql.getConnection((error, conn) => {
    if(error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `SELECT pedidos.id_pedido, pedidos.quantidade, produtos.id_produto, produtos.nome, produtos.preco
      FROM pedidos
      INNER JOIN produtos 
      ON produtos.id_produto = pedidos.id_produto;`,
    (error, result, fields) => {
      conn.release();
      if(error) {
        return res.status(500).send({ error });
      }
      const response = {
        pedidos: result.map(pedido => {
          return {
            id_pedido: pedido.id_pedido,
            quantidade: pedido.quantidade,
            produto: {
              id_produto: pedido.id_produto,
              nome: pedido.nome,
              preco: pedido.preco
            },
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um pedido específico',
              url: `http://localhost:3000/pedidos${pedido.id_pedido}`
            }
          }
        }),
        mensagem: 'Lista todos os pedidos'
      }
      return res.status(200).send(response);
    })
  })
}

// INSERE UM PEDIDO
exports.postPedidos = (req, res, next) => {
  const { id_produto, quantidade } = req.body;

  mysql.getConnection((error, conn) => {
    if(error) return res.status(500).send({ error });

    conn.query('select * from Produtos where id_produto = ?',
    [id_produto],
    (error, result, fields) => {
      if(error) return res.status(500).send({ error });
      if(result.length == 0) {
        return res.status(404).send({ mensagem: 'Não foi encontrado nenhum produto com este id' });
      }

      conn.query(
        `insert into Pedidos (quantidade, id_produto) values
        (?, ?)`,
        [quantidade, id_produto],
        (error, result, fields) => {
          conn.release();
          if(error) return res.status(500).send({ error });
          if(result.length == 0) {
            return res.status(404).send({ mensagem: 'Não foi encontrado nenhum pedido com este id' });
          }
  
          const response = {
            mensagem: 'Pedido criado com sucesso',
            pedidoCriado: {
              id_pedido: result.id_pedido,
              id_produto: id_produto,
              quantidade: quantidade,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os pedidos',
                url: 'http://localhost:3000/pedidos'
              }
            }
          }
          return res.status(200).send(response);
        });
    });
  });
}

// RETORNA OS DADOS DE UM PEDIDO
exports.getUmPedido = (req, res, next) => {
  const { id_pedido } = req.params;

  mysql.getConnection((error, conn) => {
    if(error) return res.status(500).send({ error });

    conn.query('select * from Pedidos where id_pedido = ?',
    [id_pedido],
    (error, result, fields) => {
      conn.release();
      if(error) return res.status(500).send({ error });
      if(result.length == 0) {
        return res.status(404).send({ mensagem: 'Não foi encontrado nenhum pedido com este id' });
      }

      const response = {
        pedido: {
          id_pedido: result[0].id_pedido,
          id_produto: result[0].id_produto,
          quantidade: result[0].quantidade,
          request: {
            tipo: 'GET',
            descricao: 'Retorna todos os pedidos',
            url: 'http://localhost:3000/pedidos'
          }
        }
      }
      return res.status(200).send(response);
    })
  })
}

// EXCLUI UM PEDIDO
exports.removePedido = (req, res, next) => {
  const { id_pedido } = req.body;

  mysql.getConnection((error, conn) => {
    if(error) return res.status(500).send({ error });

    conn.query('delete from pedidos where id_pedido = ?;',
    [id_pedido],
    (error, result, fields) => {
      conn.release();
      if(error) return res.status(500).send({ error });

      const response = {
        Mensagem: 'Pedido removido com sucesso',
        request: {
          tipo: 'POST',
          descricao: 'Criar um pedido',
          url: 'http://localhost:3000/pedidos',
          body: {
            id_produto: 'Number',
            quantidade: 'Number'
          }
        }
      }
      return res.status(200).send(response);
    })
  });
}