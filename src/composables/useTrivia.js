import { ref, computed, onUnmounted } from "vue";

export function useTrivia() {
  const questions = ref([]);
  const currentQuestionIndex = ref(0);
  const isPlaying = ref(false);
  const triviaFileName = ref("");
  const shuffledIndices = ref([]);
  const timeRemaining = ref(60);
  const showAnswer = ref(false);
  let intervalId = null;
  let timerIntervalId = null;

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const currentQuestion = computed(() => {
    if (questions.value.length === 0 || shuffledIndices.value.length === 0) {
      return null;
    }
    const index = shuffledIndices.value[currentQuestionIndex.value];
    return questions.value[index];
  });

  const loadTriviaData = (data, fileName = "") => {
    questions.value = data.questions || [];
    triviaFileName.value = fileName;

    // Create shuffled indices
    const indices = questions.value.map((_, i) => i);
    shuffledIndices.value = shuffleArray(indices);
    currentQuestionIndex.value = 0;
    timeRemaining.value = 60;
    showAnswer.value = false;
  };

  const nextQuestion = () => {
    if (questions.value.length === 0) return;

    currentQuestionIndex.value =
      (currentQuestionIndex.value + 1) % shuffledIndices.value.length;

    // If we've gone through all questions, reshuffle
    if (currentQuestionIndex.value === 0) {
      const indices = questions.value.map((_, i) => i);
      shuffledIndices.value = shuffleArray(indices);
    }

    // Reset timer and answer visibility
    timeRemaining.value = 60;
    showAnswer.value = false;
  };

  const startTrivia = () => {
    if (questions.value.length === 0) return;

    isPlaying.value = true;
    timeRemaining.value = 60;
    showAnswer.value = false;

    // Update timer every 100ms for smooth progress bar
    timerIntervalId = setInterval(() => {
      timeRemaining.value -= 0.1;

      // Show answer at 10 seconds remaining
      if (timeRemaining.value <= 10 && !showAnswer.value) {
        showAnswer.value = true;
      }

      // Move to next question when time runs out
      if (timeRemaining.value <= 0) {
        nextQuestion();
      }
    }, 100);
  };

  const stopTrivia = () => {
    isPlaying.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
  };

  const resetTrivia = () => {
    stopTrivia();
    currentQuestionIndex.value = 0;
    const indices = questions.value.map((_, i) => i);
    shuffledIndices.value = shuffleArray(indices);
  };

  // Cleanup on unmount
  onUnmounted(() => {
    stopTrivia();
  });

  return {
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
  };
}
