# Apple-Style Habit Tracker

A clean, minimalist habit tracker inspired by Apple's UI design. Built with Vanilla JavaScript and CSS.

## Features
- **Daily Tracking**: Mark habits as complete for the day.
- **Streaks**: Track your consistency with streak counters.
- **Persistence**: Data is saved automatically to your browser's local storage.
- **Delete Habits**: Remove habits you no longer need.
- **Confetti**: Celebrate your wins!

## How to Deploy to GitHub Pages

You can host this website for free using GitHub Pages. Since I've already initialized the Git repository for you, follow these steps:

1.  **Create a New Repository on GitHub**
    - Go to [github.com/new](https://github.com/new).
    - Name it `habit-tracker` (or anything you like).
    - Make sure it is **Public** (unless you have a Pro account).
    - **Do not** initialize with README, .gitignore, or license (we already have files).
    - Click **Create repository**.

2.  **Push Your Code**
    - Copy the commands under "…or push an existing repository from the command line". They will look like this:
      ```bash
      git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
      git branch -M main
      git push -u origin main
      ```
    - Run those commands in your terminal inside this folder.

3.  **Enable GitHub Pages**
    - Go to your repository **Settings** tab.
    - Click on **Pages** in the left sidebar.
    - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
    - Under **Branch**, select `main` and `/ (root)`.
    - Click **Save**.

4.  **Done!**
    - GitHub will provide you with a URL (e.g., `https://your-username.github.io/habit-tracker/`).
    - It might take a minute or two to go live.
