"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { labels } from "@/utils/nivelLabels";

interface PilarDetalhe {
  defasagem: number;
  percentual: number;
  mensagem: string;
  melhorias: string[];
}

interface ResultadoData {
  defasagemTotal: number;
  risco: string;
  detalhesPilares: { [key: string]: PilarDetalhe };
  nivel?: string;
}

interface RespostaUsuario {
  pergunta_id: number;
  resposta: string;
}

const coresRisco: { [key: string]: string } = {
  "Nenhuma deficiência": "bg-green-500",
  "Defasagem mínima": "bg-green-400",
  "Defasagem moderada": "bg-yellow-500",
  "Defasagem significativa": "bg-orange-500",
  "Defasagem grave": "bg-red-500",
  "Defasagem crítica": "bg-red-700",
};

const coresDefasagem: { [key: string]: string } = {
  "Excelente! Nenhuma deficiência identificada.": "bg-green-500",
  "Muito bom! Pequenos ajustes podem ser feitos.": "bg-green-400",
  "Moderado. Você pode melhorar com algumas ações específicas.":
    "bg-yellow-500",
  "Atenção! Algumas áreas precisam de melhorias significativas.":
    "bg-orange-500",
  "Preocupante. Muitas deficiências detectadas.": "bg-red-500",
  "Crítico! Esse pilar exige atenção urgente.": "bg-red-700",
};

export default function Resultado() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [resultado, setResultado] = useState<ResultadoData | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pilarSelecionado, setPilarSelecionado] = useState<string | null>(null);
  const URL_BASE = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const resultadoSalvo = localStorage.getItem("resultadoFinal");
    if (resultadoSalvo) {
      setResultado(JSON.parse(resultadoSalvo));
      setCarregando(false);
    } else {
      setErro("Nenhum resultado encontrado.");
      setCarregando(false);
    }
  }, []);

  const baixarPDF = async () => {
    const resultadoSalvo = localStorage.getItem("resultadoFinal");
    if (!resultadoSalvo) return alert("Resultado não encontrado!");

    const resultado = JSON.parse(resultadoSalvo);

    const response = await fetch(`${URL_BASE}/api/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        respostas: resultado.respostas.map((r: RespostaUsuario) => ({
          pergunta_id: r.pergunta_id,
          resposta: r.resposta,
        })),
        perguntas: resultado.perguntas,
        nivel: resultado.nivel,
      }),
    });

    if (!response.ok) {
      return alert("Erro ao gerar PDF.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-lgpd.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (carregando)
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white">
        <Loader2 className="animate-spin w-10 h-10" />
        <h2>Carregando resultado...</h2>
      </div>
    );

  if (erro || !resultado)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white">
        <p className="text-center">{erro || "Erro ao carregar o resultado."}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
        >
          Voltar ao Início
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white p-3 relative">
      {pilarSelecionado && (
        <div className="absolute inset-0 bg-black/50 z-10" />
      )}

      <div className="bg-white/15 rounded-2xl shadow-lg px-4 py-6 w-full max-w-lg text-center animate-fade-in flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-white">
          Resultado da Avaliação
        </h1>

        {resultado.nivel && (
          <p className="text-sm text-blue-200 uppercase tracking-wide">
            Nível respondido:{" "}
            <span className="font-bold">{labels[resultado.nivel]}</span>
          </p>
        )}

        <div
          className={`p-3 rounded-lg text-white font-semibold text-lg ${
            coresRisco[resultado.risco] || "bg-gray-500"
          }`}
        >
          {resultado.risco}
        </div>

        <hr className="border-t border-white/20 w-full" />

        <button
          onClick={baixarPDF}
          className="inline-flex items-center justify-center gap-2 p-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition duration-300 shadow-md cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m-3-9v6"
            />
          </svg>
          Baixar Relatório em PDF
        </button>
      </div>

      <h2 className="m-5 text-2xl font-semibold">Defasagem por Pilar</h2>

      <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Object.entries(resultado.detalhesPilares).map(([nome, detalhe]) => {
          const isOpen = pilarSelecionado === nome;
          return (
            <div
              key={nome}
              className={clsx(
                "relative h-[400px] p-6 pt-0 bg-white/15 text-white rounded-lg shadow-2xl flex flex-col items-center w-60 transition-all duration-300 z-20",
                {
                  "z-30 scale-110 ring-4 ring-white": isOpen,
                  "opacity-50": pilarSelecionado && !isOpen,
                }
              )}
            >
              <div
                className={`w-full h-5 rounded-t-lg absolute z-0 ${
                  coresDefasagem[detalhe.mensagem]
                }`}
              />
              <h2 className="text-xl text-center font-bold pt-8">
                {nome.toUpperCase()}
              </h2>
              <div className="absolute top-[48%] transform -translate-y-[48%]">
                <div className="relative flex items-center justify-center w-24 h-24">
                  <CircularProgress
                    variant="determinate"
                    value={detalhe.percentual}
                    size={96}
                    thickness={6}
                    className="text-white"
                  />
                  <span className="absolute text-2xl font-bold z-10">
                    {detalhe.percentual}%
                  </span>
                </div>
              </div>
              <p className="absolute bottom-24 text-sm text-center text-gray-200">
                {detalhe.mensagem}
              </p>
              <button
                className={`absolute bottom-8 px-5 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-200 transition-all ${
                  detalhe.defasagem === 0 ? "cursor-auto" : "cursor-pointer"
                }`}
                onClick={() =>
                  setPilarSelecionado(
                    detalhe.defasagem === 0 ? null : isOpen ? null : nome
                  )
                }
              >
                {detalhe.defasagem === 0
                  ? "Sem melhorias"
                  : isOpen
                  ? "Fechar"
                  : "Ver melhorias"}
              </button>
              {isOpen && (
                <div className="absolute top-0 right-[-292px] w-72 bg-white text-gray-800 rounded-lg shadow-xl z-40">
                  <div
                    className={`w-5 h-full rounded-tr-lg rounded-br-lg absolute right-0 z-0 ${
                      coresDefasagem[detalhe.mensagem]
                    }`}
                  />
                  <h3 className="font-bold text-lg pt-4 pl-4">
                    Sugestões de melhoria
                  </h3>
                  <ol className="mt-2 pl-4 pr-6 pb-3 text-left text-gray-700 list-decimal ml-5 marker:font-bold">
                    {detalhe.melhorias.map((melhoria, index) => (
                      <li key={index} className="mb-1">
                        {melhoria}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-400 transition-all cursor-pointer"
      >
        Voltar ao Início
      </button>
    </div>
  );
}
