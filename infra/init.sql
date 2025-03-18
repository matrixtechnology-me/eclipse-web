DO
$$
DECLARE 
    delimiter CHAR := ',';
    tableList TEXT := 'user_preferences,question_interactions,addresses,user_addresses,user_links,answers,attempts,campaigns,categories,certificates,challenges,lesson_comments,lessons,post_comments,comment_replies,comments,courses,documents,domains,files,folders,interactions,lab_attempts,labs,modules,post_comments,post_interactions,posts,practice_attempts,practice_domains,post_attachments,post_interactions,post_comments,post_tags,posts,practices,product_compositions,products,question_configurations,question_domains,question_options,questions,quizzes,subtopics,support_tickets,tags,topics,trails,user_addresses,user_certificates,user_documents,users';
    tableName TEXT;
    currLen INT;
BEGIN
    -- Desabilitar as restrições de chave estrangeira
    EXECUTE 'SET CONSTRAINTS ALL DEFERRED';

    WHILE LENGTH(tableList) > 0 LOOP
        -- Determina o comprimento do nome da tabela até o delimitador
        currLen := POSITION(delimiter IN tableList) - 1;

        -- Se o delimitador não for encontrado, usa o restante da string
        IF currLen < 0 THEN
            currLen := LENGTH(tableList);
        END IF;

        -- Obtém o nome da tabela
        tableName := SUBSTRING(tableList FROM 1 FOR currLen);

        -- Executa o TRUNCATE na tabela
        EXECUTE 'TRUNCATE TABLE ' || tableName || ' CASCADE';

        -- Remove o nome da tabela processado da lista
        tableList := CASE 
                        WHEN LENGTH(tableList) - currLen <= 0 THEN '' 
                        ELSE SUBSTRING(tableList FROM currLen + 2)
                    END;
    END LOOP;

    -- Reabilitar as restrições de chave estrangeira
    EXECUTE 'SET CONSTRAINTS ALL IMMEDIATE';
END
$$;

-- Populando as tabelas

INSERT INTO users (id, first_name, last_name, user_name, about_me, level, email, avatar_url, gender, status, visibility, created_at, updated_at)
VALUES (
  '34688488-a001-706f-3e7d-eb00dde6e508',
  'Wallace',
  'Melo',
  'wallacegmelo',
  '<p>Sou um desenvolvedor Back-end brasileiro apaixonado por criar soluções escaláveis e eficientes. Com experiência em tecnologias modernas, busco sempre aprimorar minhas habilidades e contribuir para o desenvolvimento de sistemas robustos e de alto desempenho. Gosto de desafios que envolvem arquitetura de software, otimização de performance e segurança, sempre focando em entregar código de qualidade e valor para os projetos em que atuo.</p>',
  'practitioner',
  'wallacegmelo.dev@gmail.com',
  'https://i.ibb.co/HLhK1nrt/38348723.jpg',
  'male',
  'active',
  'public',
  NOW(),
  NOW()
);

INSERT INTO addresses (id, cep, city, neighborhood, number, street, state, complement, created_at, updated_at)
VALUES (
	'b2ccdb56-dbf3-41a1-89ab-adc6505b8de3',
  '60330786',
  'Fortaleza',
  'Barra do Ceará',
  '98',
  'Rua Peri',
  'CE',
  '',
  NOW(),
  NOW()
);

INSERT INTO user_addresses (user_id, address_id)
VALUES (
	'34688488-a001-706f-3e7d-eb00dde6e508',
  'b2ccdb56-dbf3-41a1-89ab-adc6505b8de3'
);

INSERT INTO user_links (id, provider, url, user_id, created_at, updated_at)
VALUES (
	'31bee3dc-65b4-45c6-a807-7e7b330c3f3f',
  'github',
  'https://github.com/codefromhuman',
  '34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  NOW(),
  NOW()
);

INSERT INTO user_preferences (auto_play, user_id)
VALUES (
	true,
  '34688488-a001-706f-3e7d-eb00dde6e508' -- user id
);

