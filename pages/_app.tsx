import React from "react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient();

interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
// const App= ({ Component, pageProps }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="container-fluid mx-auto min-h-screen">
          <Component {...pageProps} />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default App;
