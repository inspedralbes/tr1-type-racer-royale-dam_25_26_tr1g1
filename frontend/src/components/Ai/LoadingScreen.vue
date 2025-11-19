<template>
  <div
    class="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center z-50 p-4"
  >
    <div class="w-full max-w-4xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div
          class="flex flex-row md:flex-col items-center md:items-center p-4 rounded-lg md:bg-transparent md:p-0"
        >
          <div
            class="w-16 h-16 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mr-4 md:mr-0 md:mb-4"
          >
            <i
              class="mdi mdi-lightbulb text-yellow-500 dark:text-yellow-400 text-3xl md:text-7xl"
            ></i>
          </div>
          <div class="text-left md:text-center">
            <h3
              class="text-base md:text-xl font-semibold mb-1 md:mb-2 text-gray-800 dark:text-gray-200"
            >
              Habitació Il·luminada
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-tight">
              Assegura't que la teva habitació està ben il·luminada.
            </p>
          </div>
        </div>

        <div
          class="flex flex-row md:flex-col items-center md:items-center p-4 rounded-lg md:bg-transparent md:p-0"
        >
          <div
            class="w-16 h-16 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mr-4 md:mr-0 md:mb-4"
          >
            <i
              class="mdi mdi-arrow-expand text-blue-500 dark:text-blue-400 text-3xl md:text-7xl"
            ></i>
          </div>
          <div class="text-left md:text-center">
            <h3
              class="text-base md:text-xl font-semibold mb-1 md:mb-2 text-gray-800 dark:text-gray-200"
            >
              Espai Lliure
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-tight">
              Tingues prou espai al teu voltant per moure't.
            </p>
          </div>
        </div>

        <div
          class="flex flex-row md:flex-col items-center md:items-center p-4 rounded-lg md:bg-transparent md:p-0"
        >
          <div
            class="w-16 h-16 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mr-4 md:mr-0 md:mb-4"
          >
            <i
              class="mdi mdi-human text-green-500 dark:text-green-400 text-3xl md:text-7xl"
            ></i>
          </div>
          <div class="text-left md:text-center">
            <h3
              class="text-base md:text-xl font-semibold mb-1 md:mb-2 text-gray-800 dark:text-gray-200"
            >
              Cos Sencer Visible
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-tight">
              Col·loca la càmera de manera que es vegi tot el teu cos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
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
/* Classic Spinner CSS */
.loader {
  border-top-color: #3498db; /* Blue color for the spinner */
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
