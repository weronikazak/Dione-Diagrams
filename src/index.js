import Resolver from '@forge/resolver';
import { OpenAIApi, Configuration } from 'openai';
import api, { route } from "@forge/api";
import tty from 'tty';

const OPENAI_API_KEY = "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";

const resolver = new Resolver();

resolver.define('processWithOpenAI', async ({ contentId }) => {
  console.log('contentId ' + contentId);
  if (!contentId) {
    contentId = '1966121';
  }
  // Fetch Confluence page content
  const contentResponse = await api.asApp().requestConfluence(route`/wiki/rest/api/content/${contentId}?expand=body.storage`);
  
  console.log('contentResponse ' + JSON.stringify(contentResponse));
  
  const contentData = await contentResponse.json();
  const pageContent = contentData.body.storage.value;

  console.log('pageContent ' + pageContent);

  const prompt = `Generate a MermaidJS syntax to create an appropriate graph for this task: "${pageContent}". The response shouldn't contain anything apart from the snippet. No extra text or JavaScript formatting.`;

  tty.isatty = () => { return false };

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,          // Replace with your actual API key
    organisation: 'org-6kKQzWIJ9eFzq5KuSvadLS1y'     // Replace with your actual organisation ID
  });

  const openai = new OpenAIApi(configuration);

  // Send content to OpenAI using gpt-3.5-turbo
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",         // Role of the user in the conversation
      content: prompt       // The user's input prompt
    }]
  });

  const response = chatCompletion.data.choices[0].message.content;
  console.log('response ' + response);
  return {
    data: response
  };
});

export const handler = resolver.getDefinitions();