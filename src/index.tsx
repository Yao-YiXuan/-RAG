import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AppContainer, ErrorRender } from "@lark-apaas/client-toolkit-lite";
import { I18nProvider } from "@/lib/i18n";
import App from "./app";
import "./index.css";

// 应用保存的主题，防止页面闪烁
const savedTheme = localStorage.getItem('app-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={process.env.CLIENT_BASE_PATH || "/"}>
      <I18nProvider>
        <AppContainer>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorRender error={error} resetErrorBoundary={resetErrorBoundary} />
            )}
          >
            <App />
          </ErrorBoundary>
        </AppContainer>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
);
