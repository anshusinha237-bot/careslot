import { checkDbConnection, getDoctors } from "../lib/db.js";

async function main() {
  console.log("Checking DB connection...");
  const conn = await checkDbConnection();
  console.log("Connection result:", conn);

  console.log("Fetching doctors...");
  const docs = await getDoctors();
  console.log("Fetched doctors count:", docs.length);
  docs.forEach(d => console.log(`- ${d.full_name} (${d.dept_name})`));
}

main();
