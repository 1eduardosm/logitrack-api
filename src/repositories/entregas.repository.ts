import { Pool } from 'pg';
import type { CriarEntregaDTO, AtualizarEntregaDTO, ListarEntregasDTO, EntregaResponseDTO } from '../dtos/entregas.dto';

// Pool separado para tornar este pacote independente do nome exportado
// em src/config/database.ts. Pode ser substituído pelo pool compartilhado.
const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'logitrack',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD
});

const colunas = `id, descricao, endereco_destino,
  to_char(data_entrega, 'YYYY-MM-DD') AS data_entrega,
  status, motorista_id, veiculo_id`;

export class EntregasRepository {
  async getAll(filtros: ListarEntregasDTO) {
    const condicoes: string[] = [];
    const valores: unknown[] = [];

    if (filtros.status !== undefined) {
      valores.push(filtros.status);
      condicoes.push(`status = $${valores.length}`);
    }
    if (filtros.motorista_id !== undefined) {
      valores.push(filtros.motorista_id);
      condicoes.push(`motorista_id = $${valores.length}`);
    }
    if (filtros.veiculo_id !== undefined) {
      valores.push(filtros.veiculo_id);
      condicoes.push(`veiculo_id = $${valores.length}`);
    }

    const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
    const totalResult = await pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM entrega ${where}`, valores
    );
    const total = Number(totalResult.rows[0].total);

    // sortBy/order já são validados por enums do Zod; nenhuma entrada arbitrária entra no SQL.
    const offset = (filtros.page - 1) * filtros.limit;
    const params = [...valores, filtros.limit, offset];
    const resultado = await pool.query<EntregaResponseDTO>(
      `SELECT ${colunas} FROM entrega ${where}
       ORDER BY ${filtros.sortBy} ${filtros.order.toUpperCase()}, id ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      data: resultado.rows,
      pagination: {
        page: filtros.page,
        limit: filtros.limit,
        total,
        totalPages: Math.ceil(total / filtros.limit)
      }
    };
  }

  async getOne(id: number): Promise<EntregaResponseDTO | null> {
    const resultado = await pool.query<EntregaResponseDTO>(
      `SELECT ${colunas} FROM entrega WHERE id = $1`, [id]
    );
    return resultado.rows[0] ?? null;
  }

  async create(dados: CriarEntregaDTO): Promise<EntregaResponseDTO> {
    const resultado = await pool.query<EntregaResponseDTO>(
      `INSERT INTO entrega
        (descricao, endereco_destino, data_entrega, status, motorista_id, veiculo_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${colunas}`,
      [dados.descricao, dados.endereco_destino, dados.data_entrega ?? null,
       dados.status, dados.motorista_id, dados.veiculo_id]
    );
    return resultado.rows[0];
  }

  async update(id: number, dados: AtualizarEntregaDTO): Promise<EntregaResponseDTO | null> {
    const resultado = await pool.query<EntregaResponseDTO>(
      `UPDATE entrega SET descricao = $2, endereco_destino = $3,
         data_entrega = $4, status = $5, motorista_id = $6, veiculo_id = $7
       WHERE id = $1 RETURNING ${colunas}`,
      [id, dados.descricao, dados.endereco_destino, dados.data_entrega ?? null,
       dados.status, dados.motorista_id, dados.veiculo_id]
    );
    return resultado.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const resultado = await pool.query('DELETE FROM entrega WHERE id = $1', [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}
