// dependencies
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const inquirer = require('inquirer');
require('dotenv').config();

// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0,
  model: 'gpt-3.5-turbo'
});

//console.log({model});

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Javascript code that answers the user's question",
  explanation: "detailed explanation of the example code provided",
});

const formatInstructions = parser.getFormatInstructions();

// Uses the instantiated OpenAI wrapper, model, and makes a call based on input from inquirer
const promptFunc = async (input) => {
  try {
    const prompt = new PromptTemplate({
      template: "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{format_instructions}\n{question}",
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions }
    });

    const promptInput = await prompt.format({
      question: input
    });

    const res = await model.call(promptInput);
    console.log(await parser.parse(res));
  }
  catch (err) {
    console.error(err);
  }
};

// Initialization function that uses inquirer to prompt the user and returns a promise. It takes the user input and passes it through the call method
const init = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Ask a coding question:',
    },
  ]).then((inquirerResponse) => {
    promptFunc(inquirerResponse.name)
  });
};

// Calls the initialization function and starts the script
init();



/*
notes: 

{ A1:
The [openAIApiKey] property is used to pass in our OpenAI API key to check if a 
project is authorized to use the API and for collecting usage information.

The [temperature] property represents variability in the words selected in a 
response. Temperature ranges from 0 to 1 with 0 meaning higher precision but 
less creativity and 1 meaning lower precision but more variation and creativity.

Finally, the [model] property represents which language model will be used. 
For this project, we will use the [gpt-3.5-turbo] model because it’s optimized 
for chat and the best available option.

}

*/