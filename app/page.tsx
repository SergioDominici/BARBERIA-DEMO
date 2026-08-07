import Hero from "@/components/Hero";
import Barbers from "@/components/Barbers";
import ImageBand from "@/components/ImageBand";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import PricesMenu from "@/components/PricesMenu";
import CtaBooking from "@/components/CtaBooking";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Barbers />
      <ImageBand />
      <Gallery />
      <Testimonials />
      <PricesMenu />
      <CtaBooking />
    </>
  );
}
