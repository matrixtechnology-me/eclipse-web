"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

type CountdownProps = {
  initialTime: number;
};

export const Countdown = ({ initialTime }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast("Sessão Expirada", {
            description:
              "Sua sessão expirou. Você será redirecionado para o login.",
            icon: <XCircle className="h-6 w-6 text-red-500" />,
          });
          setTimeout(() => {
            router.push(PATHS.PUBLIC.AUTH.SIGN_IN);
          }, 2000);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-sm text-muted-foreground">
      Sua sessão expirará em {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
      minutos.
    </div>
  );
};
