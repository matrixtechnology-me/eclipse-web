import readline from 'readline';
import { EVisibility, PrismaClient } from '@prisma/client';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askUserConfirmation(): Promise<boolean> {
  const databaseUrl =
    process.env.DATABASE_URL || '❗ [DATABASE_URL não definida]';

  console.log(`🔍 DATABASE_URL: ${databaseUrl}\n`);
  console.log('⚠️ Esta ação pode modificar dados existentes.');

  return new Promise((resolve) => {
    rl.question(
      '❓ Deseja executar o seed e popular o banco de dados? (s/n): ',
      (answer) => {
        const normalizedAnswer = answer.trim().toLowerCase();

        if (normalizedAnswer === 's' || normalizedAnswer === 'sim') {
          console.log('✅ Executando seed...');
          resolve(true);
        } else {
          console.log('❌ Seed cancelado. Nenhum dado foi modificado.');
          resolve(false);
        }
      }
    );
  });
}

async function main() {
  const shouldContinue = await askUserConfirmation();
  rl.close();

  if (!shouldContinue) return;

  const prisma = new PrismaClient();

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "sidebar_link",
      "service",
      "user", 
      "domain", 
      "product",
      "product_composition",
      "user_product",
      "lab",
      "challenge",
      "module"
    RESTART IDENTITY CASCADE;
  `);

  await prisma.sidebarLinks.createMany({
    data: [
      {
        id: 'a1d1872a-802a-4cf6-9929-fcf208bab5aa',
        index: 1,
        name: 'Dashboard',
        path: '/adm/dashboard',
        icon: 'RiDashboardLine',
        active: true,
      },
      {
        id: '516da355-cd23-4c75-8ca6-44067ba90253',
        index: 2,
        name: 'Alunos',
        path: '/adm/alunos',
        icon: 'RiUser6Line',
        active: true,
      },
      {
        id: 'd5b9fb50-9bcf-43b2-b94f-4553f62beafe',
        index: 3,
        name: 'Biblioteca',
        path: '/adm/biblioteca',
        icon: 'RiFolder6Line',
        active: true,
      },
      {
        id: '1ca59a1a-7fd8-4312-97e2-42432244b5ab',
        index: 4,
        name: 'Produtos',
        path: '/adm/produtos',
        icon: 'RiUmbrellaLine',
        active: true,
      },
      {
        id: '36e07851-a293-4226-97b1-eb41c3c45c92',
        index: 5,
        name: 'Badges',
        path: '/adm/newBadge',
        icon: 'RiTrophyFill',
        active: true,
      },
      {
        id: '4f79c365-ea45-4629-b3fe-bcee9f002a07',
        index: 6,
        name: 'Mensagens',
        path: '/adm/message',
        icon: 'RiChat1Line',
        active: true,
      },
    ],
  });

  await prisma.user.create({
    data: {
      id: 'dfb8e46f-d0b5-4f22-97a9-9545b179a486',
      email: 'alexandre@cloudfaster.com.br',
      name: 'Alexandre Araújo',
      username: 'alexandre-ca',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '7fdf1af1-e0f4-42af-90f2-74cb579bc9d1',
      email: 'johnatan@cloudfaster.com.br',
      name: 'Johnatan Santos',
      username: 'johnatan-santos',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '96cfb58a-5d31-468f-9db0-2cdacbbec322',
      email: 'kauan@cloudfaster.com.br',
      name: 'Kauan Carvalho',
      username: 'kauan-carvalho',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: 'c7330afb-a27d-43df-a57a-1a85508ac01a',
      email: 'massaru@cloudfaster.com.br',
      name: 'Massaru Fukuda',
      username: 'massaru-fukuda',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '29db1d5e-3f1f-499e-91c9-3f11fb56391f',
      email: 'dan@cloudfaster.com.br',
      name: 'Dan Rezende',
      username: 'dan-rezende',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '2553ee23-901c-4085-8e84-a95dfddc9731',
      email: 'adeilton@cloudfaster.com.br',
      name: 'Adeilton Borges',
      username: 'add',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: 'b8cda202-024c-4703-9208-0a5454c808e0',
      email: 'layana@cloudfaster.com.br',
      name: 'Layana Ribeiro',
      username: 'layana-ribeiro',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '67208404-c4e0-4bb4-9d20-eb6e075a7821',
      email: 'luiz.otavio.haubert@cloudfaster.com.br',
      name: 'Luiz Ótavio',
      username: 'luiz-otavio',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-00',
      user_role: {
        create: {
          type: 'ADM',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
      email: 'wallace.melo@cloudfaster.com.br',
      name: 'Wallace Melo',
      username: 'wallacegmelo',
      confirmed: true,
      email_verified: true,
      cpf: '000.000.000-01',
      user_role: {
        create: {
          type: 'STUDENT',
          user_adm: {
            create: {},
          },
        },
      },
    },
  });

  await prisma.domain.createMany({
    data: [
      {
        name: 'Segurança',
        description: 'Segurança',
      },
      {
        name: 'Desenvolvimento',
        description: 'Desenvolvimento',
      },
      {
        name: 'Infraestrutura',
        description: 'Infraestrutura',
      },
      {
        name: 'Governança',
        description: 'Governança',
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        name: 'EC2',
        description: 'EC2',
        player: 'AWS',
      },
      {
        name: 'S3',
        description: 'S3',
        player: 'AWS',
      },
      {
        name: 'DynamoDb',
        description: 'DynamoDb',
        player: 'AWS',
      },
      {
        name: 'RDS',
        description: 'RDS',
        player: 'AWS',
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        id: 'efb9e54f-8f81-4506-ac40-557bd5f2558f',
        alias: 'metodo-advc',
        name: 'Método ADVC',
        overview: `
          <p>
            Começamos explicando a sigla ADVC, que significa Arquiteto de Valor Cloud.
            Você pode me perguntar: “mas Dan, por que Arquiteto Cloud?” Talvez você
            seja desenvolvedor ou gerente de projetos, enfim... “Por que ‘arquiteto’ e
            por que ‘de valor’? O que significa isso?”
          </p>
          <p>
            Essa foi uma forma que encontrei de exemplificar o momento atual do
            mercado. Existem muitas pessoas que dizem saber trabalhar com Cloud e AWS,
            mas, quando precisam resolver os problemas do dia a dia nas empresas, nem
            sempre estão preparadas ou atendem as expectativas.
          </p>
          <p>
            Muitas pessoas, já certificadas, me procuram com dúvidas de iniciante.
            Outras, porque precisam de ajuda para se recolocar. E ainda há aquelas que
            fizeram a entrevista técnica e não conseguiram passar, pois falta prática,
            vivência, o famoso “mão na massa”. Resumindo, essas pessoas não estão
            agregando valor às empresas. Por isso aquele velho jargão: “falta
            profissional qualificado no mercado”. E não é mentira, falta mesmo!
          </p>
          <p>
            Entendendo essa necessidade do mercado e sabendo da falta de profissionais
            realmente qualificados, resolvi criar o Método ADVC. Um método que
            realmente prepara profissionais para o mercado, para as certificações e,
            principalmente, que é capaz de agregar valor às empresas.
          </p>
          <hr />
          <h1>BEM VINDOS À MENTORIA ADVC</h1>
          <p>Durante a mentoria, seguindo o Método ADVC, você vai aprender:</p>
          <ul>
            <li>Trabalhar com os serviços;</li>
            <li>Se preparar para as certificações com simulados comentados;</li>
            <li>
              Adquirir experiência prática (“mão na massa”), por meio de laboratórios
              práticos;
            </li>
            <li>Aprender ainda mais resolvendo os desafios do dia a dia;</li>
            <li>Participar das sessões de mentoria;</li>
            <li>
              Ingressar no nosso grupo exclusivo do Discord para troca de experiências
              entre os alunos;
            </li>
            <li>
              Participar das nossas aulas extras de revisão e assuntos diários,
              exclusivas para os alunos.
            </li>
          </ul>
          <p>
            Definitivamente, não é só mais um curso. O Método ADVC é realmente uma
            formação completa, tudo que você precisa para se destacar no mercado.
          </p>
          <hr />
          <p>
            Definitivamente, não é só mais um curso. O Método ADVC é realmente uma
            formação completa, tudo que você precisa para se destacar no mercado.
          </p>
          <p>
            Nessa sua jornada, eu, <strong>Dan Rezende</strong>, e a equipe da
            <strong>CloudFaster Academy</strong> estaremos à disposição para te
            ajudar, sanando suas dúvidas e deixando você cada vez mais próximo dos
            seus objetivos profissionais.
          </p>
          <p>
            Nossa meta é formar profissionais especialistas em Cloud, seja você um
            arquiteto, desenvolvedor, consultor, agilista, ou qualquer outra função
            relacionada ao uso de Cloud.
          </p>
          <p>
            Minha proposta é, por meio dessa jornada de aprendizado, te preparar para
            ser um profissional de valor, com capacidade para ser não apenas mais um
            que fez uma certificação, deixou o LinkedIn bonito, mas na hora que o
            projeto chega, não consegue executar.
          </p>
          <p>
            Para formar especialistas Cloud que agreguem valor às empresas, que estão
            capacitados para buscar os melhores salários e escolherem onde desejam
            trabalhar, apresento a vocês o conteúdo da nossa mentoria, baseado no
            <strong>Método ADVC</strong>.
          </p>
        `,
        description:
          'O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa para profissionais que desejam se posicionar como um arquiteto de cloud que realmente conhece AWS e consegue desenvolver, projetar, desenhar, defender e implementar arquiteturas que resolvem problemas utilizando tecnologias em Cloud e AWS.',
        type_product: 'COURSE',
        status: 'PUBLISHED',
        visibility: EVisibility.VISIBLE,
      },
      {
        id: '724e4907-1807-410b-bc8f-7ccca880852c',
        alias: 'do-zero-ao-next',
        name: 'Do Zero ao Next',
        overview: `
          <p>
            O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa
            para profissionais que desejam se posicionar como um arquiteto
            cloud que realmente conhece AWS e consegue desenvolver, projetar,
            desenhar, defender e implementar arquiteturas que resolvem problemas
            utilizando tecnologias em Cloud e AWS.
          </p>
        `,
        status: 'PUBLISHED',
        type_product: 'MODULE',
        visibility: 'VISIBLE',
      },
      {
        id: '4c4987c4-fc36-4924-8167-7bd929a412b2',
        alias: 'crie-seu-readme-completo-com-ia-da-openai',
        name: 'Crie seu README completo com IA da OpenAI',
        overview: `
          <p>
            O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa
            para profissionais que desejam se posicionar como um arquiteto de
            cloud que realmente conhece AWS e consegue desenvolver, projetar,
            desenhar, defender e implementar arquiteturas que resolvem problemas
            utilizando tecnologias em Cloud e AWS.
          </p>
        `,
        status: 'PUBLISHED',
        type_product: 'LESSON',
        visibility: 'VISIBLE',
      },
      {
        id: '1afd02b2-249b-44bc-9520-9a4f439e0b94',
        alias: 'aws-conhecendo-a-console-de-gerenciamento',
        name: 'AWS - Conhecendo a console de gerenciamento',
        overview: `
          <p>A console permite aos usuários gerenciar e monitorar seus serviços
          e recursos da AWS.</p>
          <p><strong>Interface amigável:</strong> projetada para ser intuitiva,
          permite que mesmo aqueles com conhecimentos técnicos limitados possam
          gerenciar infraestruturas de TI.</p>
          <p><strong>Gerenciamento de serviços da AWS:</strong> oferece acesso a
          uma ampla gama de serviços, incluindo computação (EC2), armazenamento
          (S3), bases de dados (RDS), entre outros.</p> <p><strong>Monitoramento
          e gerenciamento de recursos:</strong> permite monitorar o uso,
          configurar alertas, visualizar logs e analisar métricas de
          desempenho.</p>
          <p><strong>Segurança:</strong> integra ferramentas para gerenciar
          identidades, acessos e criptografia, protegendo dados e recursos.</p>
          <p><strong>Personalização:</strong> pode ser ajustada conforme as
          preferências do usuário, facilitando o acesso aos serviços mais
          utilizados.</p> <p><strong>Acessibilidade global:</strong> baseada na
          web, pode ser acessada de qualquer lugar com conexão à internet.</p>
          <p><strong>Suporte a vários usuários:</strong> permite a criação de
          contas com diferentes níveis de acesso e permissões.</p>
          <p><strong>Atualizações constantes:</strong> a AWS atualiza
          regularmente a console para incluir novas funcionalidades e
          melhorias.</p> <p><strong>Assistência e documentação:</strong>
          oferece acesso a vasta documentação, recursos de aprendizado e
          suporte técnico.</p>
        `,
        status: 'PUBLISHED',
        type_product: 'LAB',
        visibility: 'VISIBLE',
      },
      {
        id: 'b20d1fde-a583-4cb4-8add-efcf91bbcc08',
        alias: 'armazenamento-seguro-no-amazon-s3',
        name: 'Armazenamento Seguro no Amazon S3',
        overview: `
          <p>
            O desafio <strong>"Armazenamento Seguro no Amazon S3"</strong> foi projetado para ajudá-lo a desenvolver habilidades práticas na utilização segura do serviço de armazenamento da AWS.
          </p>
          <p>
            Durante este desafio, você aprenderá a configurar e gerenciar buckets no Amazon S3, implementando boas práticas de segurança para proteger seus dados. Entre os tópicos abordados estão:
          </p>
          <ul>
            <li><strong>Configuração de Buckets:</strong> Criação e gerenciamento de buckets com permissões e políticas adequadas.</li>
            <li><strong>Controle de Acesso:</strong> Uso de políticas do IAM (Identity and Access Management) para definir quem pode acessar seus dados.</li>
            <li><strong>Criptografia:</strong> Implementação de criptografia em repouso (SSE-S3, SSE-KMS) e em trânsito (SSL/TLS).</li>
            <li><strong>Versionamento:</strong> Ativação e gerenciamento de versões para proteger contra exclusões acidentais.</li>
            <li><strong>Políticas de Lifecycle:</strong> Automatização do ciclo de vida dos objetos para otimizar o armazenamento e reduzir custos.</li>
            <li><strong>Auditoria e Monitoramento:</strong> Utilização do AWS CloudTrail e Amazon CloudWatch para monitorar atividades e garantir conformidade.</li>
          </ul>
          <p>
            Este desafio é ideal para profissionais que desejam aprimorar seus conhecimentos em segurança na nuvem e aplicar práticas recomendadas na proteção de dados na AWS.
          </p>
          <p>
            Prepare-se para colocar a mão na massa e fortalecer suas habilidades em armazenamento seguro com o Amazon S3! 🚀
          </p>
        `,
        status: 'PUBLISHED',
        type_product: 'CHALLENGE',
        visibility: 'VISIBLE',
      },
    ],
  });

  await prisma.productComposition.createMany({
    data: [
      {
        container_id: 'efb9e54f-8f81-4506-ac40-557bd5f2558f',
        item_id: '724e4907-1807-410b-bc8f-7ccca880852c',
        order: 0,
      },
      {
        container_id: '724e4907-1807-410b-bc8f-7ccca880852c',
        item_id: '4c4987c4-fc36-4924-8167-7bd929a412b2',
        order: 0,
      },
      {
        container_id: 'efb9e54f-8f81-4506-ac40-557bd5f2558f',
        item_id: '1afd02b2-249b-44bc-9520-9a4f439e0b94',
        order: 0,
      },
      {
        container_id: 'efb9e54f-8f81-4506-ac40-557bd5f2558f',
        item_id: 'b20d1fde-a583-4cb4-8add-efcf91bbcc08',
        order: 0,
      },
    ],
  });

  await prisma.userProduct.createMany({
    data: [
      {
        user_id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
        product_id: 'efb9e54f-8f81-4506-ac40-557bd5f2558f', // [product](course) Método ADVC
      },
      {
        user_id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
        product_id: '724e4907-1807-410b-bc8f-7ccca880852c', // [product](module) Do Zero ao Next
      },
      {
        user_id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
        product_id: '4c4987c4-fc36-4924-8167-7bd929a412b2', // [product](lesson) Como EU lido com autorizações (permissões) nos meus apps
      },
      {
        user_id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
        product_id: '1afd02b2-249b-44bc-9520-9a4f439e0b94', // [product](lab) AWS - Conhecendo a console de gerenciamento
      },
      {
        user_id: '3b0d1b04-20ea-4277-9adc-bb0715e965d5',
        product_id: 'b20d1fde-a583-4cb4-8add-efcf91bbcc08', // [product](challenge) Armazenamento Seguro no Amazon S3
      },
    ],
  });

  await prisma.module.create({
    data: {
      id: '724e4907-1807-410b-bc8f-7ccca880852c',
      difficulty: 'BEGINNER',
    },
  });

  await prisma.lesson.create({
    data: {
      id: '4c4987c4-fc36-4924-8167-7bd929a412b2',
      duration: 3600,
    },
  });

  await prisma.lab.create({
    data: {
      id: '1afd02b2-249b-44bc-9520-9a4f439e0b94',
      duration: 3600,
      how_to: `
        <p>
          Para acessar a página da console,
          <a href="https://console.aws.amazon.com" target="_blank">clique aqui</a>
          ou coloque a URL no navegador de sua preferência. Em seguida,
          preencha os campos usando as credenciais ao lado, como demonstrado
          a seguir.
        </p>
       `,
      difficulty: 'BEGINNER',
    },
  });

  await prisma.challenge.create({
    data: {
      id: 'b20d1fde-a583-4cb4-8add-efcf91bbcc08',
      approval_rate: 70,
      duration: 3600,
      instruction: `
        <p>
          A Dans Coffee precisa armazenar um arquivo de backup de forma segura
          fora da empresa. Após receber dicas sobre a Nuvem, decidiu contratar
          um consultor para criar um bucket S3 com boas práticas de segurança,
          garantindo que o objeto seja privado e seguro.</p><p>Esse teste (POC)
          servirá para avaliar a segurança antes de automatizar os backups. O
          time interno, sem experiência com Cloud e AWS, quer validar a solução
          antes de migrar os dados.</p><p><strong>Hora do desafio:</strong></p>
          <p>
            Como Arquiteto de Soluções, seu desafio é armazenar o backup da
            Dans Coffee de forma segura na nuvem.
          </p>
          <p><strong>Requisitos:</strong></p>
          <ul>
            <li>Utilizar o serviço Amazon S3</li>
            <li>O arquivo deve estar criptografado</li>
            <li>O arquivo não pode ser público</li>
            <li>A região deve ser N. Virginia (us-east-1)</li>
            <li>O prazo de entrega é de até 2 horas</li>
          </ul>
      `,
      type: 'ARCHITECT',
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .then(async () => {
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    const prisma = new PrismaClient();
    await prisma.$disconnect();
    process.exit(1);
  });
