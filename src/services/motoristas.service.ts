
import { MotoristasRepository } from '../repositories/motoristas.repository';
import {
  CriarMotoristaDTO,
  AtualizarMotoristaDTO,
  ListarMotoristasDTO
} from '../dtos/motoristas.dto';
import { AppError } from '../errors/app-error';

const repository = new MotoristasRepository();

function validarCPF(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  for (let tamanho = 9; tamanho < 11; tamanho++) {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;
    const digito = resto === 10 ? 0 : resto;

    if (digito !== Number(cpf[tamanho])) {
      return false;
    }
  }

  return true;
}

function tratarErroBanco(error: unknown): never {
  const erro = error as { code?: string };

  if (erro?.code === '23505') {
    throw new AppError(409, 'CPF ou CNH já cadastrado');
  }

  if (erro?.code === '23503') {
    throw new AppError(
      409,
      'Motorista possui entregas vinculadas'
    );
  }

  throw error;
}

export class MotoristasService {
  async getAll(filtros: ListarMotoristasDTO) {
    return repository.getAll(filtros);
  }

  async getOne(id: number) {
    const motorista = await repository.getOne(id);

    if (!motorista) {
      throw new AppError(404, 'Motorista não encontrado');
    }

    return motorista;
  }

  async create(dados: CriarMotoristaDTO) {
    if (!validarCPF(dados.cpf)) {
      throw new AppError(422, 'CPF inválido');
    }

    try {
      return await repository.create(dados);
    } catch (error) {
      tratarErroBanco(error);
    }
  }

  async update(id: number, dados: AtualizarMotoristaDTO) {
    if (!validarCPF(dados.cpf)) {
      throw new AppError(422, 'CPF inválido');
    }

    try {
      const motorista = await repository.update(id, dados);

      if (!motorista) {
        throw new AppError(404, 'Motorista não encontrado');
      }

      return motorista;
    } catch (error) {
      tratarErroBanco(error);
    }
  }

  async delete(id: number) {
    try {
      const excluido = await repository.delete(id);

      if (!excluido) {
        throw new AppError(404, 'Motorista não encontrado');
      }
    } catch (error) {
      tratarErroBanco(error);
    }
  }
}
