const { getDoctors } = require("./lib/db");

async function main() {
  const docs = await getDoctors();
  console.log("RESULT FROM getDoctors():");
  docs.forEach((d) => {
    console.log(`ID: ${d.doctor_id} | full_name: "${d.full_name}" | dept: "${d.dept_name}"`);
  });
}

main();
