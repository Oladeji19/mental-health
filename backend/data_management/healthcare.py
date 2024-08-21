import sqlite3
from aem import app
from flask import Blueprint, request, jsonify
from database_setup import create_connection
from datetime import datetime, timedelta

# Create a blueprint for the registration and login routes
healthcare = Blueprint('auth', __name__)


#THIS PART IS FOR USERS TO SET GOALS

@healthcare.route('/set_goals', methods=['POST'])
def set_goals():
    conn = create_connection()
    c = conn.cursor()
    username = request.get('username')
    sleep = request.get('sleep_goal') #MUST BE AN INT
    exercise = request.get('Exercise') #MUST BE AN INT
    meditation = request.get('Meditation') #MUST BE AN INT

#Sets the goals of the users
    try:
        if(sleep and sleep <= 4):
            c.execute(''' 
                    UPDATE user SET sleep_goal_hours = ${sleep} WHERE username = {username}
            ''')
            conn.commit()
            if(meditation):
                c.execute(''' 
                    UPDATE user SET meditation_goal = ${meditation} WHERE username = {username}
                ''')
                conn.commit()
            if(exercise):
                c.execute(''' 
                    UPDATE user SET exercise_goal_minutes = ${exercise_goal_minutes} WHERE username = {username}
                ''')  
                conn.commit()
            return jsonify("Warning! This is the not a suggested sleep goal. Goals are all set!")
        elif(sleep and sleep > 4):
            c.execute(''' 
                    UPDATE user SET sleep_goal_hours = ${sleep} WHERE username = {username} 
            ''')
            conn.commit()

            if(meditation):
                c.execute(''' 
                    UPDATE user SET meditation_goal = ${meditation} WHERE username = {username}
                ''')
                conn.commit()

            if(exercise):
                c.execute(''' 
                    UPDATE user SET exercise_goal_minutes = ${exercise_goal_minutes} WHERE username = {username}
                ''')  
                conn.commit()

            return jsonify("Goals are all set!.")
        else:
            if(meditation):
                    c.execute(''' 
                        UPDATE user SET meditation_goal = ${meditation} WHERE username = {username}
                    ''')
                    conn.commit()
            if(exercise):
                    c.execute(''' 
                        UPDATE user SET exercise_goal_minutes = ${exercise_goal_minutes} WHERE username = {username}
                    ''')
                    conn.commit()
  
            return jsonify("Goals are all set!.")
    except Exception as e:
        return jsonify("Error!", e), 500
    finally:
        conn.close()



@healthcare.route('/check_goals', methods=['POST'])