INSERT INTO products (id, name, description, type, status, visibility, alias, created_at, updated_at)
VALUES (
	'efb9e54f-8f81-4506-ac40-557bd5f2558f',
  'Método ADVC',
  'O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa para profissionais que desejam se posicionar como um arquiteto de cloud que realmente conhece AWS e consegue desenvolver, projetar, desenhar, defender e implementar arquiteturas que resolvem problemas utilizando tecnologias em Cloud e AWS.',
  'course',
  'active',
  'visible',
  'metodo-advc',
  NOW(),
  NOW()
), (
	'724e4907-1807-410b-bc8f-7ccca880852c',
  'Do Zero ao Next',
  'O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa para profissionais que desejam se posicionar como um arquiteto de cloud que realmente conhece AWS e consegue desenvolver, projetar, desenhar, defender e implementar arquiteturas que resolvem problemas utilizando tecnologias em Cloud e AWS.',
  'module',
  'active',
  'visible',
  'do-zero-ao-next',
  NOW(),
  NOW()
), (
	'4c4987c4-fc36-4924-8167-7bd929a412b2',
  'Como EU lido com autorizações (permissões) nos meus apps',
  'O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa para profissionais que desejam se posicionar como um arquiteto de cloud que realmente conhece AWS e consegue desenvolver, projetar, desenhar, defender e implementar arquiteturas que resolvem problemas utilizando tecnologias em Cloud e AWS.',
  'lesson',
  'active',
  'visible',
  'como-eu-lido-com-autorizacoes',
  NOW(),
  NOW()
), (
	'a5298239-0cd7-4d0d-baa9-eb2eaa6b7e89',
	'Crie seu README completo com IA da OpenAI',
	'O Método ADVC, Arquiteto de Valor Cloud, é uma mentoria completa para profissionais que desejam se posicionar como um arquiteto de cloud que realmente conhece AWS e consegue desenvolver, projetar, desenhar, defender e implementar arquiteturas que resolvem problemas utilizando tecnologias em Cloud e AWS.',
  'lesson',
  'active',
  'visible',
  'crie-seu-readme-completo-com-ia-da-openai',
  NOW(),
  NOW()
), (
	'0a3352ab-6e96-401f-9c5e-2a3f8d128703',
  'Simulado AWS Cloud Practitioner',
  'Simulado - AWS Cloud Practitioner',
  'practice',
  'active',
  'visible',
  'simulado-aws-cloud-practitioner',
  NOW(),
  NOW()
), (
	'1afd02b2-249b-44bc-9520-9a4f439e0b94',
  'AWS - Conhecendo a console de gerenciamento',
  'A console permite aos usuários gerenciar e monitorar seus serviços e recursos da AWS.</p> <p><strong>Interface amigável:</strong> projetada para ser intuitiva, permite que mesmo aqueles com conhecimentos técnicos limitados possam gerenciar infraestruturas de TI.</p> <p><strong>Gerenciamento de serviços da AWS:</strong> oferece acesso a uma ampla gama de serviços, incluindo computação (EC2), armazenamento (S3), bases de dados (RDS), entre outros.</p> <p><strong>Monitoramento e gerenciamento de recursos:</strong> permite monitorar o uso, configurar alertas, visualizar logs e analisar métricas de desempenho.</p> <p><strong>Segurança:</strong> integra ferramentas para gerenciar identidades, acessos e criptografia, protegendo dados e recursos.</p> <p><strong>Personalização:</strong> pode ser ajustada conforme as preferências do usuário, facilitando o acesso aos serviços mais utilizados.</p> <p><strong>Acessibilidade global:</strong> baseada na web, pode ser acessada de qualquer lugar com conexão à internet.</p> <p><strong>Suporte a vários usuários:</strong> permite a criação de contas com diferentes níveis de acesso e permissões.</p> <p><strong>Atualizações constantes:</strong> a AWS atualiza regularmente a console para incluir novas funcionalidades e melhorias.</p> <p><strong>Assistência e documentação:</strong> oferece acesso a vasta documentação, recursos de aprendizado e suporte técnico.',
  'lab',
  'active',
  'visible',
  'aws-conhecendo-a-console-de-gerenciamento',
  NOW(),
  NOW()
), (
	'dd9b22c7-11de-48ac-a600-ae5b9265a7d6',
  'Trilhas direto ao ponto',
  'Com serviços e assuntos pertinentes ao exame de certificação.',
  'trail',
  'active',
  'visible',
  'trilhas-direto-ao-ponto',
  NOW(),
  NOW()
), (
	'b20d1fde-a583-4cb4-8add-efcf91bbcc08',
  'Armazenamento Seguro no Amazon S3',
  'Armazenar um arquivo de backup de maneira segura no S3. Após clicar em "Iniciar Desafio", você receberá as instruções para completar esta tarefa.',
  'challenge',
  'active',
  'visible',
  'armazenamento-seguro-no-amazon-s3',
  NOW(),
  NOW()
);

INSERT INTO user_products (user_id, product_id)
VALUES (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  'efb9e54f-8f81-4506-ac40-557bd5f2558f' -- [product](course) Método ADVC
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  '724e4907-1807-410b-bc8f-7ccca880852c' -- [product](module) Do Zero ao Next
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  '4c4987c4-fc36-4924-8167-7bd929a412b2' -- [product](lesson) Como EU lido com autorizações (permissões) nos meus apps
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  'a5298239-0cd7-4d0d-baa9-eb2eaa6b7e89' -- [product](lesson) Crie seu README completo com IA da OpenAI
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  '0a3352ab-6e96-401f-9c5e-2a3f8d128703' -- [product](practice) Simulado AWS Cloud Practitioner
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  '1afd02b2-249b-44bc-9520-9a4f439e0b94' -- [product](lab) AWS - Conhecendo a console de gerenciamento
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  'dd9b22c7-11de-48ac-a600-ae5b9265a7d6' -- [product](trail) Trilhas direto ao ponto
), (
	'34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  'b20d1fde-a583-4cb4-8add-efcf91bbcc08' -- [product](challenge) Armazenamento Seguro no Amazon S3
);;

INSERT INTO courses (id, overview, created_at, updated_at)
VALUES (
  'efb9e54f-8f81-4506-ac40-557bd5f2558f', -- product id reference
  '<div><p>Começamos explicando a sigla ADVC...</p></div>',
  NOW(),
  NOW()
);

INSERT INTO modules (id, difficulty, created_at, updated_at)
VALUES (
  '724e4907-1807-410b-bc8f-7ccca880852c', -- product id reference
  'beginner',
  NOW(),
  NOW()
);

INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'efb9e54f-8f81-4506-ac40-557bd5f2558f', -- product course id
  '724e4907-1807-410b-bc8f-7ccca880852c' -- product module id
);


