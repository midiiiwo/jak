import HeaderPage from "@/components/header";
import { Box } from "@chakra-ui/react";
import FooterPage from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box minH="100vh" bg="white" color="gray.900">
      <HeaderPage />
      {children}
      <FooterPage />
      <Toaster />
    </Box>
  );
}