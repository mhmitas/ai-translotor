"use client";

import React, { useState } from 'react';
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';
import { Copy, Volume2, ArrowLeftRight } from 'lucide-react';
import { translateText } from "@/lib/actions/translate";
import { toast } from "sonner"
import { markdownToHtml } from "@/lib/utils";
// Your server action

const TranslationSection = () => {
  const [sourceLanguage, setSourceLanguage] = useState<string>('English');
  const [targetLanguage, setTargetLanguage] = useState<string>('Spanish');
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [parsedHtml, setParsedHtml] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.warning("Please enter text to translate")
      return;
    }

    if (sourceLanguage === targetLanguage) {
      toast.warning("Please select different languages")
      return;

    }

    setIsTranslating(true);
    try {
      const result = await translateText({
        sourceLanguage,
        targetLanguage,
        text: inputText
      });

      setTranslatedText(result);

      const translatedHtml = await markdownToHtml(result);
      setParsedHtml(translatedHtml);
    } catch (error) {
      toast("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    toast("Copied!");
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Language Selection Header */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-center sm:gap-3 md:gap-4">
          <div className="w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px]">
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="w-full h-10 sm:h-9 text-sm sm:text-base">
                <SelectValue placeholder="Source language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full self-center sm:self-auto h-10 w-10 sm:h-9 sm:w-9 shrink-0"
            onClick={handleSwapLanguages}
          >
            <ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Swap languages</span>
          </Button>

          <div className="w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px]">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-full h-10 sm:h-9 text-sm sm:text-base">
                <SelectValue placeholder="Target language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Translation Interface */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type your text here..."
                className="min-h-[180px] sm:min-h-[200px] md:min-h-[240px] resize-none w-full border-2 focus-visible:ring-2 focus-visible:ring-primary/50 text-sm sm:!text-base leading-relaxed p-3 sm:p-4"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    e.preventDefault()
                    handleTranslate()
                  }
                }}
              />
              {/* Character count for mobile */}
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                {inputText.length}
              </div>
            </div>

            <div className="flex justify-center sm:justify-start">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className="w-full sm:w-auto min-w-[120px] h-10 sm:h-9"
                size="sm"
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="relative">
            <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[240px] w-full rounded-md border-2 bg-muted/30 relative">
              {/* Action buttons - repositioned for mobile */}
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 sm:px-3 text-xs sm:text-sm border-background/20 bg-background/80 backdrop-blur-sm"
                  onClick={handleCopy}
                  disabled={!translatedText}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 sm:px-3 text-xs sm:text-sm border-background/20 bg-background/80 backdrop-blur-sm"
                  onClick={handleSpeak}
                  disabled={!translatedText}
                >
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Listen</span>
                </Button>
              </div>

              {/* Translation content */}
              <div className="p-3 sm:p-4 pt-12 sm:pt-10 h-full">
                {parsedHtml ? (
                  <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
                ) : (
                  <p className="text-muted-foreground">Translation will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-specific help text */}
        <div className="text-center text-xs text-muted-foreground sm:hidden">Press Ctrl+Enter to translate quickly</div>
      </div>
    </div>
  );
};

export default TranslationSection;

const languages = [
  { label: "English", value: "English" },
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
  { label: "German", value: "German" },
  { label: "Bengali", value: "Bengali" },
  { label: "Hindi", value: "Hindi" }
];