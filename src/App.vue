<template>
  <div class="h-screen w-screen bg-gray-900 flex overflow-hidden">
    <!-- Main Content Area with Aspect Ratio Box -->
    <div class="flex-1 flex items-center justify-center p-8">
      <!-- Aspect Ratio Container -->
      <div
        :key="windowKey"
        class="relative bg-black shadow-2xl overflow-hidden"
        :style="contentBoxStyle"
      >
        <!-- Trivia Content Box -->
        <div
          class="absolute inset-0"
          :class="getBackgroundClass"
          :style="getBackgroundStyle"
        >
          <!-- Animated Background Shapes -->
          <div
            class="absolute inset-0 overflow-hidden"
            v-if="getShapes.length > 0"
          >
            <div
              v-for="(shape, index) in getShapes"
              :key="index"
              class="absolute rounded-full blur-3xl animate-pulse"
              :class="[
                getShapePositionClass(shape.position),
                getShapeSizeClass(shape.size),
              ]"
              :style="{ ...getShapeStyle(shape), animationDelay: `${index}s` }"
            ></div>
          </div>

          <!-- File Selection Menu -->
          <div
            v-if="!currentQuestion"
            class="relative z-10 h-full flex flex-col items-center justify-center px-12"
          >
            <div class="text-center space-y-12">
              <div>
                <h1
                  class="mb-6 drop-shadow-2xl"
                  :class="[
                    getTypography('title').size,
                    getTypography('title').weight,
                  ]"
                  :style="{ color: getTextColor }"
                >
                  TRIVIA
                </h1>
                <p
                  class="text-3xl font-semibold"
                  :style="{ color: getTextColor, opacity: 0.9 }"
                >
                  Select a trivia file to begin
                </p>
              </div>
            </div>
          </div>

          <!-- Trivia Display -->
          <div v-else class="relative z-10 h-full flex flex-col">
            <!-- Main Content Area -->
            <div
              class="flex-1 flex flex-col items-center justify-center px-16 py-20"
            >
              <!-- Category Pills -->
              <div
                class="flex flex-wrap gap-4 justify-center"
                :class="getLayout('spacing').categories"
              >
                <span
                  class="backdrop-blur-md px-8 py-3 border-2 shadow-lg"
                  :class="[
                    getLayout('borderRadius').categories,
                    getTypography('category').main.size,
                    getTypography('category').main.weight,
                  ]"
                  :style="getCategoryStyle('main')"
                >
                  {{ currentQuestion.category.main }}
                </span>
                <span
                  class="backdrop-blur-md px-8 py-3 border shadow-lg"
                  :class="[
                    getLayout('borderRadius').categories,
                    getTypography('category').sub.size,
                    getTypography('category').sub.weight,
                  ]"
                  :style="getCategoryStyle('sub')"
                >
                  {{ currentQuestion.category.sub }}
                </span>
                <span
                  class="backdrop-blur-md px-6 py-2 border shadow-lg"
                  :class="[
                    getLayout('borderRadius').categories,
                    getTypography('category').subsub.size,
                    getTypography('category').subsub.weight,
                  ]"
                  :style="getCategoryStyle('subsub')"
                >
                  {{ currentQuestion.category.subsub }}
                </span>
              </div>

              <!-- Question -->
              <div
                class="text-center max-w-4xl"
                :class="getLayout('spacing').question"
              >
                <h2
                  class="leading-tight drop-shadow-2xl mb-8"
                  :class="[
                    getTypography('question').size,
                    getTypography('question').weight,
                  ]"
                  :style="{ color: getTextColor }"
                >
                  {{ currentQuestion.question }}
                </h2>
              </div>

              <!-- Answer -->
              <transition
                enter-active-class="transition ease-out"
                enter-from-class="opacity-0 scale-95 translate-y-8"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
                :style="{ '--enter-duration': getAnimationDuration + 'ms' }"
              >
                <div
                  v-if="showAnswer"
                  class="shadow-2xl border-4 max-w-4xl"
                  :class="[
                    getLayout('spacing').answer,
                    getLayout('borderRadius').answer,
                  ]"
                  :style="{
                    ...getAnswerStyle,
                    borderColor: currentTheme?.colors.answer.border,
                  }"
                >
                  <p
                    class="drop-shadow-lg"
                    :class="[
                      getTypography('answer').size,
                      getTypography('answer').weight,
                    ]"
                    :style="{ color: currentTheme?.colors.answer.text }"
                  >
                    {{ currentQuestion.answer }}
                  </p>
                </div>
              </transition>
            </div>

            <!-- Progress Bar -->
            <div
              class="relative h-8 backdrop-blur-sm"
              :style="{
                backgroundColor:
                  currentTheme?.colors.progressBar.background ||
                  'rgba(0,0,0,0.3)',
              }"
            >
              <div
                class="absolute inset-y-0 left-0 transition-all duration-100 ease-linear"
                :style="progressBarFillStyle"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="font-bold text-lg drop-shadow-md"
                  :style="{ color: getTextColor }"
                >
                  {{ Math.ceil(timeRemaining) }}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Control Panel Sidebar -->
    <div class="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-700">
        <h2 class="text-2xl font-bold text-white mb-2">Trivia Runner</h2>
        <p class="text-sm text-gray-400">Control Panel</p>
      </div>

      <!-- Controls -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Aspect Ratio Toggle -->
        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
            >Aspect Ratio</label
          >
          <div class="flex gap-2">
            <button
              @click="isVertical = true"
              :class="
                isVertical
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              "
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition duration-200"
            >
              9:16<br /><span class="text-xs">(Vertical)</span>
            </button>
            <button
              @click="isVertical = false"
              :class="
                !isVertical
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              "
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition duration-200"
            >
              16:9<br /><span class="text-xs">(Horizontal)</span>
            </button>
          </div>
        </div>

        <!-- Theme Selector -->
        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
            >Theme</label
          >
          <select
            @change="handleThemeChange($event)"
            :value="currentTheme?.name"
            class="w-full bg-gray-700 border border-gray-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          >
            <option
              v-for="theme in availableThemes"
              :key="theme.id"
              :value="theme.name"
              :data-path="theme.path"
            >
              {{ theme.name }}
            </option>
          </select>
          <p v-if="currentTheme" class="text-xs text-gray-400 italic">
            {{ currentTheme.description }}
          </p>
        </div>

        <!-- Question Duration -->
        <div class="space-y-2">
          <label
            class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
            >Question Duration</label
          >
          <div class="flex gap-2 items-center">
            <input
              type="number"
              :value="questionDuration"
              @input="handleDurationChange($event)"
              :disabled="isPlaying"
              min="5"
              max="300"
              class="flex-1 bg-gray-700 border border-gray-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span class="text-gray-400 font-semibold">sec</span>
          </div>
          <p class="text-xs text-gray-400">
            Between 5 and 300 seconds (default: 60s)
          </p>
        </div>

        <!-- File Selection -->
        <div class="space-y-2" v-if="!currentQuestion">
          <label
            class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
            >Select Trivia File</label
          >
          <button
            @click="selectFile"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {{ loading ? "Loading..." : "Browse Files" }}
          </button>

          <div v-if="availableFiles.length > 0" class="space-y-2 pt-2">
            <p class="text-xs text-gray-400 uppercase tracking-wide">
              Available Files
            </p>
            <button
              v-for="file in availableFiles"
              :key="file.path"
              @click="loadFile(file.path)"
              :disabled="loading"
              class="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white text-sm font-medium py-2 px-3 rounded transition duration-200 text-left"
            >
              {{ file.name }}
            </button>
          </div>

          <div
            v-if="error"
            class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg"
          >
            <p class="text-red-200 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Playback Controls -->
        <div v-if="currentQuestion" class="space-y-4">
          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
              >Playback</label
            >
            <div class="space-y-2">
              <button
                v-if="!isPlaying"
                @click="startTrivia"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
                  />
                </svg>
                Start
              </button>
              <button
                v-else
                @click="stopTrivia"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clip-rule="evenodd"
                  />
                </svg>
                Stop
              </button>
              <button
                @click="nextQuestion"
                :disabled="isPlaying"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l7-4.5a1 1 0 000-1.664l-7-4.5z"
                  />
                  <path
                    d="M13 5.5v9a1 1 0 001 1h2a1 1 0 001-1v-9a1 1 0 00-1-1h-2a1 1 0 00-1 1z"
                  />
                </svg>
                Next Question
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-gray-300 uppercase tracking-wide"
              >Current File</label
            >
            <div class="bg-gray-700 rounded-lg p-3">
              <p class="text-white font-semibold">{{ triviaFileName }}</p>
              <p class="text-sm text-gray-400 mt-1">
                Question {{ currentQuestionIndex + 1 }} of
                {{ questions.length }}
              </p>
            </div>
          </div>

          <button
            @click="resetAndGoBack"
            class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Back to Menu
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="p-6 border-t border-gray-700 text-center">
        <p class="text-xs text-gray-500">
          <span class="block mb-1">Capture the content box only</span>
          <span class="block">for clean video recording</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useTrivia } from "./composables/useTrivia";
