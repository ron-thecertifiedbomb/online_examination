// common/services/youtubeProgress.js

let clients = [];

export const addClient = (res) => {
  clients.push(res);

  res.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
};

// send progress and optionally a title
export const sendProgress = (percent, title = null) => {
  const payload = JSON.stringify({ progress: percent, title });
  clients.forEach((client) => {
    client.write(`data: ${payload}\n\n`);
  });
};
