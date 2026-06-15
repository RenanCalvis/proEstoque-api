import { prisma } from './client';

async function main() {
  const categorias = [
    { nome: 'Alimentos' },
    { nome: 'Bebidas' },
    { nome: 'Limpeza' },
    { nome: 'Higiene' },
    { nome: 'Outros' },
  ];

  console.log('🌱 Iniciando seed...');

  for (const c of categorias) {
    const existe = await prisma.categoria.findFirst({ where: { nome: c.nome } });
    if (!existe) {
      await prisma.categoria.create({ data: c });
      console.log(`✅ Categoria ${c.nome} criada.`);
    } else {
      console.log(`⚠️ Categoria ${c.nome} já existe.`);
    }
  }

  console.log('✅ Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
