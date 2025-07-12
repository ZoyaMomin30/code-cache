"use client"

import Link from "next/link"
import { Code2, NotebookPen } from "lucide-react"
import { LoginForm } from "@/app/components/auth/login-form"
import { Card, CardContent } from '@/app/components/ui/card';
import { Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';



const AnimatedCodeSnippet = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = `organise();
store();
share();`;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      // Reset animation after completion
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
      }, 3000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, fullText]);
  return (
    <pre className="text-green-400 whitespace-pre-wrap">
      {displayedText}
      <span className="animate-pulse text-white">|</span>
    </pre>
  );
};


export default function LoginPage() {

  return (

    <div className="min-h-screen bg-black flex-col flex-end justify-end items-end py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

    </div>

  )
}
