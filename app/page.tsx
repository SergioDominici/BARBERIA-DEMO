import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Barbers from "@/components/Barbers";
import ImageBand from "@/components/ImageBand";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Marquee from "@/components/Marquee";
import PricesMenu from "@/components/PricesMenu";
import ContactMap from "@/components/ContactMap";
import CtaBooking from "@/components/CtaBooking";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Barbers />
      <ImageBand />
      <Gallery />
      <Testimonials />
      <Marquee />
      <PricesMenu />
      <ContactMap />
      <CtaBooking />
    </>
  );
}
