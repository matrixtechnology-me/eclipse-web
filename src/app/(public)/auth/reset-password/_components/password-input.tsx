import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FC, useState } from "react";
import { UseFormReturn, Path } from "react-hook-form";

type PasswordInputProps<T extends Record<string, any>> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
};

export const PasswordInput: FC<PasswordInputProps<any>> = ({
  form,
  name,
  label = "Senha",
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha segura"
                className="border-r-[0.5px] rounded-r-none"
                {...field}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="border-l-[0.5px] rounded-l-none"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
