"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Player {
  nome: string;
  nivel: number;
}

interface TimesCS {
  ct: Player[];
  tr: Player[];
}

export default function Drawer() {
  const [capitaes, setCapitaes] = useState<Player[]>([
    { nome: "", nivel: 0 },
    { nome: "", nivel: 0 },
  ]);

  const [jogadores, setJogadores] = useState<Player[]>(
    Array.from({ length: 8 }, () => ({ nome: "", nivel: 0 })),
  );

  const [resultado, setResultado] = useState<TimesCS | null>(null);
  const [sorteando, setSorteando] = useState(false);

  const balancearTimes = () => {
    const todos = [...jogadores].sort((a, b) => b.nivel - a.nivel);

    const ct: Player[] = [capitaes[0]];
    const tr: Player[] = [capitaes[1]];

    let somaCT = capitaes[0].nivel;
    let somaTR = capitaes[1].nivel;

    todos.forEach((player) => {
      if (somaCT <= somaTR) {
        ct.push(player);
        somaCT += player.nivel;
      } else {
        tr.push(player);
        somaTR += player.nivel;
      }
    });

    return { ct, tr };
  };

  const sortear = () => {
    const validos = jogadores.filter((j) => j.nome.trim() !== "");

    if (validos.length !== 8 || capitaes.some((c) => c.nome.trim() === ""))
      return;

    setSorteando(true);
    setResultado(null);

    setTimeout(() => {
      setResultado(balancearTimes());
      setSorteando(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl bg-zinc-900 mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-bold">🎯 Sorteador CS 5x5</h1>

      <Card className="bg-zinc-900">
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold text-white">Capitães</h2>
          {capitaes.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded text-white"
                placeholder={`Capitão ${i === 0 ? "CT" : "TR"}`}
                value={c.nome}
                onChange={(e) => {
                  const novo = [...capitaes];
                  novo[i].nome = e.target.value;
                  setCapitaes(novo);
                }}
              />
              <input
                type="number"
                min={1}
                max={20}
                className="border p-2 w-20 rounded text-white"
                value={c.nivel}
                onChange={(e) => {
                  const novo = [...capitaes];
                  novo[i].nivel = Number(e.target.value);
                  setCapitaes(novo);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold">Jogadores</h2>
          {jogadores.map((j, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded"
                placeholder={`Player ${i + 1}`}
                value={j.nome}
                onChange={(e) => {
                  const novo = [...jogadores];
                  novo[i].nome = e.target.value;
                  setJogadores(novo);
                }}
              />
              <input
                type="number"
                min={1}
                max={20}
                className="border p-2 w-20 rounded"
                value={j.nivel}
                onChange={(e) => {
                  const novo = [...jogadores];
                  novo[i].nivel = Number(e.target.value);
                  setJogadores(novo);
                }}
              />
            </div>
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
            💣 Sorteando os times...
          </motion.div>
        )}
      </AnimatePresence>

      {resultado && (
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              { label: "🔵 CT", time: resultado.ct },
              { label: "🟠 TR", time: resultado.tr },
            ] as const
          ).map(({ label, time }) => (
            <Card key={label} className="bg-zinc-900 text-white">
              <CardContent className="p-4">
                <h2 className="font-bold mb-2">{label}</h2>
                <ul className="list-disc ml-5">
                  {time.map((p) => (
                    <li key={p.nome}>
                      {p.nome}{" "}
                      <span className="text-sm text-zinc-400">
                        (lvl {p.nivel})
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
