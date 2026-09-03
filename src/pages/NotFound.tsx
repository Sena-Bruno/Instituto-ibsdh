import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <Helmet>
        <title>Página não encontrada | Instituto SENA</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="w-24 h-24 mb-8">
        <img referrerPolicy="no-referrer"  src="/logo-do-instituto.svg" alt="Instituto Bruno Sena" className="w-full h-full object-contain opacity-50" />
      </div>
      
      <h1 className="font-display text-8xl md:text-9xl font-bold text-white mb-4 drop-shadow-2xl">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Página não encontrada</h2>
      <p className="text-brand-platinum/80 max-w-md mb-12 text-lg">
        A página que você está procurando não existe ou foi movida. Volte para a página inicial para continuar sua jornada.
      </p>
      
      <Link 
        to="/"
        className="inline-flex items-center gap-2 bg-brand-accent text-brand-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
      >
        <Home size={20} />
        Voltar para o Início
      </Link>
    </div>
  );
};

export default NotFound;
