import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  const chartDefinition = `
  graph TD;
  A -> B;
  A -> C;
  B -> D;
  C -> D;
  `;

  return chartDefinition;
});

export const handler = resolver.getDefinitions();