INSERT INTO lessons (id, index, video_url, thumbnail_url, duration, created_at, updated_at)
VALUES
  (
    '4c4987c4-fc36-4924-8167-7bd929a412b2', -- product id reference
    0,
    'https://www.youtube.com/watch?v=NG8qTapopj4',
    'https://i.ytimg.com/vi/NG8qTapopj4/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB9PrYJw3JlIS43pP8PyYvjJmME7A',
		3600,
    '2025-01-31T03:53:37.290Z',
    '2025-01-31T03:53:37.290Z'
  ),
  (
    'a5298239-0cd7-4d0d-baa9-eb2eaa6b7e89', -- product id reference
    1,
    'https://www.youtube.com/watch?v=z4aj9TccHIM',
    'https://i.ytimg.com/vi/z4aj9TccHIM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCZze9pQ3U5GThUwoa_B6OxJJWK9w',
    3600,
    '2025-01-31T03:53:37.290Z',
    '2025-01-31T03:53:37.290Z'
  );

INSERT INTO comments (id, description, user_id, created_at, updated_at)
VALUES (
  '8174c6df-d4d2-4e72-968c-c8834055320c',
  'Ótima explicação! A abordagem prática ajudou bastante a entender o conceito. Gostei da clareza na explicação e dos exemplos apresentados. Ansioso para as próximas aulas!',
  '34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  NOW(),
  NOW()
);

INSERT INTO lesson_comments (lesson_id, comment_id)
VALUES (
  '4c4987c4-fc36-4924-8167-7bd929a412b2', -- lesson id
  '8174c6df-d4d2-4e72-968c-c8834055320c' -- comment id
);

INSERT INTO comment_replies (id, description, comment_id, user_id, created_at, updated_at)
VALUES (
  'e23ff309-2fef-4b6a-b66a-038fc38c1faf',
  'Também achei a explicação muito clara! Os exemplos ajudaram bastante a visualizar o conceito na prática. Mal posso esperar para aplicar isso nos meus projetos!',
  '8174c6df-d4d2-4e72-968c-c8834055320c',
  '34688488-a001-706f-3e7d-eb00dde6e508',
  NOW(),
  NOW()
);
  
INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'724e4907-1807-410b-bc8f-7ccca880852c', -- product module id
  '4c4987c4-fc36-4924-8167-7bd929a412b2' -- product lesson id
), (
	'724e4907-1807-410b-bc8f-7ccca880852c', -- product module id
  'a5298239-0cd7-4d0d-baa9-eb2eaa6b7e89' -- product lesson id
);

INSERT INTO practices (id, instructions, introduction, duration, level, approval_rate, created_at, updated_at)
VALUES (
	'0a3352ab-6e96-401f-9c5e-2a3f8d128703', -- product practice id
  '<p>Responda as questões, revise o que for necessário e finalize o exame para verificar a pontuação alcançada. Recomendamos marcar o exame se você alcançar 80% ou mais. Ao finalizar, você pode acessar dicas e links de documentações que te apoiam no processo de aprendizado. Caso encontre algum erro, por favor nos reporte. Tenha um bom simulado.</p>',
  '<p>Responda as questões, revise o que for necessário e finalize o exame para verificar a pontuação alcançada. Recomendamos marcar o exame se você alcançar 80% ou mais. Ao finalizar, você pode acessar dicas e links de documentações que te apoiam no processo de aprendizado. Caso encontre algum erro, por favor nos reporte. Tenha um bom simulado.</p>',
  3600,
  'practitioner',
  70,
  NOW(),
  NOW()
);

INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'efb9e54f-8f81-4506-ac40-557bd5f2558f', -- product course id
  '0a3352ab-6e96-401f-9c5e-2a3f8d128703' -- product practice id
);

INSERT INTO questions (id, description, explanation, index, type, alias, created_at, updated_at)
VALUES 
('e2e25920-5081-4fee-94bc-4e56f2f7fbed', 'Qual tag HTML é usada para criar um link?', 'A tag <a> (anchor) é usada para criar links em HTML. O atributo href define o destino do link.', 0, 'single-choice', 'qual-tag-html-e-usada-para-criar-um-link', NOW(), NOW()),
('b14f2b69-7a57-407b-94ca-81c575e00840', 'Qual propriedade CSS é usada para alterar a cor do texto?', 'A propriedade color em CSS define a cor do texto de um elemento.', 1, 'single-choice', 'qual-propriedade-css-e-usada-para-alterar-a-cor-do-texto', NOW(), NOW()),
('ec7ecdf9-32ac-46db-8799-3e482c348da3', 'Qual método JavaScript é usado para exibir um alerta na tela?', 'O método window.alert() exibe uma caixa de diálogo com uma mensagem e um botão "OK".', 2, 'single-choice', 'qual-metodo-javascript-e-usado-para-exibir-um-alerta', NOW(), NOW()),
('edc515ae-ad00-40db-90cc-f32feca74f1a', 'Qual tag HTML é usada para criar uma lista ordenada?', 'A tag <ol> (ordered list) cria uma lista ordenada em HTML.', 3, 'single-choice', 'qual-tag-html-e-usada-para-criar-uma-lista-ordenada', NOW(), NOW()),
('a1cad2a0-0c07-47bc-aaa5-dadca123ede6', 'Qual propriedade CSS é usada para definir a fonte do texto?', 'A propriedade font-family especifica a fonte de um texto em CSS.', 4, 'single-choice', 'qual-propriedade-css-e-usada-para-definir-a-fonte', NOW(), NOW()),
('23cd0103-1b66-46df-b6df-985110f302bb', 'Como se declara uma variável em JavaScript?', 'O let é a forma moderna de declarar variáveis em JavaScript.', 5, 'single-choice', 'como-se-declara-uma-variavel-em-javascript', NOW(), NOW()),
('8b3180dc-86d4-4508-b61f-b8421ead16de', 'Qual tag HTML é usada para inserir uma imagem?', 'A tag <img> é usada para exibir imagens em HTML.', 6, 'single-choice', 'qual-tag-html-e-usada-para-inserir-uma-imagem', NOW(), NOW()),
('ff296f7c-521a-47ff-8d8f-743892d11f57', 'Qual propriedade CSS é usada para alterar o tamanho da fonte?', 'A propriedade font-size controla o tamanho da fonte em CSS.', 7, 'single-choice', 'qual-propriedade-css-e-usada-para-alterar-o-tamanho-da-fonte', NOW(), NOW()),
('3918b4a9-1cf2-4d0e-a032-fcb752359a49', 'Qual função JavaScript é usada para imprimir no console?', 'A função console.log() imprime mensagens no console do navegador.', 8, 'single-choice', 'qual-funcao-javascript-e-usada-para-imprimir-no-console', NOW(), NOW()),
('95dbfc43-a6ae-40d9-b4cb-b265c28affbe', 'Qual atributo HTML especifica um texto alternativo para imagens?', 'O atributo alt define um texto alternativo para imagens quando elas não podem ser carregadas.', 9, 'single-choice', 'qual-atributo-html-especifica-texto-alternativo-para-imagens', NOW(), NOW());

