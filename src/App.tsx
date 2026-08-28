import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { YesterdayCustomersPage } from "@/pages/YesterdayCustomersPage";
import { QueuePage } from "@/pages/QueuePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="clientes-ontem" element={<YesterdayCustomersPage />} />
        <Route path="fila" element={<QueuePage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="clientes" element={<PlaceholderPage title="Clientes" description="Histórico completo e relacionamento de cada cliente." />} />
        <Route path="relatorios" element={<PlaceholderPage title="Relatórios" description="Indicadores de pós-venda, respostas e evolução da operação." />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
