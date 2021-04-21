import {Request, Response} from 'express';
import pool from '../db/db';

const getAll = (request: Request, response: Response) => {
  const query = `SELECT * FROM Veiculo`;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      response.send(res.rows);
    }
  });
};

const getById = (request: Request, response: Response) => {
  const {id} = request.params;

  const query = `SELECT * FROM Veiculo WHERE Id = ${id}`;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      response.send(res.rows[0]);
    }
  });
};

const deleteById = (request: Request, response: Response) => {
  const {id} = request.body;

  const query = `DELETE FROM PosicaoVeiculo 
    WHERE VeiculoId = ${id};`;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      const secondQuery = `DELETE FROM Veiculo WHERE Id = ${id} RETURNING *`;
      pool.query(secondQuery, (err, res) => {
        if (err) {
          response.status(400).send(err.stack);
        } else {
          response.send(res.rows[0]);
        }
      });
    }
  });
};

const update = (request: Request, response: Response) => {
  const {id, name, modelo, linhaId} = request.body;
  if (!id) {
    response.status(400).send({error: 'ID not provided'});
  }
  let query = `UPDATE Veiculos SET`;

  if (name) {
    query += `
      name = '${name}'
    `;
  }
  if (modelo) {
    if (name) {
      query += ', ';
    }

    query += `
      modelo = '${modelo}'
    `;
  }
  if (linhaId) {
    if (modelo || name) {
      query += ', ';
    }

    query += `
      linhaId = ${linhaId}
    `;
  }

  query += `
    WHERE Id = ${id}
    RETURNING * ;
  `;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      response.send(res.rows[0]);
    }
  });
};

const post = (request: Request, response: Response) => {
  const {name, modelo, linhaId} = request.body;

  const query = `INSERT INTO Veiculo(Name, Modelo, LinhaId)
    VALUES ('${name}', '${modelo}', ${linhaId}) RETURNING id;
  `;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      response.send(res.rows[0]);
    }
  });
};

const veiculoPorLinha = (request: Request, response: Response) => {
  const {linhaId} = request.params;

  const query = `SELECT * FROM Veiculo WHERE LinhaId = ${linhaId}`;

  pool.query(query, (err, res) => {
    if (err) {
      response.status(400).send(err.stack);
    } else {
      response.send(res.rows);
    }
  });
};

export default {
  post,
  getAll,
  getById,
  deleteById,
  update,
  veiculoPorLinha,
};
