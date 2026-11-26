
import { pool } from '../config/database';
import {
  CriarMotoristaDTO,
  AtualizarMotoristaDTO,
  ListarMotoristasDTO,
  MotoristaResponseDTO
} from '../dtos/motoristas.dto';

export class MotoristasRepository {
  async getAll(filtros: ListarMotoristasDTO) {
    const { page, limit, nome, sortBy, order } = filtros;
    const valores: unknown[] = [];
    const condicoes: string[] = [];

    if (nome) {
      valores.push(`%${nome}%`);
      condicoes.push(`nome ILIKE $${valores.length}`);
    }

    const where = condicoes.length
      ? `WHERE ${condicoes.join(' AND ')}`
      : '';

    const totalResult = await pool.query(
      `SELECT COUNT(*)::integer AS total FROM motorista ${where}`,
      valores
    );

    const offset = (page - 1) * limit;

    valores.push(limit, offset);

    const result = await pool.query<MotoristaResponseDTO>(
      `SELECT id, nome, cpf, cnh, telefone
       FROM motorista
       ${where}
       ORDER BY ${sortBy} ${order.toUpperCase()}, id ASC
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
    const result = await pool.query<MotoristaResponseDTO>(
      'SELECT id, nome, cpf, cnh, telefone FROM motorista WHERE id = $1',
      [id]
    );

    return result.rows[0] ?? null;
  }

  async create(dados: CriarMotoristaDTO) {
    const result = await pool.query<MotoristaResponseDTO>(
      `INSERT INTO motorista (nome, cpf, cnh, telefone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, cpf, cnh, telefone`,
      [dados.nome, dados.cpf, dados.cnh, dados.telefone ?? null]
    );

    return result.rows[0];
  }

  async update(id: number, dados: AtualizarMotoristaDTO) {
    const result = await pool.query<MotoristaResponseDTO>(
      `UPDATE motorista
       SET nome = $1, cpf = $2, cnh = $3, telefone = $4
       WHERE id = $5
       RETURNING id, nome, cpf, cnh, telefone`,
      [dados.nome, dados.cpf, dados.cnh, dados.telefone ?? null, id]
    );

    return result.rows[0] ?? null;
  }

  async delete(id: number) {
    const result = await pool.query(
      'DELETE FROM motorista WHERE id = $1 RETURNING id',
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}