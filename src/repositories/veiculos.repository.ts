import { pool } from '../config/database';

import {
  CriarVeiculoDTO,
  AtualizarVeiculoDTO,
  VeiculoResponseDTO,
  ListarVeiculosDTO
} from '../dtos/veiculos.dto';

export class VeiculosRepository {

  async getAll(filtros: ListarVeiculosDTO) {
    const { page, limit, placa, modelo, sortBy, order } = filtros;

    const valores: unknown[] = [];
    const condicoes: string[] = [];

    if (placa) {
      valores.push(`%${placa}%`);
      condicoes.push(`placa ILIKE $${valores.length}`);
    }

    if (modelo) {
      valores.push(`%${modelo}%`);
      condicoes.push(`modelo ILIKE $${valores.length}`);
    }

    const where = condicoes.length
      ? `WHERE ${condicoes.join(' AND ')}`
      : '';

    const totalResult = await pool.query(
      `SELECT COUNT(*)::integer AS total
       FROM veiculo ${where}`,
      valores
    );

    const offset = (page - 1) * limit;

    const colunasPermitidas = [
      'id', 'placa', 'modelo', 'capacidade_kg', 'ano'
    ];

    const coluna = colunasPermitidas.includes(sortBy)
      ? sortBy
      : 'id';

    const direcao = order === 'desc' ? 'DESC' : 'ASC';

    valores.push(limit, offset);

    const result = await pool.query<VeiculoResponseDTO>(
      `SELECT id, placa, modelo,
              capacidade_kg::float8 AS capacidade_kg, ano
       FROM veiculo
       ${where}
       ORDER BY ${coluna} ${direcao}, id ASC
       LIMIT $${valores.length - 1}
       OFFSET $${valores.length}`,
      valores
    );

    const total = totalResult.rows[0].total;

    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOne(id: number) {
    const result = await pool.query<VeiculoResponseDTO>(
      `SELECT id, placa, modelo,
              capacidade_kg::float8 AS capacidade_kg, ano
       FROM veiculo
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  async getByPlaca(placa: string) {
    const result = await pool.query<VeiculoResponseDTO>(
      `SELECT id, placa, modelo,
              capacidade_kg::float8 AS capacidade_kg, ano
       FROM veiculo
       WHERE UPPER(placa) = $1`,
      [placa.toUpperCase()]
    );

    return result.rows[0] ?? null;
  }

  async create(dados: CriarVeiculoDTO) {
    const result = await pool.query<VeiculoResponseDTO>(
      `INSERT INTO veiculo
       (placa, modelo, capacidade_kg, ano)
       VALUES ($1, $2, $3, $4)
       RETURNING id, placa, modelo,
                 capacidade_kg::float8 AS capacidade_kg, ano`,
      [
        dados.placa,
        dados.modelo,
        dados.capacidade_kg,
        dados.ano
      ]
    );

    return result.rows[0];
  }

  async update(id: number, dados: AtualizarVeiculoDTO) {
    const result = await pool.query<VeiculoResponseDTO>(
      `UPDATE veiculo
       SET placa = $1,
           modelo = $2,
           capacidade_kg = $3,
           ano = $4
       WHERE id = $5
       RETURNING id, placa, modelo,
                 capacidade_kg::float8 AS capacidade_kg, ano`,
      [
        dados.placa,
        dados.modelo,
        dados.capacidade_kg,
        dados.ano,
        id
      ]
    );

    return result.rows[0] ?? null;
  }

  async delete(id: number) {
    const result = await pool.query(
      'DELETE FROM veiculo WHERE id = $1 RETURNING id',
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}