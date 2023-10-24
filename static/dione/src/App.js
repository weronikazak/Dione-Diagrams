import Mermaid from './mermaid';
import {useState, useEffect } from 'react';
import { useProductContext, } from '@forge/ui';
import { invoke } from '@forge/bridge';

function App() {
  const context = useProductContext();
  const contentId = context.contentId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 

  console.log('contentId ' + contentId);
  console.log('context ' + JSON.stringify(context));

  useEffect(() => {
    async function fetchData() {
      // Call the resolver function to get data processed by OpenAI.
      await invoke('processWithOpenAI', { contentId: contentId })
        .then((res) => {
          setData(res.data);
          setLoading(false); // Set loading to false once data is fetched.
        })
        .catch(() => {
          setLoading(false); // Set loading to false if there's an error.
          setError(true); // Set error to true if there's an error.
        });
    }

    fetchData();
  }, [contentId]);

  const failedLoad = `graph LR
  A[🌐 Page Load Attempt]
  B[❌ Page Failed to Load]
  C[😞 Unhappy User]
  A --> B
  B --> C`;

  if (loading) {
    return <h1>Loading...</h1>; // Show loading text while waiting for data.
  }

  if (error) {
    return (
      <div>
        <h3>Failed to load!</h3>
        <Mermaid key={failedLoad} chart={failedLoad} />
      </div>
    );
  }

  return (
    <div>
      <h3>Generated Graph:</h3>
      <Mermaid key={data} chart={data} />
    </div>
  );
}

export default App;
