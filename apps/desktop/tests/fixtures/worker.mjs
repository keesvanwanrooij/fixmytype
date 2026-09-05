// A synthetic hostile or stalled peer. Never run against a user's document.
import process from "node:process";
process.stdin.once("data", (line) => {
  const request = JSON.parse(line);
  const response = {
    version: 1,
    id: request.id,
    state: "idle",
    epoch: 0,
    target: null,
  };
  switch (process.argv[2]) {
    case "hang":
      return;
    case "oversized":
      process.stdout.write("x".repeat(4097));
      return;
    case "version":
      response.version = 2;
      break;
    case "state":
      response.state = ["idle"];
      break;
    case "unknown":
      response.extra = "secret";
      break;
    case "id":
      response.id++;
      break;
    case "write":
      response.target = {
        target_id: "1:abc",
        document_id: null,
        kind: "plain",
        read_selection: false,
        replace_range: true,
      };
      break;
    case "crash":
      process.exit(1);
  }
  process.stdout.write(JSON.stringify(response) + "\n");
});
process.stdin.on("end", () => process.exit(0));
