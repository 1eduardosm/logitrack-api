import { EntregasRepository } from '../repositories/entregas.repository';
import type { CriarEntregaDTO, AtualizarEntregaDTO, ListarEntregasDTO } from '../dtos/entregas.dto';
import { AppError } from '../errors/app-error';



function traduzirErroBanco(error: unknown): never {
  const codigo = (error as { code?: string })?.code;
  if (codigo === '23503') {
    throw new AppError(409,'Motorista ou veículo não encontrado');
  }
  if (codigo === '23514') {
    throw new AppError(422,'Dados violam uma regra da entrega');
  }
  throw error;
}

export class EntregasService {
  private repository = new EntregasRepository();

  async getAll(filtros: ListarEntregasDTO) {
    return this.repository.getAll(filtros);
  }

  async getOne(id: number) {
    const entrega = await this.repository.getOne(id);
    if (!entrega) throw new AppError(404,'Entrega não encontrada');
    return entrega;
  }

  async create(dados: CriarEntregaDTO) {
    try {
      return await this.repository.create(dados);
    } catch (error) {
      traduzirErroBanco(error);
    }
  }

  async update(id: number, dados: AtualizarEntregaDTO) {
    try {
      const entrega = await this.repository.update(id, dados);
      if (!entrega) throw new AppError(404,'Entrega não encontrada');
      return entrega;
    } catch (error) {
      traduzirErroBanco(error);
    }
  }

  async delete(id: number) {
    if (!await this.repository.delete(id)) {
      throw new AppError(404,'Entrega não encontrada');
    }
  }
}
