import React, { useEffect, useState } from 'react';
import Mermaid from './mermaid';
import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  const failedLoad = `graph TD
  A[🌐 Page Load Attempt]
  B[❌ Page Failed to Load]
  C[😞 Unhappy User]
  A --> B
  B --> C`;

  return (
    <div>
      <h1>{data? data : 'Failed to load!'}</h1>
      {data ? <Mermaid chart={data} /> : <Mermaid chart={failedLoad} /> }
    </div>
  );
}

export default App;
