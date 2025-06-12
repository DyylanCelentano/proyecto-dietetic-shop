const Home = () => {
  const categories = [
    {
      name: "Frutos Secos",
      description: "Selección Premium",
      detail: "Almendras, nueces, pistachos y más."
    },
    {
      name: "Legumbres Orgánicas", 
      description: "Lentejas, garbanzos, frijoles y más."
    },
    {
      name: "Cereales Integrales",
      description: "Arroz integral, avena, quínoa y más."
    },
    {
      name: "Semillas Nutritivas",
      description: "Chía, linaza, sésamo y más."
    },
    {
      name: "Suplementos Deportivos",
      description: "Proteínas, vitaminas, minerales y más."
    },
    {
      name: "Snacks Saludables",
      description: "Barras energéticas, frutos deshidratados y más."
    }
  ]

  const filterCategories = ["Todos", "Frutos Secos", "Legumbres", "Cereales", "Semillas", "Suplementos"]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-xl text-center px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Descubre Nuestra Selección de Productos Dietéticos
          </h1>
          <p className="text-lg text-white/90">
            Encuentra los mejores ingredientes para una alimentación equilibrada y saludable. 
            Variedad y calidad al alcance de tu mano
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto my-10 px-5">
        <div className="flex flex-wrap justify-around font-bold space-x-4 mb-6">
          {filterCategories.map((category, index) => (
            <div key={index} className="cursor-pointer hover:text-orange-600 transition-colors">
              {category}
            </div>
          ))}
        </div>

        <hr className="border-gray-300 mb-6" />

        <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2 mb-4">
          Nuestras Categorías Destacadas
        </h2>

        <ul className="list-none space-y-4">
          {categories.map((category, index) => (
            <li key={index}>
              <strong className="block text-lg text-gray-900 mb-1">
                {category.name}
              </strong>
              {category.detail && (
                <>
                  {category.description}<br />
                  {category.detail}
                </>
              )}
              {!category.detail && category.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home