INSERT INTO practice_questions (practice_id, question_id)
VALUES 
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'e2e25920-5081-4fee-94bc-4e56f2f7fbed'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'b14f2b69-7a57-407b-94ca-81c575e00840'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'ec7ecdf9-32ac-46db-8799-3e482c348da3'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'edc515ae-ad00-40db-90cc-f32feca74f1a'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'a1cad2a0-0c07-47bc-aaa5-dadca123ede6'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', '23cd0103-1b66-46df-b6df-985110f302bb'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', '8b3180dc-86d4-4508-b61f-b8421ead16de'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', 'ff296f7c-521a-47ff-8d8f-743892d11f57'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', '3918b4a9-1cf2-4d0e-a032-fcb752359a49'),
('0a3352ab-6e96-401f-9c5e-2a3f8d128703', '95dbfc43-a6ae-40d9-b4cb-b265c28affbe');

INSERT INTO question_options (id, description, is_correct, question_id, created_at, updated_at)
VALUES 
-- Questão 1: Qual tag HTML é usada para criar um link?
(
  '5c28ebf0-55a9-44a0-82cd-f206cb929b04',
  '<a>',
  true,
  'e2e25920-5081-4fee-94bc-4e56f2f7fbed',
  NOW(),
  NOW()
),
(
  'bcd25791-ae44-4bc4-a2dd-0841ef503dee',
  '<link>',
  false,
  'e2e25920-5081-4fee-94bc-4e56f2f7fbed',
  NOW(),
  NOW()
),
(
  '0bc47858-d8cf-47fe-91dd-f8b524b390b1',
  '<href>',
  false,
  'e2e25920-5081-4fee-94bc-4e56f2f7fbed',
  NOW(),
  NOW()
),
(
  '5f34e9d0-ec90-4746-a4a3-d814fb1872b9',
  '<button>',
  false,
  'e2e25920-5081-4fee-94bc-4e56f2f7fbed',
  NOW(),
  NOW()
),

-- Questão 2: Qual propriedade CSS é usada para alterar a cor do texto?
(
  'e5b7a9d3-4f2c-6d1e-8b5a-7c9f4a3d2c8d',
  'color',
  true,
  'b14f2b69-7a57-407b-94ca-81c575e00840',
  NOW(),
  NOW()
),
(
  '0fb39f63-cded-4685-aeb2-0fea13741b89',
  'background-color',
  false,
  'b14f2b69-7a57-407b-94ca-81c575e00840',
  NOW(),
  NOW()
),
(
  '8149297e-6a57-4511-9c68-b863e70a7723',
  'font-color',
  false,
  'b14f2b69-7a57-407b-94ca-81c575e00840',
  NOW(),
  NOW()
),
(
  'eae728bc-5918-467b-8dee-80610f20e932',
  'text-style',
  false,
  'b14f2b69-7a57-407b-94ca-81c575e00840',
  NOW(),
  NOW()
),

-- Questão 3: Qual método JavaScript é usado para exibir um alerta na tela?
(
  '03c817e1-03c5-4521-96e6-be8cc2813335',
  'alert()',
  true,
  'ec7ecdf9-32ac-46db-8799-3e482c348da3',
  NOW(),
  NOW()
),
(
  '9e6d6fdf-9a1b-4414-bb81-41ef14c0e84a',
  'prompt()',
  false,
  'ec7ecdf9-32ac-46db-8799-3e482c348da3',
  NOW(),
  NOW()
),
(
  '3b8c3745-f190-4f73-8b06-7b16aa2b82eb',
  'console.log()',
  false,
  'ec7ecdf9-32ac-46db-8799-3e482c348da3',
  NOW(),
  NOW()
),
(
  '35b01bca-1f21-4f96-bca7-aff46b029177',
  'message()',
  false,
  'ec7ecdf9-32ac-46db-8799-3e482c348da3',
  NOW(),
  NOW()
),

