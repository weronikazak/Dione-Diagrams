// Import necessary libraries and modules
import ForgeUI, { render, ContentAction, useState } from "@forge/ui";
import { useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";
import { Configuration, OpenAIApi } from "openai";
import tty from "tty";

// Define the main component of the app
const App = async () => {
  // Get the current context (e.g., Confluence page) information
  const context = useProductContext();
  const pageId = context.contentId;

  // Use state to fetch and store page data asynchronously
  var pageContent = await getPageContent(pageId);

  // Search for content that sits between the <dione ...> tags
  const regex = /\<dione(\s+\w+)?\>([\s\S]*?)\<\/dione\>/g;
  let command;
  while ((command = regex.exec(pageContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (command.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // Log the matched content for debugging purposes
    const commandType = assignType(command[0].replace(" ", ""));
    const commandData = command[1];

    const prompt = `Generate a MermaidJS syntax for a diagram of type ${commandType}. The diagram should illustrate this task: "${commandData}". Choose the appropriate title. The response shouldn't contain anything apart from the snippet. No extra text or JavaScript formatting.`;

    console.log("prompt " + prompt);

    // Get response from OpenAI API
    const response = await callOpenAI(prompt);

    console.log("response " + response);

    // Create a html snippet to be inserted into the page
    const snippet = `<html>
    <body>
      <pre class="mermaid">
      ${response}  
      </pre>
      <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
  </html>
  <br/>`;

    // Append the generated snippet before the <dione ...> tag
    const updatedContent = pageContetn.replace(
      command,
      snippet + command.replace(/<dione.*?>/g, "")
    );
    // Remove the <dione ...> tag
    pageContent = updatedContent;
  }
  // const dioneCommands = pageContent.match(/<dione.*?>.*?<\/dione>/g);

  // Log the filtered lines for debugging purposes
  console.log("dioneCommands " + dioneCommands);
  if (!dioneCommands) {
    return null;
  }

  // Update the page content
  const updatePageContent = async () => {
    const response = await api
      .asApp()
      .requestConfluence(route`/wiki/api/v2/pages/${pageId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pageId,
          type: "page",
          title: context.contentTitle,
          space: {
            key: context.spaceKey,
          },
          body: {
            storage: {
              value: pageContent,
              representation: "storage",
            },
          },
        }),
      });

    // Log the response status and text
    console.log(`Response: ${response.status} ${response.statusText}`);

    // Parse and return the response JSON
    const responseJson = await response.json();

    return responseJson;
  };

  return null;
};

// Render the main component within a ContentAction
export const run = render(
  <ContentAction>
    <App />
  </ContentAction>
);

const assignType = (type) => {
  if (type === "flowchart") {
    return "flowchart";
  } else if (type === "sequence") {
    return "sequenceDiagram";
  } else if (type === "class") {
    return "classDiagram";
  } else if (type === "state") {
    return "stateDiagram-v2";
  } else if (type === "gantt") {
    return "gantt";
  } else if (type === "pie") {
    return "pie";
  }
  return "error";
};

// Function to fetch page data from Confluence
const getPageContent = async (pageId) => {
  const response = await api
    .asUser()
    .requestConfluence(
      route`/wiki/api/v2/pages/${pageId}?body-format=storage`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

  // Log the response status and text
  console.log(`Response: ${response.status} ${response.statusText}`);

  // Extract and return the content of the page
  const responseData = await response.json();
  const returnedData = responseData.body.storage.value;

  return returnedData;
};

// Function to interact with the OpenAI API using a given prompt
const callOpenAI = async (prompt) => {
  // Polyfilling tty.isatty due to a limitation in the Forge runtime
  // This is done to prevent an error caused by a missing dependency
  tty.isatty = () => {
    return false;
  };

  // Create a configuration object for OpenAI API
  const configuration = new Configuration({
    apiKey: "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", // Replace with your actual API key
    // organisation: process.env.OPEN_ORG_ID     // Replace with your actual organisation ID
  });

  // Log the API configuration for debugging purposes
  console.log(configuration);

  // Create an instance of the OpenAIApi with the provided configuration
  const openai = new OpenAIApi(configuration);

  // Log the prompt that will be sent to the OpenAI API
  console.log(prompt);

  // Create a chat completion request using the OpenAI API
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", // Specify the model to use (GPT-3.5 Turbo)
    messages: [
      {
        role: "user", // Role of the user in the conversation
        content: prompt, // The user's input prompt
      },
    ],
  });

  // Extract the response content from the API response
  const response = chatCompletion.data.choices[0].message.content;

  // Log the generated response for debugging purposes
  console.log("Prompt response - " + response);

  // Return the generated response from the OpenAI API
  return response;
};
