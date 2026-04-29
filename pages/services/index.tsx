"use client";

import MetaHead from "@/components/MetaHead/MetaHead";
import Hero from "@/components/shared/Hero/Hero";
import Newsletter from "@/components/shared/NewsLetter/NewsLetter";
import PresentationSection from "@/components/shared/PresentationSection/PresentationSection";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";
import ServicesCards from "@/components/shared/ServicesCards/ServicesCards";
import { niches } from "@/data/lists/nichesList";
import { landingPagePresentation } from "@/data/page/landingPagePresentation";
import { lizardContent } from "@/data/page/lizardContent";

import { servicesContent } from "@/data/servicesContent";
import { Presentation } from "lucide-react";


export default function ServicesPage() {

  const seoEntry = servicesContent.find((item) => item.type === "seo");
  return (

      <ScreenContainer>
      <MetaHead data={seoEntry?.data} />
      {/* <Hero homeContent={servicesContent} /> */}
      <PresentationSection
             data={lizardContent}
                   badge="Lizard Interactive Online // v1.1"
                 />
      <PresentationSection
        data={landingPagePresentation}
        badge="Deployment Blueprint // v2.1"
      />
      {/* <ServicesCards
        niches={niches} /> */}
      <Newsletter />

    </ScreenContainer>
  );
}