"use client";

import { useRouter } from "next/router";
import Head from "next/head";

import MetaHead from "@/components/MetaHead/MetaHead";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";
import SectionHeader from "@/components/shared/SectionHeader/SectionHeader";

// Import your tool components

import JsPlayground from "@/components/JsPlayground/JsPlayground";
import ImageToText from "@/components/ImageToText/ImageToText";
import PDFToWordConverter from "@/components/PDFToWordConverter/PDFToWordConverter";

import MeshGenerator from "@/components/MeshGenerator/MeshGenerator";
import ScreenRecorder from "@/components/ScreenRecorder/ScreenRecorder";
import ImageEditor from "@/components/ImageEditor/ImageEditor";
import ScaleMapper from "@/components/ScaleMapper/ScaleMapper";

import Tuner from "@/components/Tuner/Tuner";
import Planner from "@/components/Planner/Planner";
import Todo from "@/components/Todo/Todo";
import BoxShadowGenerator from "@/components/BoxShadowGenerator/BoxShadowGenerator";
import { Palette } from "@/components/Palette/Pallete";
import ResumeBuilder from "@/components/ResumeBuilder/ResumerBuilder";
import { utilities } from "@/data/lists/utilities";
import AudioVisualizer from "@/components/AudioVisualizer/AudioVisualizer";
import ChordDetector from "@/components/ChordDetector/ChordDetector";
import PdfEditor from "@/components/PdfEditor/PdfEditor";
import Metronome from "@/components/Metronome/Metronome";
import { TextTools } from "@/components/TextTools/TextTools";
import { QRCodeGenerator } from "@/components/QRCodeGenerator/QRCodeGenerator";
import { PasswordGenerator } from "@/components/PasswordGenerator/PasswordGenertator";
import { JSONFormatter } from "@/components/JSONFormatter/JSONFormatter";
import { UnitConverter } from "@/components/UnitConverter/UnitConverter";
import { SpeedTest } from "@/components/SpeedTest/SpeedTest";
import { Base64Tool } from "@/components/Base64Tool/Base64Tool";
import { VideoToGIF } from "@/components/VideoToGIF/VideoToGIF";
import { PageSpeedTool } from "@/components/PageSpeedTool/PageSpeedTool";
import { ImageConverter } from "@/components/ImageConverter/ImageConverter";


// 1. Create the Map
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  palette: Palette,
  javascriptplayground: JsPlayground,
  imagetotext: ImageToText,
  pdftowordconverter: PDFToWordConverter,
  resumebuilder: ResumeBuilder,
  meshgenerator: MeshGenerator,
  screenrecorder: ScreenRecorder,
  imageeditor: ImageEditor,
  scalemapper: ScaleMapper,
  metronome: Metronome,
  audiovisualizer: AudioVisualizer,
  tuner: Tuner,
  chorddetector: ChordDetector,
  planner: Planner,
  pdfeditor: PdfEditor,
  todo: Todo,
  boxshadowgenerator: BoxShadowGenerator,
  "text-tools": TextTools,
  "qrcode-generator": QRCodeGenerator,
  "password-generator": PasswordGenerator,
  "json-formatter": JSONFormatter,
  "unit-converter": UnitConverter,
  "speed-test": SpeedTest,
  "base64-tool": Base64Tool,
  "video-to-gif": VideoToGIF,
  "pagespeed-insights": PageSpeedTool,
  "image-converter": ImageConverter,
};

export default function UtilityToolPage() {
  const router = useRouter();
  const { slug } = router.query;

  const tool = utilities.find((u) => u.slug === slug);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lizardinteractive.online";

  if (!router.isReady) return null;
  if (!tool) return <p>System Error: Module Not Found</p>;

  // 2. Resolve the Component
  const SelectedTool = TOOL_COMPONENTS[tool.slug as string];

  // Generate category-specific keywords
  const getKeywords = () => {
    const baseKeywords = "online tool, free tool, web utility";
    const categoryKeywords: Record<string, string> = {
      Dev: "developer tools, programming, code",
      Design: "design tools, UI, CSS",
      Files: "file converter, document editor",
      Productivity: "productivity tools, work efficiency",
      Media: "media tools, video, image",
      Music: "music tools, audio, guitar",
      Security: "security tools, password, encryption",
      Network: "network tools, speed test, connection",
    };
    return `${tool.name}, ${categoryKeywords[tool.category] || ""}, ${baseKeywords}`;
  };

  return (
    <>
      <MetaHead data={{ title: tool.name, description: tool.description }} />

      {/* Additional SEO Head tags */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{tool.name} | Lizard Interactive Online Tools</title>
        <meta name="title" content={`${tool.name} | Lizard Interactive Online Tools`} />
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={getKeywords()} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/tools/${tool.slug}`} />
        <meta property="og:title" content={`${tool.name} | Lizard Interactive`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${baseUrl}/tools/${tool.slug}`} />
        <meta property="twitter:title" content={`${tool.name} | Lizard Interactive`} />
        <meta property="twitter:description" content={tool.description} />
        <meta property="twitter:image" content={`${baseUrl}/og-image.png`} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}/tools/${tool.slug}`} />

        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": tool.name,
              "description": tool.description,
              "applicationCategory": tool.category,
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "url": `${baseUrl}/tools/${tool.slug}`,
              "author": {
                "@type": "Organization",
                "name": "Lizard Interactive"
              }
            })
          }}
        />

        {/* Additional meta tags for better SEO */}
        <meta name="author" content="Lizard Interactive" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Theme color */}
        <meta name="theme-color" content="#10b981" />
      </Head>

      <ScreenContainer className="pt-20 px-3 md:pt-30 ">
        {SelectedTool ? (
          <SelectedTool />
        ) : (
          <div className="p-20 border border-dashed border-zinc-800 text-center">
            <p className="text-zinc-500 font-mono uppercase tracking-widest text-xs">
              Interface Initialization Failed: Component not mapped.
            </p>
          </div>
        )}
      </ScreenContainer>
    </>
  );
}