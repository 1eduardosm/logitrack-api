import { VeiculosRepository } from '../repositories/veiculos.repository';
import { AppError } from '../errors/app-error';

import {
  CriarVeiculoDTO,
  AtualizarVeiculoDTO,
  ListarVeiculosDTO
} from '../dtos/veiculos.dto';

export class VeiculosService {
  constructor(
    private repository = new VeiculosRepository()
  ) {}

  async getAll(filtros: ListarVeiculosDTO) {
    return this.repository.getAll(filtros);
  }

  async getOne(id: number) {
    const veiculo = await this.repository.getOne(id);

    if (!veiculo) {
      throw new AppError(404, 'Veículo não encontrado');
    }

    return veiculo;
  }

  async create(dados: CriarVeiculoDTO) {
    const placa = dados.placa.trim().toUpperCase();

    const existente = await this.repository.getByPlaca(placa);

    if (existente) {
      throw new AppError(409, 'Placa já cadastrada');
    }

    try {
      return await this.repository.create({
        ...dados,
        placa
      });
    } catch (error) {
      this.tratarErroBanco(error);
    }
  }

  async update(id: number, dados: AtualizarVeiculoDTO) {
    await this.getOne(id);

    const placa = dados.placa.trim().toUpperCase();

    const existente = await this.repository.getByPlaca(placa);

    if (existente && existente.id !== id) {
      throw new AppError(409, 'Placa já cadastrada');
    }

    try {
      const veiculo = await this.repository.update(id, {
        ...dados,
        placa
      });

      if (!veiculo) {
        throw new AppError(404, 'Veículo não encontrado');
      }

      return veiculo;
    } catch (error) {
      this.tratarErroBanco(error);
    }
  }

  async delete(id: number) {
    try {
      const excluido = await this.repository.delete(id);

      if (!excluido) {
        throw new AppError(404, 'Veículo não encontrado');
      }
    } catch (error) {
      this.tratarErroBanco(error);
    }
  }

  private tratarErroBanco(error: unknown): never {
    const codigo = (error as { code?: string } | null)?.code;

    if (codigo === '23505') {
      throw new AppError(409, 'Placa já cadastrada');
    }

    if (codigo === '23503') {
      throw new AppError(
        409,
        'Veículo possui entregas vinculadas'
      );
    }

    throw error;
  }
}