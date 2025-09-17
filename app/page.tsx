import FooterPage from "@/components/footer";
import HeaderPage from "@/components/header";
import Home from "./(client)/home/page";

export default function CustomerOnly() {
  return (
    <>
      <HeaderPage />
      <Home />
      <FooterPage />
    </>
  );
}