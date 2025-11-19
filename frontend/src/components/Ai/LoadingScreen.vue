<template>
  <div
    class="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center z-50 p-4"
  >
    <div class="w-full max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        <!-- Tip 1: Il·luminació -->
        <div class="flex flex-col items-center text-gray-700 dark:text-gray-300">
          <div
            class="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mb-4"
          >
            <i
              class="mdi mdi-lightbulb text-yellow-500 dark:text-yellow-400 text-5xl md:text-7xl"
            ></i>
          </div>
          <h3 class="text-lg md:text-xl font-semibold mb-2">
            Habitació Il·luminada
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Assegura't que la teva habitació està ben il·luminada per a un
            seguiment precís.
          </p>
        </div>

        <!-- Tip 2: Espai -->
        <div class="flex flex-col items-center text-gray-700 dark:text-gray-300">
          <div
            class="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mb-4"
          >
            <i class="mdi mdi-arrow-expand text-blue-500 dark:text-blue-400 text-5xl md:text-7xl"></i>
          </div>
          <h3 class="text-lg md:text-xl font-semibold mb-2">Espai Lliure</h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Tingues prou espai al teu voltant per moure't amb seguretat.
          </p>
        </div>

        <!-- Tip 3: Cos Sencer -->
        <div class="flex flex-col items-center text-gray-700 dark:text-gray-300">
          <div
            class="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mb-4"
          >
            <i class="mdi mdi-human text-green-500 dark:text-green-400 text-5xl md:text-7xl"></i>
          </div>
          <h3 class="text-lg md:text-xl font-semibold mb-2">
            Cos Sencer Visible
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Col·loca la càmera de manera que es vegi tot el teu cos.
          </p>
        </div>
      </div>
    </div>

    <!-- Indicador de càrrega -->
    <div class="mt-8 md:mt-12 text-center">
      <div
        class="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 dark:border-gray-700 h-24 w-24 md:h-32 md:w-32 mx-auto mb-4"
      ></div>
      <p class="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">
        Carregant Sessió...
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Spinner CSS */
.loader {
  border-top-color: #3498db; 
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
