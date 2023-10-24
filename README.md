<img src="https://raw.githubusercontent.com/weronikazak/Dione-VSC-Extension/main/public/images/dione-rep.png">

# Dione Diagrams

A Confluence Extension to help you create graphs on the fly.

## How to Use:

1. Login to your Atlassian account and go to Confluence.

2. Create or edit a page and write a description of the graph.

3. Click on the **[+]** icon at the end of your top bar.

4. Search for ***Dione Diagrams***.

5. Click on it and watch the magic happen!

## How to Run Locally:

1. Install Atlassian's Forge. Follow the instructions [here](https://developer.atlassian.com/platform/forge/getting-started/) to set up and login with Forge.

2. Clone this repository on your computer.

3. Open a console and type `cd Dione-Diagrams`. Run `npm i` command to install missing packages.

4. Go to `manifest.yml`. **Change the id of your app to the Forge application you have created in step 1.**

5. Go to `src/index.js`. Change the two variables `OPENAI_API_KEY` and `ORG_ID` to the your OpenAI key and Organisation ID. You can get these information from your console on OpenAI.

6. On the top of the file is another variable called `PAGEID`. Replace its value with the ID of the page, which you want to get the content from.

7. Open a console and type `cd ../static/dione`. Then `npm i`. It will install all the modules you need for the React App. Run `npm run build`.

8. Deploy and install your application and use in your account!

## Examples:

<img src="https://raw.githubusercontent.com/weronikazak/Dione-VSC-Extension/main/public/images/code-documentation.gif">

## Contact:

**Spotted an issue? [Report it here.](https://github.com/weronikazak/Dione-Diagrams)**