-- Questão 4: Qual tag HTML é usada para criar uma lista ordenada?
(
  '529918fa-8d55-49e1-93bb-1e5c79dcac4f',
  '<ol>',
  true,
  'edc515ae-ad00-40db-90cc-f32feca74f1a',
  NOW(),
  NOW()
),
(
  'c34145bd-7c7c-4a19-9c9d-3cc6cb24ed03',
  '<ul>',
  false,
  'edc515ae-ad00-40db-90cc-f32feca74f1a',
  NOW(),
  NOW()
),
(
  '6c13a069-851a-41e5-b863-38c14b6acbee',
  '<li>',
  false,
  'edc515ae-ad00-40db-90cc-f32feca74f1a',
  NOW(),
  NOW()
),
(
  'a762cc9f-a19a-46f8-9ee0-86040932cd69',
  '<list>',
  false,
  'edc515ae-ad00-40db-90cc-f32feca74f1a',
  NOW(),
  NOW()
),

-- Questão 5: Qual propriedade CSS é usada para definir a fonte do texto?
(
  'cf2987fe-94ae-4cde-a7d7-dfbff32cb505',
  'font-family',
  true,
  'a1cad2a0-0c07-47bc-aaa5-dadca123ede6',
  NOW(),
  NOW()
),
(
  '31bede4f-08dc-4401-9e8a-132c0c478ffc',
  'text-font',
  false,
  'a1cad2a0-0c07-47bc-aaa5-dadca123ede6',
  NOW(),
  NOW()
),
(
  '59a7170b-5169-4225-be94-5183a1cfe6a0',
  'font-style',
  false,
  'a1cad2a0-0c07-47bc-aaa5-dadca123ede6',
  NOW(),
  NOW()
),
(
  'b257db57-631e-4137-b52d-13bd94c52104',
  'typeface',
  false,
  'a1cad2a0-0c07-47bc-aaa5-dadca123ede6',
  NOW(),
  NOW()
),

-- Questão 6: Qual operador é usado para comparação estrita em JavaScript?
(
  '830c623e-72e1-4606-a8ab-1fbb2b19ee53',
  '===',
  true,
  '23cd0103-1b66-46df-b6df-985110f302bb',
  NOW(),
  NOW()
),
(
  '48015ed4-9c27-4ab9-9611-99f525f1a635',
  '==',
  false,
  '23cd0103-1b66-46df-b6df-985110f302bb',
  NOW(),
  NOW()
),
(
  'f94fde31-c5b1-4db0-a215-f841db751306',
  '!=',
  false,
  '23cd0103-1b66-46df-b6df-985110f302bb',
  NOW(),
  NOW()
),
(
  '55574f89-3b6b-4d4c-981b-48eaf098bfce',
  '!==',
  false,
  '23cd0103-1b66-46df-b6df-985110f302bb',
  NOW(),
  NOW()
),

-- Questão 7: Qual tag HTML é usada para inserir uma imagem?
(
  'b4369560-c877-46ea-897e-5470311e7aa9',
  '<img>',
  true,
  '8b3180dc-86d4-4508-b61f-b8421ead16de',
  NOW(),
  NOW()
),
(
  '211439d0-f028-4521-aabc-b59f3e9a7e8f',
  '<picture>',
  false,
  '8b3180dc-86d4-4508-b61f-b8421ead16de',
  NOW(),
  NOW()
),
(
  'd0ca1d21-0657-4a00-a0d7-d0d4bce02f2f',
  '<image>',
  false,
  '8b3180dc-86d4-4508-b61f-b8421ead16de',
  NOW(),
  NOW()
),
(
  '34209051-2b1b-471a-aa28-2de6199c96d3',
  '<media>',
  false,
  '8b3180dc-86d4-4508-b61f-b8421ead16de',
  NOW(),
  NOW()
),

-- Questão 8: Qual método do JavaScript é usado para selecionar um elemento pelo ID?
(
  'fa64851b-b8ee-473f-ad4e-c56821dbb618',
  'document.getElementById()',
  true,
  'ff296f7c-521a-47ff-8d8f-743892d11f57',
  NOW(),
  NOW()
),
(
  '71649947-07c1-4d6c-ac4e-efc5e555c0e4',
  'document.querySelector()',
  false,
  'ff296f7c-521a-47ff-8d8f-743892d11f57',
  NOW(),
  NOW()
),
(
  '2c78b283-6696-458d-9d29-e21da5b2e7e1',
  'document.getElementsByClassName()',
  false,
  'ff296f7c-521a-47ff-8d8f-743892d11f57',
  NOW(),
  NOW()
),
(
  'aeeee05f-a115-421d-8147-1102a02e5e96',
  'document.getTagName()',
  false,
  'ff296f7c-521a-47ff-8d8f-743892d11f57',
  NOW(),
  NOW()
),

-- Questão 9: Qual propriedade CSS controla o espaçamento entre as linhas do texto?
(
  'b8a7f2f4-9122-4063-9438-d733a6ac0913',
  'line-height',
  true,
  '3918b4a9-1cf2-4d0e-a032-fcb752359a49',
  NOW(),
  NOW()
),
(
  '777cce12-1f54-4f6c-b209-24b8aae1a06f',
  'letter-spacing',
  false,
  '3918b4a9-1cf2-4d0e-a032-fcb752359a49',
  NOW(),
  NOW()
),
(
  '12e34007-c064-490f-a98f-ced63ceb0e02',
  'word-spacing',
  false,
  '3918b4a9-1cf2-4d0e-a032-fcb752359a49',
  NOW(),
  NOW()
),
(
  'e1314e64-a7af-4952-9140-7da2d0cf0aeb',
  'text-indent',
  false,
  '3918b4a9-1cf2-4d0e-a032-fcb752359a49',
  NOW(),
  NOW()
),

