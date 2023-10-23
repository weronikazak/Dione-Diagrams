import React, { useEffect, useState } from 'react';
import Mermaid from './mermaid';
// import { invoke } from '@forge/bridge';

function App() {
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  // }, []);

  const d = `
  graph TD 
  A[Client] --> B[Load Balancer] 
  B --> C[Server1] 
  B --> D[Server2]
  `;

  return (
    <div>
      <Mermaid chart={d} />
    </div>
  );
}

export default App;
