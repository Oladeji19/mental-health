import sqlite3
from flask import Blueprint, request, jsonify, session
from database_setup import create_connection
from datetime import datetime, timedelta

healthcare = Blueprint('healthcare', __name__)

@healthcare.route('/set_goals', methods=['POST'])
def set_goals():
    conn = create_connection()
    c = conn.cursor()
    username = session['username']
    sleep = request.json.get('sleep_goal')
    exercise = request.json.get('exercise')
    meditation = request.json.get('meditation')

    # Check if the sleep goal is less than 4 hours
    try:
        if sleep is not None:
            sleep = int(sleep)
            c.execute('UPDATE user SET sleep_goal_hours = ? WHERE username = ?', (sleep, username))
            if sleep <= 4:
                warning = "Warning! This is not a suggested sleep goal."
            else:
                warning = None
        else:
            warning = None

        # Update the exercise and meditation goals
        if meditation is not None:
            meditation = int(meditation)
            c.execute('UPDATE user SET meditation_goal = ? WHERE username = ?', (meditation, username))

        # Update the exercise goal
        if exercise is not None:
            exercise = int(exercise)
            c.execute('UPDATE user SET exercise_goal_minutes = ? WHERE username = ?', (exercise, username))

        conn.commit()
        return jsonify({"message": "Goals are set.", "warning": warning}), 200
    except ValueError:
        return jsonify({"error": "Invalid input. Please ensure all goals are numbers."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Check if the user has entered their daily health information
@healthcare.route('/check_goals', methods=['POST'])
def check_goals():
    conn = create_connection()
    c = conn.cursor()
    username = session['username']
    sleep = request.json.get('sleep')
    exercise = request.json.get('exercise')
    meditation = request.json.get('meditation')

    try:
        c.execute('SELECT sleep_goal_hours, meditation_goal, exercise_goal_minutes FROM user WHERE username = ?', (username,))
        sleep_goal, meditation_goal, exercise_goal = c.fetchone()

        messages = []
        if sleep_goal is not None and sleep is not None:
            sleep = int(sleep)
            if sleep >= sleep_goal:
                messages.append("Good sleep! Keep up the good work!")
            else:
                messages.append("We are here to support you in your sleep journey! Try again tomorrow.")
        else:
            messages.append("")

        if meditation_goal is not None and meditation is not None:
            meditation = int(meditation)
            if meditation >= meditation_goal:
                messages.append("Good meditation! Keep up the good work!")
            else:
                messages.append("We are here to support you in your meditation journey! Try again tomorrow.")
        else:
            messages.append("")

        if exercise_goal is not None and exercise is not None:
            exercise = int(exercise)
            if exercise >= exercise_goal:
                messages.append("Good exercise! Keep up the good work!")
            else:
                messages.append("We are here to support you in your exercise journey! Try again tomorrow.")
        else:
            messages.append("")

        c.execute('UPDATE user SET has_entered = 1 WHERE username = ?', (username,))

        for activity, value in [('sleep', sleep), ('exercise', exercise), ('meditation', meditation)]:
            if value is not None:
                c.execute(f'SELECT list_of_last_7_days_{activity} FROM user WHERE username = ?', (username,))
                last_7_days = c.fetchone()[0]
                if last_7_days:
                    last_7_days = eval(last_7_days)
                    if len(last_7_days) == 7:
                        last_7_days = last_7_days[1:] + [value]
                    else:
                        last_7_days.append(value)
                else:
                    last_7_days = [value]
                c.execute(f'UPDATE user SET list_of_last_7_days_{activity} = ? WHERE username = ?', (repr(last_7_days), username))

        now = datetime.now()
        c.execute('UPDATE user SET last_healthcare_log = ? WHERE username = ?', (now.isoformat(), username))
        conn.commit()
        return jsonify({"message": "Success", "feedback": messages}), 200
    except ValueError:
        return jsonify({"error": "Invalid input. Please ensure all values are numbers."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@healthcare.route('/check_for_availability', methods=['POST'])
def check_for_availability():
    username = session['username']
    conn = create_connection()
    c = conn.cursor()

    try:
        c.execute('SELECT last_healthcare_log, list_of_last_7_days_sleep, list_of_last_7_days_exercise, list_of_last_7_days_meditation FROM user WHERE username = ?', (username,))
        result = c.fetchone()

        if not result:
            return jsonify({"error": "User not found."}), 404

        last_log, sleep_data, exercise_data, meditation_data = result

        if last_log:
            last_log_time = datetime.fromisoformat(last_log)
            time_diff = datetime.now() - last_log_time
            can_enter = time_diff > timedelta(hours=24)
        else:
            can_enter = True

        return jsonify({
            "can_enter_information": can_enter,
            "sleep_data": eval(sleep_data) if sleep_data else [],
            "exercise_data": eval(exercise_data) if exercise_data else [],
            "meditation_data": eval(meditation_data) if meditation_data else []
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
