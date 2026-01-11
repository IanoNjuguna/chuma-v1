
# Chuma: Financial Analyst AI - Vercel Deployment Guide

This guide will walk you through deploying your Vite-based React application to Vercel.

## Prerequisites

1.  **Node.js and npm**: Ensure you have Node.js (version 18 or newer) and npm installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Git**: Ensure you have Git installed.
3.  **Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com).
4.  **GitHub/GitLab/Bitbucket Account**: You will need an account on one of these platforms to host your code.

---

## Step 1: Set Up Your Local Project

First, you need to set up your local environment.

1.  **Create an Environment File**: In the root of your project, create a new file named `.env`.

2.  **Add Your API Key**: Open the `.env` file and add your Google Gemini API key like this:
    ```
    VITE_API_KEY=your_actual_api_key_here
    ```
    **Important**: The `VITE_` prefix is required by Vite to expose the variable to your application code.

3.  **Install Dependencies**: Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

4.  **Run the Development Server**: Start the app to make sure everything works locally.
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` (or whatever URL the terminal shows) to see the app running.

---

## Step 2: Push Your Code to a Git Repository

Vercel deploys directly from a Git repository.

1.  **Initialize a Git repository** in your project folder (if you haven't already):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a new repository** on GitHub (or your preferred Git provider). Do **not** initialize it with a README or .gitignore.

3.  **Link your local repository** to the remote one and push your code:
    ```bash
    # Replace the URL with your repository's URL
    git remote add origin https://github.com/your-username/your-repo-name.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 3: Deploy on Vercel

Now you're ready to deploy.

1.  **Log in to your Vercel account.**
2.  Go to your **Dashboard** and click **"Add New... -> Project"**.
3.  **Import your Git Repository** by selecting it from the list. You may need to grant Vercel access to your GitHub account.
4.  **Configure Your Project**: Vercel is smart and will likely auto-detect that you are using **Vite**. The default settings should be correct:
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `vite build`
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install`

5.  **Add Environment Variables (Crucial Step!)**: The application needs your Google Gemini API key to function.
    *   Expand the **"Environment Variables"** section.
    *   Add a new variable:
        *   **Name**: `VITE_API_KEY`
        *   **Value**: Paste your actual Google Gemini API key here.
    *   **Important**: Vercel encrypts this key, so it is secure.

6.  **Deploy**: Click the **"Deploy"** button.

Vercel will now start building and deploying your application. You'll see the build logs in real-time. Once it's finished (usually in a minute or two), you'll get a URL where your live application is running.

Congratulations, your Chuma Financial Analyst AI is now live on the web!
