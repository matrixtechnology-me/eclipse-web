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

interface ForgotPasswordTemplateProps {
  verificationCode: string;
}

export const ForgotPasswordTemplate = ({
  verificationCode,
}: ForgotPasswordTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Código de verificação para redefinir sua senha</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-800">
          <Container className="bg-white p-6 rounded shadow-md my-10 mx-auto max-w-lg">
            <Section className="text-center">
              <Heading className="text-2xl font-bold mb-4">
                Redefinir Senha
              </Heading>
              <Text className="text-base leading-relaxed mb-4">
                Você solicitou a redefinição de sua senha. Use o código de
                verificação abaixo:
              </Text>
              <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="text-3xl font-mono font-bold tracking-widest text-center">
                  {verificationCode}
                </Text>
              </Section>
              <Text className="text-base leading-relaxed mb-4">
                Este código é válido por 15 minutos. Se você não solicitou esta
                redefinição, ignore este e-mail.
              </Text>
              <Text className="text-sm mt-4 text-gray-500">
                Por motivos de segurança, nunca compartilhe este código com
                outras pessoas.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
