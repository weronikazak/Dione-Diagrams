// Import necessary libraries and modules
import ForgeUI, { render, ContentAction, useState } from "@forge/ui";
import { useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";
import { Configuration, OpenAIApi } from "openai";
import { invoke, api as apiBridge } from "@forge/bridge";

// Define the main component of the app
const App = async () => {
  // Get the current context (e.g., Confluence page) information
  const context = useProductContext();
  const pageId = context.contentId;

  console.log("pageId " + pageId);

  // Use state to fetch and store page data asynchronously
  const [pageContent] = useState(async () => {
    return await getPageData(pageId);
  });

  // console.log("pageContent " + pageContent);

  // Search for content that sits between the <dione ...> tags
  const regex = /\<dione(\s+\w+)?\>([\s\S]*?)\<\/dione\>/g;
  let command = pageContent.match(regex);

  console.log("command " + command);

  // Log the matched content for debugging purposes
  const commandType = "flowchart";
  const commandData = command[1];

  const prompt = `Generate a MermaidJS syntax for a diagram of type ${commandType}. The diagram should illustrate this task: "${commandData}". Choose the appropriate title. The response shouldn't contain anything apart from the snippet. No extra text or JavaScript formatting.`;

  console.log("prompt " + prompt);

  // Get response from OpenAI API
  // const response = await callOpenAI(prompt);
  const response = `flowchart TD
  title[Atlassian Forge API Work]
  start[Start]
  setup[Setup Forge Environment]
  develop[Develop Forge App]
  api_call[Make API Call to Atlassian Service]
  response[Receive Response]
  process[Process Data]
  end[End]

  start --> setup
  setup --> develop
  develop --> api_call
  api_call --> response
  response --> process
  process --> end
  `;

  console.log("response " + response);

  const pngData = await getConvertedPng(response);
  const uploadResult = await uploadImageToConfluence(pngData, pageId);
  const attachmentId = uploadResult.results[0].id; // Assuming the upload was successful

  await insertImageIntoPageContent(pageId, attachmentId);

  return null;
};

// Function to fetch page data from Confluence
const getPageData = async (pageId) => {
  const response = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${pageId}?body-format=storage`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  // Log the response status and text
  console.log(`Response: ${response.status} ${response.statusText}`);

  // Extract and return the content of the page
  const responseData = await response.json()
  const returnedData = responseData.body.storage.value
  
  return returnedData
}


async function uploadImageToConfluence(pngBuffer, pageId) {
  const apiUrl = `/wiki/rest/api/content/${pageId}/child/attachment`;

  const formData = new FormData();
  formData.append('file', pngBuffer, {
      filename: 'screenshot.png',
      contentType: 'image/png',
  });

  const response = await apiBridge.asApp().requestConfluence(apiUrl, {
      method: 'POST',
      headers: {
          'X-Atlassian-Token': 'no-check',
      },
      body: formData,
  });

  return response.json();
}

async function insertImageIntoPageContent(pageId, attachmentId) {
  // First, get the current content of the page
  const pageResponse = await api.asApp().requestConfluence(`/wiki/rest/api/content/${pageId}?expand=body.storage`);
  const pageData = await pageResponse.json();
  const currentContent = pageData.body.storage.value;

  // Construct the image markup for Confluence
  const imageUrl = `/wiki/download/attachments/${pageId}/${attachmentId}`;
  const imageMarkup = `<ac:image><ri:attachment ri:filename="screenshot.png" ri:version="1" /></ac:image>`;

  // Append (or insert) the image markup to the current content
  const newContent = currentContent + imageMarkup;

  // Update the page with the new content
  const updateResponse = await api.asApp().requestConfluence(`/wiki/rest/api/content/${pageId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          version: {
              number: pageData.version.number + 1,
          },
          title: pageData.title,
          type: 'page',
          body: {
              storage: {
                  value: newContent,
                  representation: 'storage',
              },
          },
      }),
  });

  return updateResponse.json();
}

async function getConvertedPng(htmlContent) {
  const response = await apiBridge.fetch(
    "dione-vsc.vercel.app/convert",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mermaid: htmlContent,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to convert HTML to PNG");
  }

  const pngBuffer = await response.arrayBuffer();
  return new Uint8Array(pngBuffer);
}

// Render the main component within a ContentAction
export const run = render(
  <ContentAction>
    <App />
  </ContentAction>
);
