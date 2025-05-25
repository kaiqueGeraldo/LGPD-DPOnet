"use client";

import { useState } from "react";
import QuestionarioMain from "@/components/questionarioMain";
import SelecaoNivel from "@/components/selecaoNivel";

export default function QuestionarioPage() {
  const [nivel, setNivel] = useState<string | null>(null);

  return (
    <div className="transition-all duration-500 ease-in-out">
      {nivel ? (
        <QuestionarioMain nivel={nivel} />
      ) : (
        <SelecaoNivel onSelecionar={setNivel} />
      )}
    </div>
  );
}
