import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  const chartDefinition = `
  graph TD 
  A[Client] --> B[Load Balancer] 
  B --> C[Server1] 
  B --> D[Server2]
  `;

  return chartDefinition;
});

export const handler = resolver.getDefinitions();
