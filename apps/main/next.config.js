module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async rewrites() {
    return [
      {
        source: "/triage",
        destination: "http://localhost:8000",
      },
      {
        source: "/registration",
        destination: "http://localhost:8001/",
      },
      {
        source: "/aetc",
        destination: "http://localhost:8002/",
      },
    ];
  },
};
