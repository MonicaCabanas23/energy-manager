import { auth0 } from "@/lib/auth0"
import Link from "next/link"
import { FaBolt, FaChartLine, FaShieldAlt, FaMobileAlt } from "react-icons/fa"

export default async function Home() {
  const session = await auth0.getSession()

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido, {session.user.name}!</h1>
          <Link
            href="/dashboard"
            className="inline-block rounded-md bg-teal-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Gestiona tu energía de forma inteligente
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Monitorea, analiza y optimiza el consumo energético de tu hogar o negocio en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/auth/login?screen_hint=signup"
              className="rounded-md bg-teal-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-teal-700 w-full sm:w-auto"
            >
              Comenzar ahora
            </a>
            <a
              href="/auth/login"
              className="rounded-md bg-gray-100 px-8 py-3 text-sm font-medium text-teal-600 transition hover:bg-gray-200 w-full sm:w-auto"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Características principales
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FaBolt className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoreo en tiempo real</h3>
              <p className="text-gray-600">Visualiza el consumo de energía de todos tus circuitos al instante</p>
            </div>

            {/* Feature 2 */}
            {/* <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FaChartLine className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis detallado</h3>
              <p className="text-gray-600">Gráficos y reportes para entender tus patrones de consumo</p>
            </div> */}

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FaShieldAlt className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguro y confiable</h3>
              <p className="text-gray-600">Tus datos están protegidos con los más altos estándares de seguridad</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FaMobileAlt className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Acceso desde cualquier lugar</h3>
              <p className="text-gray-600">Controla tu consumo desde tu computadora, tablet o smartphone</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Comienza a ahorrar hoy mismo</h2>
          <p className="text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están optimizando su consumo energético
          </p>
          <a
            href="/auth/login?screen_hint=signup"
            className="inline-block rounded-md bg-white px-8 py-3 text-sm font-medium text-teal-600 transition hover:bg-gray-100"
          >
            Crear cuenta gratis
          </a>
        </div>
      </section>
    </div>
  )
}
