import { z } from 'zod';

export const criarVeiculoSchema = z.object({
  placa: z.string()
    .trim()
    .min(1, 'Placa obrigatória')
    .max(10)
    .toUpperCase(),

  modelo: z.string()
    .trim()
    .min(1, 'Modelo obrigatório')
    .max(100),

  capacidade_kg: z.number()
    .min(0.01, 'A capacidade deve ser positiva')
    .max(99999999.99),

  ano: z.number()
    .int()
    .min(1900)
    .max(2100)
}).strict();

export const atualizarVeiculoSchema = criarVeiculoSchema;

export const veiculoResponseSchema = criarVeiculoSchema.extend({
  id: z.number().int().positive()
});

export const veiculoParamsSchema = z.object({
  id: z.coerce.number()
    .int()
    .positive()
    .max(2147483647)
});

export const listarVeiculosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  placa: z.string().trim().optional(),

  modelo: z.string().trim().optional(),

  sortBy: z.enum([
    'id',
    'placa',
    'modelo',
    'capacidade_kg',
    'ano'
  ]).default('id'),

  order: z.enum(['asc', 'desc']).default('asc')
});

export type CriarVeiculoDTO =
  z.infer<typeof criarVeiculoSchema>;

export type AtualizarVeiculoDTO =
  z.infer<typeof atualizarVeiculoSchema>;

export type VeiculoResponseDTO =
  z.infer<typeof veiculoResponseSchema>;

export type ListarVeiculosDTO =
  z.infer<typeof listarVeiculosSchema>;