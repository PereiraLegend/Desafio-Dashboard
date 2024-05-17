"use client"
import Image from "next/image";
import Tabela from "./components/tabela"
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="flex w-[100%] items-center justify-center text-2xl font-bold mt-5 mb-5">Desafio Dashboard</h1>
      <Tabela/>
    </div>
  );
}
