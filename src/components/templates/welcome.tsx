import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

export const WelcomeTemplate = () => {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo à nossa plataforma!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-800">
          <Container className="bg-white p-6 rounded shadow-md my-10 mx-auto max-w-lg">
            <Section className="text-center">
              <Heading className="text-2xl font-bold mb-2">Bem-vindo!</Heading>
              <Text className="text-base leading-relaxed">
                Estamos muito felizes em ter você conosco. Prepare-se para
                explorar todos os recursos da nossa plataforma.
              </Text>
              <Text className="text-sm mt-4 text-gray-500">
                Caso tenha dúvidas, estamos sempre por aqui para te ajudar.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
