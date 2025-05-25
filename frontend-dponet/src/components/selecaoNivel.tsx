"use client";

import { labels } from "@/utils/nivelLabels";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface SelecaoNivelProps {
  onSelecionar: (nivel: string) => void;
}

const niveis = ["iniciante", "intermediario", "avancado"];

export default function SelecaoNivel({ onSelecionar }: SelecaoNivelProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-8 min-h-screen bg-gradient-to-b from-[#4e67c3] to-[#1b1785] text-white px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        Selecione o nível do questionário
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 mt-4">
        {niveis.map((nivel) => (
          <button
            key={nivel}
            onClick={() => onSelecionar(nivel)}
            className="px-8 py-4 rounded-xl text-lg font-semibold transition duration-300
              bg-[#bec7fa] text-[#1b1785] hover:bg-[#7a86e2] hover:scale-105 shadow-lg"
          >
            {labels[nivel]}
          </button>
        ))}
      </div>

      <button
        onClick={() => router.back()}
        className="flex gap-3 justify-center items-center cursor-pointer text-white hover:text-gray-300 transition"
      >
        <ArrowLeft className="w-5 h-5"/> Voltar
      </button>
    </div>
  );
}