import { useTheme } from "./composables/useTheme";

const {
  questions,
  currentQuestion,
  currentQuestionIndex,
  isPlaying,
  triviaFileName,
  timeRemaining,
  showAnswer,
  questionDuration,
  loadTriviaData,
  nextQuestion,
  startTrivia,
  stopTrivia,
  resetTrivia,
  setQuestionDuration,
} = useTrivia();

const {
  availableThemes,
  currentTheme,
  getBackgroundClass,
  getBackgroundStyle,
  getShapes,
  getShapePositionClass,
  getShapeSizeClass,
  getShapeStyle,
  getAnswerStyle,
  getProgressBarStyle,
  getCategoryStyle,
  getTextColor,
  getTypography,
  getLayout,
  getAnimationDuration,
  selectTheme,
} = useTheme();

const availableFiles = ref([]);
const loading = ref(false);
const error = ref("");
const isVertical = ref(true); // true = 9:16, false = 16:9

// Aspect ratio class for the content box
const aspectRatioClass = computed(() => {
  return isVertical.value ? "aspect-[9/16]" : "aspect-[16/9]";
});

// Dynamic styling for the content box size with fixed dimensions
const contentBoxStyle = computed(() => {
  if (isVertical.value) {
    // 9:16 - Fixed dimensions for vertical video (1080x1920 scaled to fit)
    const maxHeight = window.innerHeight - 64; // Account for padding
    const targetHeight = Math.min(maxHeight, 1920);
    const width = (targetHeight * 9) / 16;

    return {
      width: `${width}px`,
      height: `${targetHeight}px`,
      fontSize: `${targetHeight / 1920}em`, // Scale text proportionally
    };
  } else {
    // 16:9 - Fixed dimensions for horizontal video (1920x1080 scaled to fit)
    const maxWidth = window.innerWidth - 320 - 64; // Account for sidebar + padding
    const targetWidth = Math.min(maxWidth, 1920);
    const height = (targetWidth * 9) / 16;

    return {
      width: `${targetWidth}px`,
      height: `${height}px`,
      fontSize: `${targetWidth / 1920}em`, // Scale text proportionally
    };
  }
});

