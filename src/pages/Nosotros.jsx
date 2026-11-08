import Timeline from "../components/Timeline";
import { HISTORIA } from "../data/historia";

export default function Nosotros() {
  return (
    <main>
      <section className="bg-gradient-to-b from-pink-50 to-transparent">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-pink-600 mb-3">Acerca de nosotros</p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-8">Mío Fashion</h1>
          <p className="text-neutral-700 leading-relaxed mb-6">
            En Mío Fashion, creemos que el maquillaje es más que un producto: es una herramienta de expresión, confianza y
            amor propio. Nacimos como un sueño emprendedor en El Salvador y, gracias al cariño de nuestra comunidad en redes
            sociales, hemos crecido paso a paso para llevarte lo mejor de la cosmética internacional hasta la puerta de tu
            casa.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Nos especializamos en seleccionar cuidadosamente productos 100% originales e importados de Estados Unidos,
            ofreciéndote marcas líderes y reconocidas mundialmente como e.l.f., L'Oréal, Maybelline y NYX. Queremos que
            disfrutes de tendencias en maquillaje, fórmulas de alta calidad y los mejores tonos, todo a precios accesibles y
            sin complicaciones.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14" aria-labelledby="titulo-historia">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-pink-600 mb-2">Nuestra historia</p>
          <h2 id="titulo-historia" className="text-3xl font-semibold">Así empezó todo</h2>
        </div>
        <Timeline capitulos={HISTORIA} />
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-10">
        <div className="border-t border-neutral-200 pt-8 grid sm:grid-cols-2 gap-8 text-sm">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Contacto</h2>
            <p className="mb-1">WhatsApp: +503 7777-7777</p>
            <p className="mb-1">Instagram: @miofashion.sv</p>
            <p>San Salvador, El Salvador</p>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Envíos</h2>
            <p className="mb-1">Todo El Salvador</p>
            <p className="mb-1">Entrega de 2 a 4 días hábiles</p>
            <p>Pago contra entrega o transferencia</p>
          </div>
        </div>
      </section>
    </main>
  );
}