-- Questão 10: Qual evento do JavaScript é acionado quando um usuário clica em um elemento?
(
  '30d6cb46-1263-4f3d-b483-cba49dfcf791',
  'click',
  true,
  '95dbfc43-a6ae-40d9-b4cb-b265c28affbe',
  NOW(),
  NOW()
),
(
  '1bff0649-e90d-499c-b327-5553577c3cb3',
  'mouseover',
  false,
  '95dbfc43-a6ae-40d9-b4cb-b265c28affbe',
  NOW(),
  NOW()
),
(
  'a832c796-bbdd-4bd7-917f-c25de8015f8c',
  'keydown',
  false,
  '95dbfc43-a6ae-40d9-b4cb-b265c28affbe',
  NOW(),
  NOW()
),
(
  '5ef2a077-8b82-43f5-b737-63951945d92d',
  'load',
  false,
  '95dbfc43-a6ae-40d9-b4cb-b265c28affbe',
  NOW(),
  NOW()
);

INSERT INTO labs (id, duration, difficulty, level, overview, guide, share, created_at, updated_at)
VALUES (
	'1afd02b2-249b-44bc-9520-9a4f439e0b94',
  3600,
  'beginner',
  'practitioner',
  '<p>A console permite aos usuários gerenciar e monitorar seus serviços e recursos da AWS.</p> <p><strong>Interface amigável:</strong> projetada para ser intuitiva, permite que mesmo aqueles com conhecimentos técnicos limitados possam gerenciar infraestruturas de TI.</p> <p><strong>Gerenciamento de serviços da AWS:</strong> oferece acesso a uma ampla gama de serviços, incluindo computação (EC2), armazenamento (S3), bases de dados (RDS), entre outros.</p> <p><strong>Monitoramento e gerenciamento de recursos:</strong> permite monitorar o uso, configurar alertas, visualizar logs e analisar métricas de desempenho.</p> <p><strong>Segurança:</strong> integra ferramentas para gerenciar identidades, acessos e criptografia, protegendo dados e recursos.</p> <p><strong>Personalização:</strong> pode ser ajustada conforme as preferências do usuário, facilitando o acesso aos serviços mais utilizados.</p> <p><strong>Acessibilidade global:</strong> baseada na web, pode ser acessada de qualquer lugar com conexão à internet.</p> <p><strong>Suporte a vários usuários:</strong> permite a criação de contas com diferentes níveis de acesso e permissões.</p> <p><strong>Atualizações constantes:</strong> a AWS atualiza regularmente a console para incluir novas funcionalidades e melhorias.</p> <p><strong>Assistência e documentação:</strong> oferece acesso a vasta documentação, recursos de aprendizado e suporte técnico.</p>',
  '<p>Para acessar a página da console, <a href="https://console.aws.amazon.com" target="_blank">clique aqui</a> ou coloque a URL no navegador de sua preferência. Em seguida, preencha os campos usando as credenciais ao lado, como demonstrado a seguir.</p>',
  '<p>Compartilhe sua experiência com este laboratório no LinkedIn! <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://labs.example.com/1afd02b2-249b-44bc-9520-9a4f439e0b94" target="_blank">Clique aqui</a> para criar um post e inspirar sua rede.</p>',
  NOW(),
  NOW()
);

INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'efb9e54f-8f81-4506-ac40-557bd5f2558f', -- product course id
  '1afd02b2-249b-44bc-9520-9a4f439e0b94' -- product lab id
);

INSERT INTO trails (id, level, created_at, updated_at)
VALUES (
	'dd9b22c7-11de-48ac-a600-ae5b9265a7d6',
  'practitioner',
  NOW(),
  NOW()
);

INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'dd9b22c7-11de-48ac-a600-ae5b9265a7d6', -- product trail id
  '724e4907-1807-410b-bc8f-7ccca880852c' -- product module id
);

INSERT INTO challenges (id, overview, instructions, duration, difficulty, level, created_at, updated_at)
VALUES (
	'b20d1fde-a583-4cb4-8add-efcf91bbcc08',
  '<p>O desafio oferece a oportunidade de aplicar seus conhecimentos de forma prática, sem um guia passo a passo tradicional. Uma restrição impede que os alunos saiam da página; caso contrário, o desafio será automaticamente finalizado. Essa abordagem promove maior concentração e uma experiência de aprendizado mais desafiadora e realista.</p>',
  '<p>A Dans Coffee precisa armazenar um arquivo de backup de forma segura fora da empresa. Após receber dicas sobre a Nuvem, decidiu contratar um consultor para criar um bucket S3 com boas práticas de segurança, garantindo que o objeto seja privado e seguro.</p><p>Esse teste (POC) servirá para avaliar a segurança antes de automatizar os backups. O time interno, sem experiência com Cloud e AWS, quer validar a solução antes de migrar os dados.</p><p><strong>Hora do desafio:</strong></p><p>Como Arquiteto de Soluções, seu desafio é armazenar o backup da Dans Coffee de forma segura na nuvem.</p> <p><strong>Requisitos:</strong></p> <ul><li>Utilizar o serviço Amazon S3</li><li>O arquivo deve estar criptografado</li><li>O arquivo não pode ser público</li><li>A região deve ser N. Virginia (us-east-1)</li><li>O prazo de entrega é de até 2 horas</li></ul>',
  3600,
  'beginner',
  'practitioner',
  NOW(),
  NOW()
);