#after user inputs daily input, we notify if they met thier goals and update trackers
def check_goals():
    conn = create_connection()
    c = conn.cursor()
    username = request.get('username')
    sleep = None
    exercise = None
    meditation = None
    try:
        sleep = request.get('sleep_goal') #MUST BE AN INT
    except:
        pass
    try:
        exercise = request.get('Exercise') #MUST BE AN INT
    except:
        pass
    try:
        meditation = request.get('Meditation') #MUST BE AN INT
    except:
        pass
    str1:str = None
    str2:str = None
    str3:str = None

    #check if users accomplished goals
    try:
        c.execute(''' 
            SELECT sleep_goal_hours FROM user WHERE username = {username}
        ''') 
        cursleep = int(c.fetchone[0])
        if(sleep and cursleep and cursleep <= sleep):
            str1 = "Good sleep! Keep up the good work!"
        else:
            str1 = "We are here to support you in your sleep journey! Try again tommorow"

        c.execute(''' 
            SELECT meditation_goal FROM user WHERE username = {username}
        ''')                 
        curmeditation = int(c.fetchone[0])
        if(meditation and curmeditation and curmeditation >= meditation):
            str2 = "Good mediation! Keep up the good work!"
        else:
            str2 = "We are here to support you in your meditation journey! Try again tommorow"
        c.execute(''' 
            SELECT exercise FROM user WHERE username = {username}
        ''') 
        curexercise = int(c.fetchone[0])
        if(curexercise and exercise and curexercise >= exercise):
            str3 = "Good exercise! Keep up the good work!"
        else:
            str3 = "We are here to support you in your exercise journey! Try again tommorow"
        
        c.execute(''' 
                UPDATE user SET has_entered = 1 WHERE username = {username}
        ''')
        c.commit()

        #added to trackers for sleep, meditation, and exercise
        c.execute(''' 
                SELECT list_of_last_7_days_sleep, list_of_last_7_days_execise, list_of_last_7_days_meditation FROM user WHERE username = {username}
            ''') 
        for i in ((c.fetchone[0], sleep, "sleep"), (c.fetchone[1],exercise, "execise"), (c.fetchone[2],meditation, "meditation")):
            if(i[0] == None):
                c.execute(f''' 
                UPDATE user SET list_of_last_7_days_{i[2]} = {repr([i[1]])} WHERE username = {username}
                ''') 
                conn.commit()
            elif len(eval(i[0])) == 7:
                c.execute(f''' 
                UPDATE user SET list_of_last_7_days_{i[2]} = {repr(eval(c.fetchone[0])[1:].append(i[1]))} WHERE username = {username}
                ''') 
                conn.commit()
            else:
                c.execute(f''' 
                UPDATE user SET list_of_last_7_days_{i[2]} = {repr(eval(c.fetchone[0]).append(i[1]))} WHERE username = {username}
                ''') 
                conn.commit()


        #MAKE HEALTHCARE LOG TIME
        val = repr(([(datetime.now().year), (datetime.now().month), (datetime.now().day), (datetime.now().hour), (datetime.now().minute), (datetime.now().second), (datetime.now().microsecond)]))
                    
        c.execute(''' 
                UPDATE user SET last_healthcare_log = {val} WHERE username = {username}
        ''')
        conn.commit()
        return jsonify("Successfull", str1, str2, str3), 200 #ignore null strings passed through
    except Exception as e:
        jsonify("Error!", e), 500
    finally:
        conn.close()
       
       

@healthcare.route('/check_for_availability', methods=['POST'])
def check_for_availability():
    username = request.get('username')
    conn = create_connection()
    c = conn.cursor()
    c.execute(''' 
            SELECT last_healthcare_log, list_of_last_7_days_sleep, list_of_last_7_days_exercise, list_of_last_7_days_meditation, FROM user WHERE username = {username}
        ''') 

    #check if time has been a day and show the option to enter tracking information and also update trackers based on days missed
    if(c.fetchone[0] != None): 
        time_sent = datetime.datetime(*(eval(c.fetchone[0])))
        time_dif = (datetime.now() - time_sent)
        for i in range(time_dif.days-2):
            for i in ((c.fetchone[0], "sleep"), (c.fetchone[1],"exercise"), (c.fetchone[2],"meditation")):
                if(i[0] == None):
                    c.execute(f''' 
                    UPDATE user SET list_of_last_7_days_{i[1]} = {repr([None])} WHERE username = {username}
                    ''') 
                    conn.commit()
                elif len(eval(i[0])) == 7:
                    c.execute(f''' 
                    UPDATE user SET list_of_last_7_days_{i[1]} = {repr(eval(c.fetchone[0])[1:].append(None))} WHERE username = {username}
                    ''') 
                    conn.commit()
                else:
                    c.execute(f''' 
                    UPDATE user SET list_of_last_7_days_{i[1]} = {repr(eval(c.fetchone[0]).append(None))} WHERE username = {username}
                    ''') 
                    conn.commit()

        if((datetime.now() - time_sent) > timedelta(hours=24)):
            return "You can let users enter information", eval(c.fetchone[1]), eval(c.fetchone[2]), eval(c.fetchone[3])
        else:
            return "You cannot let users enter information", eval(c.fetchone[1]), eval(c.fetchone[2]), eval(c.fetchone[3])
    else:
        return "You can let users enter information", eval(c.fetchone[1]), eval(c.fetchone[2]), eval(c.fetchone[3])
    c.execute(''' 
        SELECT last_healthcare_log FROM users WHERE username = {username}
        ''')
    
