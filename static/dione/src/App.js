import React, { useEffect, useState } from 'react';
import Mermaid from './mermaid';
import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  const d = `graph TD 
  A[Client] -->|tcp_123| B
  B(Load Balancer) 
  B -->|tcp_456| C[Server1] 
  B -->|tcp_456| D[Server2]`;

  return (
    <div>
      <h1>{data? data : d}</h1>
      {data ? <Mermaid chart={data} /> : <Mermaid chart={d} /> }
    </div>
  );
}

export default App;