// Progress bar percentage (0-100)
const progressPercentage = computed(() => {
  if (!isPlaying.value) return 0;
  const elapsed = questionDuration.value - timeRemaining.value;
  const percentage = (elapsed / questionDuration.value) * 100;
  return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
});

// Combined progress bar fill style (width + theme styling)
const progressBarFillStyle = computed(() => {
  const style = {
    width: progressPercentage.value + "%",
    ...getProgressBarStyle.value,
  };
  console.log("Progress Bar Style:", style);
  return style;
});

// Force re-computation on window resize
const windowKey = ref(0);
const handleResize = () => {
  windowKey.value++;
};

onMounted(async () => {
  if (window.trivia) {
    try {
      const files = await window.trivia.getTriviaFiles();
      availableFiles.value = files;
    } catch (err) {
      console.error("Failed to load trivia files:", err);
    }
  }

  // Add resize listener for responsive scaling
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

async function selectFile() {
  loading.value = true;
  error.value = "";

  try {
    const result = await window.trivia.selectTriviaFile();

    if (result.success) {
      loadTriviaData(result.data, result.fileName);
    } else if (!result.canceled) {
      error.value = result.error || "Failed to load trivia file";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function loadFile(filePath) {
  loading.value = true;
  error.value = "";

  try {
    const result = await window.trivia.loadTriviaFile(filePath);

    if (result.success) {
      const fileName = filePath.split("/").pop().replace(".json", "");
      loadTriviaData(result.data, fileName);
    } else {
      error.value = result.error || "Failed to load trivia file";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function resetAndGoBack() {
  resetTrivia();
  loadTriviaData({ questions: [] }, "");
}

function handleThemeChange(event) {
  const selectedOption = event.target.selectedOptions[0];
  const themePath = selectedOption.dataset.path;
  if (themePath) {
    selectTheme(themePath);
  }
}

function handleDurationChange(event) {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value)) {
    setQuestionDuration(value);
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

/* Support for dynamic transition duration */
.transition {
  transition-duration: var(--enter-duration, 700ms);
}

/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
