/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Sparkles, RefreshCw, ClipboardCheck, Type, Layout, Wand2 } from "lucide-react";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const transformText = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rearrange the following text by changing the word order and linguistic flow while keeping the EXACT same meaning and subject matter. 
        CRITICAL INSTRUCTIONS:
        1. LINGUISTIC REARRANGEMENT: Change how the sentences are structured by rearranging words for a fresh flow (e.g., "আমি তোমাকে ভালোবাসি" could become "তোমাকে আমি ভালোবাসি").
        2. NO ADDITIONS OR DELETIONS: Do not add any new information, do not remove any existing information, and do not change the intent.
        3. SPELLING & GRAMMAR: Ensure the rearranged text is grammatically correct and has no spelling errors.
        4. STRUCTURE: You MUST preserve the original structure exactly (keep all headings, subheadings, and paragraphs in their original order).
        
        Text to transform:
        ${inputText}`,
      });

      setOutputText(response.text || "Sorry, I couldn't transform that text.");
    } catch (error) {
      console.error("Transformation error:", error);
      setOutputText("An error occurred while transforming the text. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Wand2 size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight italic serif">Text Cloner</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Input Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-black/40">
                <Type size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">আপনার টেক্সট এখানে দিন</span>
              </div>
              {inputText && (
                <button 
                  onClick={() => setInputText("")}
                  className="text-xs text-black/40 hover:text-black underline underline-offset-4"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-[400px] p-6 bg-white border border-black/10 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-lg leading-relaxed"
              />
              <div className="absolute bottom-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={transformText}
                  disabled={isLoading || !inputText.trim()}
                  className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-2xl shadow-orange-200 flex items-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all hover:bg-orange-700 active:scale-95"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  <span className="text-lg">
                    {isLoading ? "জেনারেট হচ্ছে..." : "জেনারেট করুন"}
                  </span>
                </motion.button>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-black/40">
                <Layout size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">নতুন ভাবে সাজানো টেক্সট</span>
              </div>
            </div>

            <div className="relative group h-[400px]">
              <div className="h-full bg-[#141414] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
                <AnimatePresence mode="wait">
                  {!outputText && !isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-white/20 p-12 text-center"
                    >
                      <div className="w-16 h-16 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles size={24} />
                      </div>
                      <p className="text-sm font-medium">Your transformed text will appear here</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={outputText + isLoading}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full overflow-y-auto p-8 text-white/90 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                    >
                      {isLoading ? (
                        <div className="space-y-4 opacity-50">
                          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                          <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
                          <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse" />
                        </div>
                      ) : (
                        outputText
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Styled Copy Button */}
              {outputText && !isLoading && (
                <div className="absolute bottom-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyToClipboard}
                    className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-2xl shadow-orange-200 flex items-center gap-3 transition-all hover:bg-orange-700 active:scale-95"
                  >
                    {copied ? <ClipboardCheck size={20} /> : <Copy size={20} />}
                    <span className="text-lg">
                      {copied ? "কপি হয়েছে!" : "কপি করুন"}
                    </span>
                  </motion.button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-black/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-black/40 text-xs font-medium uppercase tracking-widest">
          <p>© 2026 AI Text Cloner</p>
          <div className="flex gap-8">
            <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-black cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
