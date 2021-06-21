const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// CADASTRA USUÁRIO
exports.cadastrarUsuario = (req, res, next) => {
  const { email, senha } = req.body;

  mysql.getConnection((error, conn) => {
    if(error) return res.status(500).send({ error });

    conn.query('select * from usuarios where email = ?;',
    [email],
    (error, results) => {
      if(error) return res.status(500).send({ error });

      if(results.length > 0) {
        res.status(409).send({ mensagem: 'Email já cadastrado' });
      } else {
        bcrypt.hash(senha, 10, (errBcrypt, hash) => {
          if(errBcrypt) return res.status(500).send({ errBcrypt });
    
          conn.query(`insert into usuarios(email, senha) values(?, ?);`,
          [email, hash],
          (error, results) => {
            conn.release();
            if(error) return res.status(500).send({ error });
    
            const response = {
              mensagem: 'Usuário criado com sucesso.',
              usuarioCriado:  {
                id_usuario: results.insertId,
                email
              }
            }
            return res.status(201).send(response);
          });
        });
      }
    })
  });
}

// LOGA USUÁRIO CADASTRADO
exports.loginUsuario = (req, res, next) => {
  const { email, senha } = req.body;

  mysql.getConnection((error, conn) => {
    if(error) return res.status(500).send({ error });

    conn.query(`select * from usuarios where email = ?;`, 
    [email],
    (error, results) => {
      conn.release();
      if(error) return res.status(500).send({ error });
      if(results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' });
      }

      bcrypt.compare(senha, results[0].senha, (error, result) => {
        if(error) return res.status(500).send({ error });

        if(result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            email: results[0].email
          }, 'segredo',
          { expiresIn: '1h' });

          return res.status(200).send({ mensagem: 'Autenticado com sucesso', token });
        }

        return res.status(401).send({ mensagem: 'Falha na autenticação' });
      });
    });
  });
}