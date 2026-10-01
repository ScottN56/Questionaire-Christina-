# A Few Questions for Christina

A small, responsive, step-by-step questionnaire. It runs as plain HTML, CSS, and JavaScript, so there is no build step or package install.

## Run locally

Open `index.html` in a browser. The question text and choices are configured near the top of `script.js`.

## Answers and privacy

Answers are held in the page while it is open. The page does not send or store responses. Christina can review and copy her answers at the end. Choose a destination and appropriate privacy notice before adding email delivery, a database, or analytics.

## Publish with GitHub Pages

Create an empty GitHub repository named `interactive-questionnaire-for-christina` (do not add a README or other starter files). Replace `YOUR-USERNAME` below with your GitHub account name, then run these commands from this folder:

```sh
git remote add origin https://github.com/YOUR-USERNAME/interactive-questionnaire-for-christina.git
git add .
git commit -m "Initial questionnaire project"
git push -u origin main
```

In the repository settings, enable GitHub Pages for the `main` branch and the root folder. The site is static and requires no server-side secrets.

## Customize

Edit the `questions` array in `script.js` to change prompt text, choices, or whether a text answer is required. Keep the privacy wording accurate if the response flow changes.