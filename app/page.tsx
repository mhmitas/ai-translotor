import TranslationSection from "@/components/shared/translation-section";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center p-4">AI Language Translator</h1>
      <section className="relative">
        <TranslationSection />
      </section>
    </div>
  );
}
