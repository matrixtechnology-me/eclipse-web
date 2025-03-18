import fs from 'fs';

const extractName = (regex: RegExp, block: string): string => {
  const match = regex.exec(block);
  return match ? match[1] : '';
};

const sortSchema = (schema: string): string => {
  const modelRegex = /model\s+(\w+)\s+\{[^}]+\}/gs;
  const enumRegex = /enum\s+(\w+)\s+\{[^}]+\}/gs;
  const nameRegex = /(?:model|enum)\s+(\w+)/;

  const models = schema.match(modelRegex) || [];
  const enums = schema.match(enumRegex) || [];

  const schemaWithoutModelsEnums = schema
    .replace(modelRegex, '')
    .replace(enumRegex, '')
    .trim();

  models.sort((a, b) =>
    extractName(nameRegex, a).localeCompare(extractName(nameRegex, b))
  );
  enums.sort((a, b) =>
    extractName(nameRegex, a).localeCompare(extractName(nameRegex, b))
  );

  return (
    [schemaWithoutModelsEnums, ...enums, ...models]
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
};

const schemaPath = 'prisma/schema.prisma';
const schema = fs.readFileSync(schemaPath, 'utf-8');
const sortedSchema = sortSchema(schema);
fs.writeFileSync(schemaPath, sortedSchema, 'utf-8');

console.log('✅ Prisma models & enums sorted alphabetically');
