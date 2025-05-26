"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Loader2 } from "lucide-react";
import { labels } from "@/utils/nivelLabels";

interface Opcao {
  resposta: string;
  pontos: number;
  melhoria?: string;
}

interface Pergunta {
  id: number;
  pilar_id: number;
  pergunta: string;
  opcoes: Opcao[];
}

const TOTAL_PERGUNTAS = 25;
const URL_BASE = process.env.URL;

const PILARES: Record<number, string> = {
  1: "Governança",
  2: "Coleta e Tratamento de Dados",
  3: "Segurança e Controle de Acesso",
  4: "Tempo de Retenção e Exclusão de Dados",
  5: "Relacionamento com Titulares dos Dados",
};

export default function QuestionarioMain({ nivel }: { nivel: string }) {
  const router = useRouter();
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [resposta, setResposta] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [progresso, setProgresso] = useState<number>(0);
  const [numeroPergunta, setNumeroPergunta] = useState<number>(1);
  const [respostas, setRespostas] = useState<
    { pergunta_id: number; resposta: string; pergunta: string }[]
  >([]);

  useEffect(() => {
    if (!nivel) {
      router.push("/");
      return;
    }
    iniciarQuestionario(nivel);
  }, []);

  const iniciarQuestionario = async (nivelAtual: string) => {
    try {
      await fetch(`${URL_BASE}/api/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nivel: nivelAtual }),
      });
      buscarPergunta();
    } catch (err) {
      console.error("Erro ao iniciar questionário:", err);
    }
  };

  const buscarPergunta = async () => {
    try {
      const res = await fetch(`${URL_BASE}/api/pergunta`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.mensagem) {
        router.push("/resultado");
      } else {
        setPergunta(data);
        setProgresso((numeroPergunta / TOTAL_PERGUNTAS) * 100);
      }
    } catch (err) {
      console.error("Erro ao buscar pergunta:", err);
    } finally {
      setCarregando(false);
    }
  };

  const handleResponder = async () => {
    if (!resposta || !pergunta) return;
    try {
      const res = await fetch(`${URL_BASE}/api/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ resposta }),
      });

      const data = await res.json();

      setRespostas((prev) => [
        ...prev,
        {
          pergunta_id: pergunta.id,
          resposta: resposta,
          pergunta: pergunta.pergunta,
        },
      ]);

      if (data.mensagem === "Todas as perguntas foram respondidas!") {
        const resultadoRes = await fetch(`${URL_BASE}/api/resultado`, {
          method: "POST",
          credentials: "include",
        });
        const resultadoData = await resultadoRes.json();

        localStorage.setItem(
          "resultadoFinal",
          JSON.stringify({
            ...resultadoData.resultado,
            respostas,
            perguntas: respostas.map((r) => ({
              id: r.pergunta_id,
              pergunta: r.pergunta,
            })),
            nivel,
          })
        );

        router.push("/resultado");
        return;
      } else {
        setNumeroPergunta((prev) => prev + 1);
        setResposta(null);
        buscarPergunta();
      }
    } catch (err) {
      console.error("Erro ao responder pergunta:", err);
    }
  };

  if (carregando)
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white">
        <Loader2 className="animate-spin w-10 h-10" />
        <h2 className="text-lg font-medium">Carregando perguntas...</h2>
      </div>
    );

  if (!pergunta || !nivel)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white">
        <p className="text-lg">Erro ao carregar perguntas.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-white/20 border border-white text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center gap-10 min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] px-4 py-10">
      <h1 className="text-3xl font-bold text-white text-center">
        QUESTIONÁRIO - {labels[nivel].toUpperCase()}
      </h1>

      <div className="w-full max-w-xl">
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" className="text-white">
            {numeroPergunta}/{TOTAL_PERGUNTAS}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progresso}
            className="h-2 flex-1 rounded-full bg-white/20"
            sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#1b1785" } }}
          />
        </Box>
      </div>

      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-xl text-white">
        <h2 className="text-sm font-semibold text-[#dddddd] mb-1">
          {PILARES[pergunta.pilar_id] || "Desconhecido"}
        </h2>
        <h1 className="text-xl font-bold mb-6">
          {numeroPergunta}. {pergunta.pergunta}
        </h1>

        <div className="w-full select-none">
          {pergunta.opcoes.map((opcao, index) => (
            <label
              key={index}
              onClick={() => setResposta(opcao.resposta)}
              className={`block p-4 border rounded-xl mb-3 cursor-pointer transition-all duration-300 select-none
                ${
                  resposta === opcao.resposta
                    ? "bg-[#bec7fa] text-[#1b1785] hover:bg-[#7a86e2] border-[#7a86e2]"
                    : "bg-white/20 text-white hover:bg-white/40 border-white/30"
                }
              `}
            >
              <input
                type="radio"
                name="resposta"
                value={opcao.resposta}
                checked={resposta === opcao.resposta}
                className="hidden"
                readOnly
              />
              {opcao.resposta}
            </label>
          ))}
        </div>

        <button
          onClick={handleResponder}
          disabled={!resposta}
          className="mt-3 w-full px-6 py-3 bg-[#5c57f5] text-white font-bold rounded-xl transition duration-300 hover:bg-[#4844c2] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          Responder
        </button>
      </div>
    </div>
  );
}
