import { UserIcon } from "lucide-react";

export default async function Home() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-5">
        {/* Customers */}
        <div className="flex-1 border border-secondary p-5">
          <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
            <UserIcon className="size-4" />
          </div>
          <div>
            <h1>Quantidade de clientes</h1>
            <span>{34}</span>
          </div>
        </div>
        {/* Receivables */}
        <div className="flex-1 border border-secondary p-5">
          <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
            <UserIcon className="size-4" />
          </div>
          <div>
            <h1>Contas à receber</h1>
            <span>{34}</span>
          </div>
        </div>
        {/* Payables */}
        <div className="flex-1 border border-secondary p-5">
          <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
            <UserIcon className="size-4" />
          </div>
          <div>
            <h1>Contas à pagar</h1>
            <span>{34}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
