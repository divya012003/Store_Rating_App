// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style.css';

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>


const Home = () => {
  const navigate = useNavigate();

  return (
    // <div className="home-container">
    //   <h1>Welcome to Store Rating App</h1>
    //   <div className="button-group">
        
    //     <button onClick={() => navigate('/register')}>Register</button>
    //     <button onClick={() => navigate('/login')}>Login</button>
    //     <br />
        
    //   </div>
    //   <p>Do you have account?login</p>
    // </div>
    <div class="card flex-row">
    <div class="form-section d-flex col-md-6">
      <h1 class="mb-4">Store App</h1>
      <p>Create an account</p>
      <button style={{background:'orange',width:'150px'}} onClick={() => navigate('/register')}>Register</button>
      <br /><br />
      <button style={{background:'blue' , width:'150px'}}  onClick={() => navigate('/login')}>Login</button>
      <div class="login-link">
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
    <div class="info-section col-md-6 d-none d-md-flex">
      <div>
        <h2>Mastermind Better.<br/>Succeed Together.</h2>
        <p class="mt-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab delectus voluptatem beatae, quos temporibus sunt ipsam deleniti nostrum deserunt praesentium enim vel, sapiente sit maxime reprehenderit quam similique. Blanditiis consectetur minus iusto sapiente voluptatem. Tempora repudiandae suscipit similique dolorum deserunt.

        </p>
      </div>
    </div>
  </div>

 

  );
};

export default Home;