INSERT INTO product_compositions (parent_id, child_id)
VALUES (
	'efb9e54f-8f81-4506-ac40-557bd5f2558f', -- product course id
  'b20d1fde-a583-4cb4-8add-efcf91bbcc08' -- product challenge id
);

INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES (
	'b8298c62-b3f7-4a39-8538-aa06bc8c76d4',
  'Desenvolvimento Web',
  'Exploração de tecnologias, ferramentas e melhores práticas para a construção de aplicações web modernas e performáticas.',
  NOW(),
  NOW()
), (
  'a58cf310-3a2a-4c5c-933a-3f983a1f6fac',
  'DevOps e Infraestrutura',
  'Discussões sobre automação, deployment, escalabilidade e monitoramento de sistemas para garantir alta disponibilidade e eficiência.',
  NOW(),
  NOW()
);

INSERT INTO topics (id, name, description, category_id, created_at, updated_at)
VALUES (
	'1780182e-a1e2-463d-990a-520198579ce4',
  'Frontend',
  'Desenvolvimento de interfaces interativas e responsivas, abordando frameworks, bibliotecas e boas práticas para melhorar a experiência do usuário.',
  'b8298c62-b3f7-4a39-8538-aa06bc8c76d4',
  NOW(),
  NOW()
), (
	'2a781d5b-bcaf-4087-a685-e422a4b6ea33',
  'Automação e Deploy',
  'Métodos e ferramentas para facilitar a integração contínua, entrega contínua e o gerenciamento de infraestrutura de forma eficiente e escalável.',
  'a58cf310-3a2a-4c5c-933a-3f983a1f6fac',
  NOW(),
  NOW()
);

INSERT INTO subtopics (id, name, description, topic_id, created_at, updated_at)
VALUES (
	'b2489336-de42-4feb-8853-f0ff6922a7b5',
  'React.js e seu ecossistema',
  'Discussão sobre o uso do React.js, incluindo hooks, state management, componentes reutilizáveis e bibliotecas populares como Next.js e Redux.',
  '1780182e-a1e2-463d-990a-520198579ce4',
  NOW(),
  NOW()
), (
	'aa0b8445-daed-4249-95ee-a20ebf7ba4b5',
  'Performance e otimização no frontend',
  'Estratégias para melhorar o carregamento e a fluidez de aplicações web, abordando lazy loading, code splitting e otimização de assets.',
  '1780182e-a1e2-463d-990a-520198579ce4',
  NOW(),
  NOW()
), (
	'dd958ad0-b094-47b3-b926-3fec07d4f02a',
  'CI/CD com GitHub Actions',
  'Como configurar pipelines automatizados para testes, build e deploy utilizando GitHub Actions, garantindo entregas ágeis e seguras.',
  '2a781d5b-bcaf-4087-a685-e422a4b6ea33',
  NOW(),
  NOW()
), (
	'583af393-1e10-4ab0-a0d8-4440932b195e',
  'Monitoramento e logging com Prometheus e Grafana',
  'Implementação de soluções para monitoramento em tempo real, análise de logs e visualização de métricas utilizando Prometheus e Grafana.',
  '2a781d5b-bcaf-4087-a685-e422a4b6ea33',
  NOW(),
  NOW()
);

INSERT INTO tags (id, name, description, alias, created_at, updated_at)
VALUES 
(
    'fe175c88-aa21-4759-9449-490b4b4c78a4',
    'React',
    'Discussões sobre React.js, seus conceitos e ecossistema',
    'react',
    NOW(),
    NOW()
),
(
    '89877524-a9ad-46e4-8242-fab37b8fe862',
    'Frontend',
    'Tópicos relacionados ao desenvolvimento de interfaces web',
    'frontend',
    NOW(),
    NOW()
),
(
    '2f2cc70c-c31d-47f6-a47c-2885190da712',
    'DevOps',
    'Automação, infraestrutura como código e boas práticas',
    'devops',
    NOW(),
    NOW()
),
(
    '0aaf116c-5ef1-4db4-8971-871401c6e57d',
    'GitHub Actions',
    'Configuração e otimização de pipelines CI/CD no GitHub',
    'github-actions',
    NOW(),
    NOW()
),
(
    '6fb1c169-e299-426e-91d0-a2b44f9c4a15',
    'Monitoramento',
    'Ferramentas e práticas para monitoramento de aplicações',
    'monitoramento',
    NOW(),
    NOW()
);

