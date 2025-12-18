<template>
  <div
    class="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400"
  >
    <!-- Animated Background Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-10 left-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>

    <!-- File Selection Menu -->
    <div
      v-if="!currentQuestion"
      class="relative z-10 h-full flex flex-col items-center justify-center px-12"
    >
      <div class="text-center space-y-12">
        <div>
          <h1 class="text-8xl font-black mb-6 text-white drop-shadow-2xl">
            TRIVIA
          </h1>
          <p class="text-3xl font-semibold text-white/90">
            Select a trivia file to begin
          </p>
        </div>

        <div class="space-y-6 max-w-2xl">
          <button
            @click="selectFile"
            :disabled="loading"
            class="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 disabled:bg-white/10 text-white font-bold py-8 px-12 rounded-3xl transition duration-300 text-2xl shadow-2xl border-2 border-white/40"
          >
            {{ loading ? "Loading..." : "Browse Files" }}
          </button>

          <div v-if="availableFiles.length > 0" class="space-y-4">
            <button
              v-for="file in availableFiles"
              :key="file.path"
              @click="loadAndStart(file.path)"
              :disabled="loading"
              class="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 disabled:bg-white/10 text-white font-semibold py-6 px-10 rounded-2xl transition duration-300 text-xl shadow-xl border border-white/30"
            >
              {{ file.name }}
            </button>
          </div>

          <div
            v-if="error"
            class="mt-6 p-6 bg-red-500/30 backdrop-blur-md border-2 border-red-300 rounded-2xl"
          >
            <p class="text-white text-lg">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Trivia Display -->
    <div v-else class="relative z-10 h-full flex flex-col">
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col items-center justify-center px-16 py-20">
        <!-- Category Pills -->
        <div class="flex flex-wrap gap-4 justify-center mb-12">
          <span
            class="bg-white/30 backdrop-blur-md px-8 py-3 rounded-full text-white font-bold text-xl border-2 border-white/50 shadow-lg"
          >
            {{ currentQuestion.category.main }}
          </span>
          <span
            class="bg-white/25 backdrop-blur-md px-8 py-3 rounded-full text-white font-semibold text-lg border border-white/40 shadow-lg"
          >
            {{ currentQuestion.category.sub }}
          </span>
          <span
            class="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium text-base border border-white/30 shadow-lg"
          >
            {{ currentQuestion.category.subsub }}
          </span>
        </div>

        <!-- Question -->
        <div class="text-center mb-16 max-w-4xl">
          <h2
            class="text-6xl font-black text-white leading-tight drop-shadow-2xl mb-8"
          >
            {{ currentQuestion.question }}
          </h2>
        </div>

        <!-- Answer (Auto-revealed at 10 seconds) -->
        <transition
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-8"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showAnswer"
            class="bg-gradient-to-r from-emerald-400 to-cyan-400 px-16 py-12 rounded-3xl shadow-2xl border-4 border-white max-w-4xl"
          >
            <p class="text-5xl font-black text-white drop-shadow-lg">
              {{ currentQuestion.answer }}
            </p>
          </div>
        </transition>
      </div>

      <!-- Progress Bar -->
      <div class="relative h-8 bg-black/30 backdrop-blur-sm">
        <div
          class="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-100 ease-linear"
          :style="{ width: progressPercentage + '%' }"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-white font-bold text-lg drop-shadow-md">
            {{ Math.ceil(timeRemaining) }}s
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useTrivia } from "./composables/useTrivia";

const {
  questions,
  currentQuestion,
  currentQuestionIndex,
  isPlaying,
  triviaFileName,
  timeRemaining,
  showAnswer,
  loadTriviaData,
  nextQuestion,
  startTrivia,
  stopTrivia,
  resetTrivia,
} = useTrivia();

const availableFiles = ref([]);
const loading = ref(false);
const error = ref("");

// Progress bar percentage (0-100)
const progressPercentage = computed(() => {
  return ((60 - timeRemaining.value) / 60) * 100;
});

onMounted(async () => {
  if (window.trivia) {
    try {
      const files = await window.trivia.getTriviaFiles();
      availableFiles.value = files;
    } catch (err) {
      console.error("Failed to load trivia files:", err);
    }
  }
});

async function selectFile() {
  loading.value = true;
  error.value = "";

  try {
    const result = await window.trivia.selectTriviaFile();

    if (result.success) {
      loadTriviaData(result.data, result.fileName);
      // Auto-start after loading
      startTrivia();
    } else if (!result.canceled) {
      error.value = result.error || "Failed to load trivia file";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function loadAndStart(filePath) {
  loading.value = true;
  error.value = "";

  try {
    const result = await window.trivia.loadTriviaFile(filePath);

    if (result.success) {
      const fileName = filePath.split("/").pop().replace(".json", "");
      loadTriviaData(result.data, fileName);
      // Auto-start after loading
      startTrivia();
    } else {
      error.value = result.error || "Failed to load trivia file";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
