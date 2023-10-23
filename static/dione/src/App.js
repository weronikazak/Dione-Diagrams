import Mermaid from './mermaid';
import {useState, useEffect } from 'react';
import { useProductContext, } from '@forge/ui';
import { invoke } from '@forge/bridge';

function App() {
  const context = useProductContext(); // This provides context about the Confluence page.
  const contentId = context.contentId; // This is the Confluence page ID.
  const [data, setData] = useState(null); // State to store the result from OpenAI.

  console.log('context ' + JSON.stringify(context));

  useEffect(() => {
    async function fetchData() {
      // Call the resolver function to get data processed by OpenAI.
       await invoke('processWithOpenAI', { contentId: contentId }).then((res) => setData(res.data));
    }

    fetchData();
  }, [contentId]);

  const failedLoad = `graph TD
  A[🌐 Page Load Attempt]
  B[❌ Page Failed to Load]
  C[😞 Unhappy User]
  A --> B
  B --> C`;

  return (
    <div>
      <h1>{data ? data : 'Failed to load!'}</h1>
      {data ? <Mermaid key={data} chart={data} /> : <Mermaid key={failedLoad} chart={failedLoad} /> }
    </div>
  );
}

export default App;
