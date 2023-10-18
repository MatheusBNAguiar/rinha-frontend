self.onmessage = function (event) {
  const file = event.data;

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const blob = new Blob([e.target.result]);
      const stream = blob.stream();

      readStreamAsText(stream).then((text) => {
        const jsonData = JSON.parse(text);
        self.postMessage(jsonData);
      });
    };

    reader.readAsArrayBuffer(file);
  }
};

async function readStreamAsText(stream) {
  const textDecoder = new TextDecoder();
  let text = '';
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return text;
      }
      text += textDecoder.decode(value);
    }
  } finally {
    reader.releaseLock();
  }
}
