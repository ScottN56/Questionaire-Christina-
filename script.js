const questions = [
  {
    prompt: "What kind of day sounds best right now?",
    hint: "Go with your first instinct.",
    type: "choice",
    required: true,
    options: ["A slow morning and a long breakfast", "A little fresh air and a new place", "An easy evening with a good film"]
  },
  {
    prompt: "Pick the treat you would reach for first.",
    hint: "There is no wrong pick here.",
    type: "choice",
    required: true,
    options: ["Something sweet", "Something salty", "A bit of both"]
  },
  {
    prompt: "Is there something you have been wanting to do together?",
    hint: "A place, a plan, or even a small everyday thing.",
    type: "text",
    required: true,
    placeholder: "Write whatever comes to mind..."
  },
  {
    prompt: "Anything else you would like to add?",
    hint: "This one is entirely optional.",
    type: "text",
    required: false,
    placeholder: "A note, a thought, or nothing at all..."
  }
];

const form = document.querySelector("#question-form");
const content = document.querySelector("#question-content");
const stepLabel = document.querySelector("#step-label");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const backButton = document.querySelector("#back-button");
const nextLabel = document.querySelector("#next-label");
const formError = document.querySelector("#form-error");
const answers = Array(questions.length).fill("");
let currentStep = 0;

function renderQuestion() {
  const question = questions[currentStep];
  const stepNumber = String(currentStep + 1).padStart(2, "0");
  const progress = Math.round(((currentStep + 1) / questions.length) * 100);

  stepLabel.textContent = `QUESTION ${stepNumber} / ${String(questions.length).padStart(2, "0")}`;
  progressPercent.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  backButton.hidden = currentStep === 0;
  nextLabel.textContent = currentStep === questions.length - 1 ? "Review answers" : "Continue";
  formError.hidden = true;
  content.replaceChildren();

  const kicker = document.createElement("p");
  kicker.className = "question-kicker";
  kicker.textContent = `A little about you · ${stepNumber}`;
  const title = document.createElement("h2");
  title.className = "question-title";
  title.id = "question-title";
  title.textContent = question.prompt;
  form.setAttribute("aria-labelledby", title.id);
  content.append(kicker, title);

  if (question.hint) {
    const hint = document.createElement("p");
    hint.className = "question-hint";
    hint.textContent = question.hint;
    content.append(hint);
  }

  if (question.type === "choice") {
    const choices = document.createElement("div");
    choices.className = "choice-list";
    question.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${currentStep}`;
      input.value = option;
      input.checked = answers[currentStep] === option;
      input.addEventListener("change", () => {
        answers[currentStep] = option;
        formError.hidden = true;
      });
      const copy = document.createElement("span");
      copy.className = "choice-copy";
      copy.textContent = option;
      label.append(input, copy);
      choices.append(label);
      if (index === 0) input.autocomplete = "off";
    });
    content.append(choices);
  } else {
    const textarea = document.createElement("textarea");
    textarea.className = "answer-input";
    textarea.name = `question-${currentStep}`;
    textarea.rows = 3;
    textarea.maxLength = 500;
    textarea.required = question.required;
    textarea.placeholder = question.placeholder;
    textarea.value = answers[currentStep];
    textarea.setAttribute("aria-label", question.prompt);
    textarea.addEventListener("input", () => {
      answers[currentStep] = textarea.value.trim();
      formError.hidden = true;
    });
    content.append(textarea);
    requestAnimationFrame(() => textarea.focus({ preventScroll: true }));
  }
}

function renderSummary() {
  stepLabel.textContent = "YOUR ANSWERS";
  progressPercent.textContent = "DONE";
  progressFill.style.width = "100%";
  backButton.hidden = true;
  nextLabel.textContent = "Start again";
  formError.hidden = true;
  content.replaceChildren();

  const kicker = document.createElement("p");
  kicker.className = "question-kicker";
  kicker.textContent = "THANK YOU";
  const title = document.createElement("h2");
  title.className = "question-title";
  title.textContent = "That was lovely.";
  const list = document.createElement("div");
  list.className = "summary-list";

  questions.forEach((question, index) => {
    if (!answers[index]) return;
    const item = document.createElement("div");
    item.className = "summary-item";
    const prompt = document.createElement("p");
    prompt.className = "summary-question";
    prompt.textContent = question.prompt;
    const answer = document.createElement("p");
    answer.className = "summary-answer";
    answer.textContent = answers[index];
    item.append(prompt, answer);
    list.append(item);
  });

  const copyButton = document.createElement("button");
  copyButton.className = "copy-button";
  copyButton.type = "button";
  copyButton.textContent = "Copy my answers";
  copyButton.addEventListener("click", async () => {
    const text = questions.map((question, index) => answers[index] ? `${question.prompt}\n${answers[index]}` : "").filter(Boolean).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy unavailable";
    }
  });
  content.append(kicker, title, list, copyButton);
  document.querySelector(".privacy-note").innerHTML = "<span aria-hidden=\"true\">◌</span> Nothing is sent or saved by this page.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentStep === questions.length) {
    answers.fill("");
    currentStep = 0;
    document.querySelector(".privacy-note").innerHTML = "<span aria-hidden=\"true\">◌</span> Your answers stay on this device.";
    renderQuestion();
    return;
  }

  const question = questions[currentStep];
  if (question.required && !answers[currentStep].trim()) {
    formError.hidden = false;
    if (question.type === "choice") content.querySelector("input")?.focus();
    else content.querySelector("textarea")?.focus();
    return;
  }

  if (currentStep === questions.length - 1) {
    currentStep = questions.length;
    renderSummary();
    return;
  }
  currentStep += 1;
  renderQuestion();
});

backButton.addEventListener("click", () => {
  if (currentStep === 0 || currentStep === questions.length) return;
  currentStep -= 1;
  renderQuestion();
});

renderQuestion();