const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  try {
    const docs = await prisma.doctor.findMany({
      include: {
        department: true,
        user: true,
      },
    });
    console.log("DOCTORS IN SUPABASE:");
    docs.forEach((d) => {
      console.log(`ID: ${d.doctor_id} | User full_name: "${d.user?.full_name}" | Dept: "${d.department?.dept_name}" | Room: "${d.opd_room}"`);
    });
  } catch (err) {
    console.error("DB ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
