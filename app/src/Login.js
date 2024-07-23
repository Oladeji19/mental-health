function Login() {
   return (
     <div className="captchabackground">
         <h3>I am not a robot</h3>
         <canvas id="captcha">captcha text</canvas>
         <input id="textBox" type="text" name="text"/>
            <div id="buttons">
               <input id="submitButton" type="submit"/>
               <button id="refreshButton" type="submit">Refresh</button>
            </div>
         <span id="output"></span>
     </div>
   );
}

export default Login;
