"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Estrutura específica para CS (5v5)
interface TimesCS {
  ct: string[];
  tr: string[];
}

export default function Drawer() {
  // Cabeças de chave (ex: IGL ou AWP principal)
  const [capitaes, setCapitaes] = useState<string[]>(["", ""]);

  // Outros 8 jogadores
  const [jogadores, setJogadores] = useState<string[]>(Array(8).fill(""));

  const [resultado, setResultado] = useState<TimesCS | null>(null);
  const [sorteando, setSorteando] = useState(false);

  const sortear = () => {
    const validos = jogadores.filter((j) => j.trim() !== "");

    if (validos.length !== 8 || capitaes.some((c) => c.trim() === "")) return;

    setSorteando(true);
    setResultado(null);

    setTimeout(() => {
      const embaralhados = [...validos].sort(() => Math.random() - 0.5);

      setResultado({
        ct: [capitaes[0], ...embaralhados.slice(0, 4)],
        tr: [capitaes[1], ...embaralhados.slice(4, 8)],
      });

      setSorteando(false);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-4xl bg-zinc-900 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🎯 Sorteador CS 5x5</h1>

      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-4 space-y-4 text-white">
          <h2 className="font-semibold">Capitães</h2>
          {capitaes.map((c, i) => (
            <input
              key={i}
              className="border p-2 w-full rounded"
              placeholder={`Cabeça de chave do ${i === 0 ? "CT" : "TR"}`}
              value={c}
              onChange={(e) => {
                const novo = [...capitaes];
                novo[i] = e.target.value;
                setCapitaes(novo);
              }}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold">Jogadores</h2>
          {jogadores.map((j, i) => (
            <input
              key={i}
              className="border p-2 w-full rounded"
              placeholder={`Player ${i + 1}`}
              value={j}
              onChange={(e) => {
                const novo = [...jogadores];
                novo[i] = e.target.value;
                setJogadores(novo);
              }}
            />
          ))}
        </CardContent>
      </Card>

      <Button onClick={sortear} disabled={sorteando}>
        Sortear Times
      </Button>

      <AnimatePresence>
        {sorteando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-xl font-semibold"
          >
            💣 Sorteando round inicial...
          </motion.div>
        )}
      </AnimatePresence>

      {resultado && (
        <div className="grid  grid-cols-2 gap-4">
          <Card className="bg-zinc-900 text-white">
            <CardContent className="p-4">
              <h2 className="font-bold mb-2">🔵 Counter-Terrorists (CT)</h2>
              <ul className="list-disc ml-5">
                {resultado.ct.map((j) => (
                  <li key={j}>{j}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardContent className="p-4 ">
              <h2 className="font-bold mb-2">🟠 Terrorists (TR)</h2>
              <ul className="list-disc ml-5">
                {resultado.tr.map((j) => (
                  <li key={j}>{j}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export { Drawer };
