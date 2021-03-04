import { Database } from "sqlite";
import { createWorker } from "tesseract.js";

const worker = createWorker({
  logger: (m) => console.log(m),
});

class OCRService {
  constructor(db: Database) {}

  async queue() {}

  async imgToText() {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(
      "https://tesseract.projectnaptha.com/img/eng_bw.png"
    );
    console.log(text);
    await worker.terminate();
  }

  PpfToTImg() {}
}
