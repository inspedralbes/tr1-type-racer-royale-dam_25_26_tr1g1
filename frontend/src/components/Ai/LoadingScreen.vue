<template>
  <div
    class="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 p-4"
  >
    <div class="w-full max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <!-- Tip 1: Il·luminació -->
        <div class="flex flex-col items-center text-gray-300">
          <div class="p-4 rounded-full bg-gray-800 mb-4">
            <svg
              class="w-12 h-12 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M12 21v-1m0-8a4 4 0 00-4 4h8a4 4 0 00-4-4z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Habitació Il·luminada</h3>
          <p class="text-gray-400">
            Assegura't que la teva habitació està ben il·luminada per a un
            seguiment precís.
          </p>
        </div>

        <!-- Tip 2: Espai -->
        <div class="flex flex-col items-center text-gray-300">
          <div class="p-4 rounded-full bg-gray-800 mb-4">
            <svg
              class="w-12 h-12 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Espai Lliure</h3>
          <p class="text-gray-400">
            Tingues prou espai al teu voltant per moure't amb seguretat.
          </p>
        </div>

        <!-- Tip 3: Cos Sencer -->
        <div class="flex flex-col items-center text-gray-300">
          <div class="p-4 rounded-full bg-gray-800 mb-4">
            <svg
              class="w-12 h-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Cos Sencer Visible</h3>
          <p class="text-gray-400">
            Col·loca la càmera de manera que es vegi tot el teu cos.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="mt-12 text-center">
      <div
        class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mx-auto mb-4"
      ></div>
      <p class="text-2xl font-bold text-gray-300">Carregant Sessió...</p>
    </div>
  </div>
</template>

<script setup>
// Aquest component no necessita lògica de script per ara.
</script>

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
