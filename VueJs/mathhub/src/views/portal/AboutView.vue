<template>
  <div class="container bg-white py-2 my-4 rounded border">
    <div class="px-5 py-3">
      <h3 class="fw-bold text-dark-info my-4">About Us</h3>

      <h6 class="fw-bold mb-3"> <i class="bi bi-award-fill text-success"></i> Your One-Stop Solution for Government Exam Preparation</h6>

      <p>MathHub Combined is a non-profit initiative dedicated to empowering aspiring government exam candidates. Our mission is to provide free, high-quality study materials, mock tests, and the latest updates on upcoming exams like SSC, Railway, and WBPSC.</p>

      <h6 class="mb-3"><strong><i class="bi bi-award-fill text-success"></i> Why Choose MathHub Combined?</strong></h6>
      <ul class="list-unstyled">
        <li class="d-flex align-items-start mb-2">
          <i class="bi bi-check2-circle text-success me-2"></i>
          <span><strong>Free Access to Premium Content:</strong> Enjoy a wide range of study materials, including notes, practice questions, and previous year papers, all for free.</span>
        </li>
        <li class="d-flex align-items-start mb-2">
          <i class="bi bi-check2-circle text-success me-2"></i>
          <span><strong>Regular Exam Updates:</strong> Stay informed about the latest notifications, important dates, and exam patterns.</span>
        </li>
        <li class="d-flex align-items-start mb-2">
          <i class="bi bi-check2-circle text-success me-2"></i>
          <span><strong>Comprehensive Mock Tests:</strong> Assess your preparation level with our realistic mock tests designed to simulate actual exam conditions.</span>
        </li>
        <li class="d-flex align-items-start mb-2">
          <i class="bi bi-check2-circle text-success me-2"></i>
          <span><strong>Community Support:</strong> Connect with fellow aspirants, share doubts, and learn from each other.</span>
        </li>
        <li class="d-flex align-items-start mb-2">
          <i class="bi bi-check2-circle text-success me-2"></i>
          <span><strong>Non-Profit Initiative:</strong> We are committed to making quality education accessible to all, regardless of their financial background.</span>
        </li>
      </ul>

      <h6 class="mb-3"><strong>
        <i class="bi bi-award-fill text-success"></i> Join us in our mission to help you achieve your government exam goals.</strong></h6>

        <div class="d-flex justify-content-center mt-4">
        <a href="https://wa.me/" target="_blank" class="text-success me-3">
          <i class="bi bi-whatsapp" style="font-size: 1.5rem;"></i>
        </a>
        <a href="https://t.me/" target="_blank" class="text-primary me-3">
          <i class="bi bi-telegram" style="font-size: 1.5rem;"></i>
        </a>
        <a href="https://facebook.com/" target="_blank" class="text-primary me-3">
          <i class="bi bi-facebook" style="font-size: 1.5rem;"></i>
        </a>
        <a href="https://instagram.com/" target="_blank" class="text-danger">
          <i class="bi bi-instagram" style="font-size: 1.5rem;"></i>
        </a>
      </div>

      <div class="text-center mt-3">
        <RouterLink to="/home" class="btn btn-primary text-light font-sm rounded-pill px-3 btn-login">
          <i class="bi bi-chevron-left"></i> Back To Home
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>

import { RouterLink } from 'vue-router';


</script>
