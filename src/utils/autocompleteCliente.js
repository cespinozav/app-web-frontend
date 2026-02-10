import ClienteService from 'services/Cliente';

export async function buscarClientesAutocomplete(query) {
  const { results } = await ClienteService.get({ search: query, page_size: 10 });
  return results.map(cli => ({ ...cli, description: cli.nombre }));
}
