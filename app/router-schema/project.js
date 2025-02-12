module.exports = {
  "/api/project/getlist": {
    post: {
      body: {
        type: "object",
        properties: {
          page: { type: "number" },
          pageSize: { type: "number" },
        },
        required: ["page", "pageSize"],
      },
    },
  },
};
