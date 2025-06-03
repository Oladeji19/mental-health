Project Description:
🧠 Mental Health Web Application

This open-source mental health web application is a collaborative project designed to promote emotional wellness and self-care through a suite of interactive and personalized tools. Built by a team of students, the platform is focused on accessibility, privacy, and user empowerment.

🌟 Features
• 📓 Digital Journaling: A secure space for users to log their thoughts, emotions, and experiences.

• 💬 Venting Chat Room: A mindfulness-focused anonymous chat feature for users to express themselves in a safe, nonjudgmental environment.

• 📊 Mood & Activity Tracking: Track daily mood, sleep, exercise, and habits to identify behavioral patterns over time.

• 🔐 Addiction Section: Users can input websites they want to block as a step toward reducing digital addiction and improving mental focus.

• 📚 Personalized Recommendations: A machine learning system that suggests helpful resources every week—like videos, books, events, or mental wellness sites—based on user input and engagement.

• 🧘‍♂️ Mind Games & Meditation: (Optional based on team size) Includes calming games like Sudoku and guided meditation sessions to improve cognitive focus and reduce stress.

• 📈 Predictive Analytics: Uses neural networks to analyze user metrics and predict mental health risks (e.g., likelihood of depression), enabling early intervention strategies.

• 🤝 Open Collaboration: Contributions are welcome! We follow open-source best practices, and our goal is to create an inclusive, impactful tool for mental wellness.

🚀 Tech Stack
• Frontend: HTML, CSS, JavaScript, React (or similar)

• Backend: Node.js / Express or Python / Django

• Database: MongoDB / PostgreSQL

• Machine Learning: Python (Pandas, scikit-learn, TensorFlow/PyTorch)

• Authentication & Security: JWT, OAuth, HTTPS

• Deployment: GitHub, Heroku / Vercel / AWS

How To Run Frontend:

   1. cd into the app folder.
   3. Run the npm audit fix --force command if there are a lot of vulnerabilities.
   4. Enter "npm start".

How to Run Backend:

   Recommendations
   
      1. cd int backend
      2. Create a .env and put Google Maps and PREDICTHQ api keys in there
         GOOGLE_MAPS_API_KEY="Put API key here"
         PREDICTHQ_API_KEY="Put API Key here"
      3. Run nodemon app.js to start the server
   
   Flask Web Messanging Web App
   
      1. cd into backend/Flask_Web_Messanging_App
      2. Create  virtual environment: python3 -m venv myenv(run only once)
      3. Actiavte virtual environment: source myenv/bin/activate
      4. install flask with pip install flask
      5. install flask_socketio with pip install flask_socketio
      6. Run python main.py to start the server




