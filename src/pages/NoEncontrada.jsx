import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <main className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-5xl font-semibold mb-4">404</p>
      <h1 className="text-xl font-semibold mb-2">Esta página no existe</h1>
      <p className="text-neutral-600 mb-8">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Link to="/" className="bg-neutral-900 text-white px-6 py-3 rounded-full text-sm hover:bg-neutral-700">
        Volver al inicio
      </Link>
    </main>
  );
}
