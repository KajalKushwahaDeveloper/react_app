import React from "react";
import './login_page.css';

const LoginPage = () => {
  return (
    <>
      <div class="login_div">
        <div className="center_div">
          <div className="content">
            <form action="" method="post">
              <input type="text"  id="content_input" name="email" placeholder="Enter your email" />
              <input type="text"  id="content_input" name="pass" placeholder="Enter your password" />
              <button className="btn">login</button>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}

export default LoginPage;