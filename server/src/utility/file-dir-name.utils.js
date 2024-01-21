import { fileURLToPath } from "url";
import { dirname } from "path";

export default function fileDirName(fileUrl) {
  const __filename = fileURLToPath(fileUrl);
  const __dirname = dirname(__filename);

  return { __dirname, __filename };
}
