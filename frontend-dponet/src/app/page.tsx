"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white px-6 md:px-20 py-6">
      <div className="min-h-[100vh] flex">
        {/* Logo no topo à esquerda */}
        <div className="absolute max-w-[80px] md:max-w-[120px]">
          <Image src="/dpo_logo.webp" alt="LGPD" width={120} height={120} />
        </div>

        {/* Seção principal centralizada */}
        <div className="flex flex-col items-center justify-center text-center flex-grow">
          <h1 className="text-3xl md:text-6xl font-bold">
            Adequação à <span className="text-[#f1c40f]">LGPD</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl max-w-2xl">
            Será que sua empresa está adequada às normas da LGPD? <br />
            Leia sobre e faça um questionário para descobrir!
          </p>

          <button
            onClick={() => router.push("https://www.dponet.com.br/")}
            className="mt-8 border border-white text-white font-medium px-6 py-3 md:text-lg md:px-6 md:py-5 rounded-full hover:bg-white hover:text-[#4A5FC1] transition duration-300"
          >
            Faça uma visita ao nosso site para saber mais
          </button>

          <button
            onClick={() => router.push("/questionario")}
            className="mt-8 border border-white text-white font-medium px-6 py-3 md:text-lg md:px-6 md:py-4 rounded-full hover:bg-white hover:text-[#4A5FC1] transition duration-300"
          >
            Fazer Questionário
          </button>
        </div>
      </div>

      {/* Seção de informações sobre LGPD */}
      <section className="w-full max-w-6xl mx-auto grid gap-12 px-4 md:px-0">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[#f1c40f]">
            O que é LGPD?
          </h2>
          <p className="text-xl text-white/90">
            A Lei Geral de Proteção de Dados (LGPD) é uma legislação brasileira
            que estabelece regras sobre a coleta, armazenamento, tratamento e
            compartilhamento de dados pessoais. Seu principal objetivo é
            garantir a privacidade e a proteção dos dados dos cidadãos,
            promovendo mais segurança, transparência e controle sobre as
            informações pessoais.
          </p>
        </div>

        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center text-[#f1c40f]">
            Princípios da LGPD
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xl text-white/90">
            <li>
              <strong>Finalidade:</strong> O tratamento de dados deve ter
              propósito legítimo, específico e informado ao titular.
            </li>
            <li>
              <strong>Adequação:</strong> Os dados tratados devem ser
              compatíveis com a finalidade informada.
            </li>
            <li>
              <strong>Necessidade:</strong> Limitação do tratamento ao mínimo
              necessário.
            </li>
            <li>
              <strong>Transparência:</strong> Garantia de informações claras e
              acessíveis.
            </li>
            <li>
              <strong>Segurança:</strong> Utilização de medidas técnicas e
              administrativas para proteger os dados pessoais.
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[#f1c40f]">
            Como funciona nosso questionário?
          </h2>
          <p className="text-xl text-white/90">
            Nosso questionário foi desenvolvido para avaliar o nível de
            conformidade da sua empresa com a LGPD. Com base nas suas respostas,
            geramos um relatório com o diagnóstico do seu grau de adequação e
            sugestões de melhorias práticas para alcançar a conformidade.
          </p>
        </div>

        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center text-[#f1c40f]">
            Pilares da LGPD
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xl text-white/90">
            <li>
              <strong>1. Governança e Gestão de Dados:</strong> Avalia se a
              empresa possui políticas e práticas de proteção de dados.
            </li>
            <li>
              <strong>2. Direitos dos Titulares:</strong> Verifica se os
              direitos dos titulares de dados são respeitados e atendidos.
            </li>
            <li>
              <strong>3. Segurança da Informação:</strong> Avalia o uso de
              ferramentas e procedimentos de segurança.
            </li>
            <li>
              <strong>4. Cultura Organizacional:</strong> Mede o nível de
              conhecimento e engajamento da equipe em relação à LGPD.
            </li>
          </ul>
        </div>
      </section>

      {/* Seção de relatório  */}
      <section className="w-full max-w-4xl mx-auto mt-20 px-4 text-white">
        <div className="p-6 md:p-10 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Relatório Final e Recomendações
          </h2>
          <ul className="space-y-3 text-lg leading-relaxed">
            <li>
              ☑ <strong>Pontuação geral e por pilar</strong>
            </li>
            <li>
              ☑ <strong>Classificação do risco:</strong> mínimo, moderado ou
              alto
            </li>
            <li>
              ☑ <strong>Sugestões de melhoria</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* Seção inferior - chamada para ação */}
      <div className="mt-20 flex flex-col items-center justify-center text-center gap-6">
        <p className="text-xl font-bold">Vamos começar a avaliação?!</p>
        <button
          onClick={() => router.push("/questionario")}
          className="bg-yellow-400 text-[#1b1785] font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
        >
          FAZER QUESTIONÁRIO
        </button>
      </div>
    </div>
  );
}
