import { Box } from "@chakra-ui/react";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import FeaturedProductsSection from "./featured-products-section";
import AvailableProducts from "./products-available";
import FooterSection from "./footer-section";

export default function HomePage() {
  return (
    <>
      <Box bg="white" h={20}></Box>
      <Box minH="100vh">
        <HeroSection />
        <FeaturesSection />
        <FeaturedProductsSection />
        <AvailableProducts />
        <FooterSection />
      </Box>
    </>
  );
}