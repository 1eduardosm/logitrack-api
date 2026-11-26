
type ViaCepResponse = {
  cep?: unknown;
  logradouro?: unknown;
  bairro?: unknown;
  localidade?: unknown;
  uf?: unknown;
  erro?: unknown;
};

export async function consultarCep(cep: string): Promise<string | null> {
  if (!/^\d{8}$/.test(cep)) {
    return null;
  }

  const baseUrl = process.env.VIACEP_BASE_URL ?? 'https://viacep.com.br';

  try {
    const response = await fetch(
      `${baseUrl}/ws/${cep}/json/`,
      { signal: AbortSignal.timeout(2000) }
    );

    if (!response.ok) {
      return null;
    }

    const dados: ViaCepResponse = await response.json();

    if (
      dados === null ||
      typeof dados !== 'object' ||
      dados.erro === true ||
      typeof dados.cep !== 'string' ||
      dados.cep.replace(/\D/g, '') !== cep ||
      typeof dados.logradouro !== 'string' ||
      !dados.logradouro.trim() ||
      typeof dados.localidade !== 'string' ||
      !dados.localidade.trim() ||
      typeof dados.uf !== 'string' ||
      !/^[A-Z]{2}$/.test(dados.uf)
    ) {
      return null;
    }

    const partes = [
      dados.logradouro.trim(),
      typeof dados.bairro === 'string' ? dados.bairro.trim() : '',
      dados.localidade.trim(),
      dados.uf
    ];

    return partes.filter(Boolean).join(', ');
  } catch {
    // Falha externa, timeout ou JSON inválido:
    // devolve null para permitir o fallback.
    return null;
  }
}
