"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import "./page.scss";

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-page-container">
      <h1>Bienvenue sur Abricot !</h1>
      <Link href="/dashboard">
        <button className="btn">Accéder au Dashboard</button>
      </Link>
    </div>
  );
}
