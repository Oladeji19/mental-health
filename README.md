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