INSERT INTO posts (id, name, description, topic_id, subtopic_id, user_id, created_at, updated_at)
VALUES 
(
    '40e02d7e-9cfa-4d7a-83ce-2eee3d9262d3',
    'React.js e seu ecossistema',
    'O React.js revolucionou o desenvolvimento frontend com seu conceito de componentes reutilizáveis e reatividade eficiente. Neste post, exploramos seu ecossistema, abordando bibliotecas populares como Next.js, Redux e React Query, além das melhores práticas para gerenciamento de estado e otimização de performance.',
  	'1780182e-a1e2-463d-990a-520198579ce4',
    'b2489336-de42-4feb-8853-f0ff6922a7b5',
    '34688488-a001-706f-3e7d-eb00dde6e508',
    NOW(),
    NOW()
), 
(
    '1ab8fb32-439a-4c08-8bf7-2307efde2d74',
    'Performance e otimização no frontend',
    'A performance no frontend é essencial para garantir uma experiência fluida ao usuário. Discutimos técnicas como lazy loading, code splitting, otimização de imagens e o uso de ferramentas como Lighthouse e Webpack para melhorar o tempo de carregamento e a interatividade das aplicações web.',
  	'1780182e-a1e2-463d-990a-520198579ce4',
    'aa0b8445-daed-4249-95ee-a20ebf7ba4b5',
    '34688488-a001-706f-3e7d-eb00dde6e508',
    NOW(),
    NOW()
), 
(
    '141e2214-b157-4f3a-bb07-02e67f13931e',
    'CI/CD com GitHub Actions',
    'Automatizar o fluxo de desenvolvimento é essencial para garantir entregas rápidas e seguras. Neste post, abordamos como configurar pipelines de CI/CD com GitHub Actions, desde a execução de testes automatizados até o deploy contínuo, garantindo maior eficiência e qualidade no desenvolvimento de software.',
  	'2a781d5b-bcaf-4087-a685-e422a4b6ea33',
  	'dd958ad0-b094-47b3-b926-3fec07d4f02a',
    '34688488-a001-706f-3e7d-eb00dde6e508',
    NOW(),
    NOW()
), 
(
    'ce468dda-4a0c-4189-85ee-75f143b1a8a0',
    'Monitoramento e logging com Prometheus e Grafana',
    'Manter um sistema estável exige monitoramento contínuo e uma boa estratégia de logging. Exploramos como utilizar Prometheus para coletar métricas em tempo real e Grafana para criar dashboards visuais, permitindo a identificação rápida de problemas e a otimização do desempenho da infraestrutura.',
  	'2a781d5b-bcaf-4087-a685-e422a4b6ea33',
    '583af393-1e10-4ab0-a0d8-4440932b195e',
    '34688488-a001-706f-3e7d-eb00dde6e508',
    NOW(),
    NOW()
);

INSERT INTO comments (id, description, user_id, created_at, updated_at)
VALUES (
  'd0d5a60f-e14c-4cf6-8396-c3c013b171de',
  'Esse post está muito completo! Sempre tive dúvidas sobre qual ferramenta usar para gerenciar estado no React, e essa explicação me ajudou bastante. Obrigado por compartilhar!',
  '34688488-a001-706f-3e7d-eb00dde6e508', -- user id
  NOW(),
  NOW()
);

INSERT INTO post_comments (post_id, comment_id)
VALUES (
  '40e02d7e-9cfa-4d7a-83ce-2eee3d9262d3', -- post id
  'd0d5a60f-e14c-4cf6-8396-c3c013b171de' -- comment id
);

INSERT INTO comment_replies (id, description, comment_id, user_id, created_at, updated_at)
VALUES (
  '272c63e0-f4db-4298-bbdd-5b15c22a6247',
  'Esse post está muito completo! Sempre tive dúvidas sobre qual ferramenta usar para gerenciar estado no React, e essa explicação me ajudou bastante. Obrigado por compartilhar!',
  'd0d5a60f-e14c-4cf6-8396-c3c013b171de',
  '34688488-a001-706f-3e7d-eb00dde6e508',
  NOW(),
  NOW()
);

INSERT INTO post_tags (post_id, tag_id)
VALUES (
	'40e02d7e-9cfa-4d7a-83ce-2eee3d9262d3',
  'fe175c88-aa21-4759-9449-490b4b4c78a4'
), (
	'1ab8fb32-439a-4c08-8bf7-2307efde2d74',
  '89877524-a9ad-46e4-8242-fab37b8fe862'
), (
	'141e2214-b157-4f3a-bb07-02e67f13931e',
  '2f2cc70c-c31d-47f6-a47c-2885190da712'
), (
	'ce468dda-4a0c-4189-85ee-75f143b1a8a0',
  '6fb1c169-e299-426e-91d0-a2b44f9c4a15'
);

INSERT INTO support_tickets (id, subject, message, product_id, created_at, updated_at)
VALUES (
	'cc15402a-e03d-4bc9-94d5-4a361255e527',
  'Suporte à Infraestrutura de Servidores',
  'Eu estava tendo problemas com a performance do nosso servidor dedicado, que estava ficando muito lento durante o pico de tráfego. Entrei em contato com o suporte de TI para entender o que estava acontecendo, já que isso estava impactando nossos processos internos e o atendimento aos clientes. O atendente verificou a utilização de recursos do servidor e explicou que a instabilidade se devia ao alto consumo de CPU e memória. Ele sugeriu a atualização do servidor para uma configuração mais robusta e me forneceu os custos envolvidos na mudança, detalhando tanto os custos de hardware quanto o impacto financeiro mensal da manutenção.',
  'efb9e54f-8f81-4506-ac40-557bd5f2558f',
  NOW(),
  NOW()
), (
	'0e29cf91-e304-41ee-95d3-ad17cd040687',
  'Consultoria sobre Licenciamento de Software',
  'Eu precisava entender melhor os custos relacionados ao licenciamento de software utilizado pela nossa equipe de desenvolvimento. Conversei com o suporte de TI para revisar as licenças de ferramentas de colaboração e softwares de desenvolvimento que estávamos utilizando, como o GitHub e o JetBrains. O atendente me forneceu uma tabela comparativa entre as licenças individuais e empresariais e as diferenças de custo entre as versões. Além disso, ele também me explicou o processo de renovação e os custos adicionais que poderiam surgir dependendo do número de usuários. Fiquei mais claro sobre o impacto financeiro de manter as licenças em dia e comentei sobre a possibilidade de buscar alternativas mais baratas.',
  'efb9e54f-8f81-4506-ac40-557bd5f2558f',
  NOW(),
  NOW()
);