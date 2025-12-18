const triviaSchema = {
  type: "object",
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "question", "answer", "category"],
        properties: {
          id: {
            type: "number",
          },
          question: {
            type: "string",
            minLength: 1,
          },
          answer: {
            type: "string",
            minLength: 1,
          },
          category: {
            type: "object",
            required: ["main", "sub", "subsub"],
            properties: {
              main: {
                type: "string",
                minLength: 1,
              },
              sub: {
                type: "string",
                minLength: 1,
              },
              subsub: {
                type: "string",
                minLength: 1,
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { triviaSchema };
