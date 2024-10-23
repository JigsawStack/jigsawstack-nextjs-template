import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VOCRExample from "@/components/examples/VOCRExample";
import TranslationExample from "@/components/examples/TranslationExample";
import SentimentExample from "@/components/examples/SentimentExample";
import ColorModeToggle from "@/components/ColorModeToggle";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Header navigation */}
      <header className="flex justify-between items-center p-4 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-md lg:text-xl font-semibold mr-2">
            Next.JS JigsawStack Starter
          </h1>
          <ColorModeToggle />
        </div>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJigsawStack%2Fjigsawstack-vercel-template&env=NEXT_PUBLIC_JIGSAWSTACK_PUBLIC_KEY">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </header>

      <main className="flex flex-col gap-8 lg:w-5/12 w-full mx-auto p-2 lg:p-8">
        <Tabs defaultValue="get_started" className="flex flex-col flex-1">
          <TabsList className="overflow-y-scroll">
            <TabsTrigger value="get_started">Get Started</TabsTrigger>
            <TabsTrigger value="vocr">vOCR</TabsTrigger>
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>
          <TabsContent value="get_started">
            <div className="flex flex-col pt-[5rem]">
              <div className="flex flex-row flex-1 overflow-hidden justify-around items-center">
                <a href={"https://jigsawstack.com"}>
                  <img
                    src="/jigsawstack_logo.svg"
                    alt="JigsawStack"
                    className="lg:w-[14rem] w-[11rem]"
                  />
                </a>
                <a href={"https://nextjs.org"}>
                  <img
                    src="/nextjs_logo.svg"
                    alt="NextJS"
                    className="dark:invert lg:w-[12rem] w-[10rem]"
                  />
                </a>
              </div>
              <h1 className="text-3xl lg:text-4xl font-medium text-center pt-[3rem]">
                The fatest way to get started with JigsawStack in Next.JS
              </h1>
            </div>
          </TabsContent>
          <TabsContent value="vocr">
            <VOCRExample />
          </TabsContent>
          <TabsContent value="translate">
            <TranslationExample />
          </TabsContent>
          <TabsContent value="sentiment">
            <SentimentExample />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
