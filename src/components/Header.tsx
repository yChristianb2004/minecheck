import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-emerald-100 rounded-full">
          <Gamepad2 className="w-8 h-8 text-emerald-600" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Minecraft Nick Finder
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Encontre usernames disponíveis para Minecraft de forma rápida e fácil. 
        Escolha uma letra ou digite uma palavra-chave para começar a busca.
      </p>
    </header>
  );
}