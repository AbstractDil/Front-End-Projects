<?php

// app/Config/Routes.php
// Starter route map only. Implement controllers/services separately.

$routes->group('api/v1', ['filter' => 'jwt'], static function ($routes) {

    // Candidate
    $routes->get('auth/me', 'Api\AuthController::me');
    $routes->get('me/profile', 'Api\ProfileController::show');
    $routes->put('me/profile', 'Api\ProfileController::update');
    $routes->get('me/exams', 'Api\ExamController::myExams');
    $routes->get('me/attempts', 'Api\AttemptController::mine');
    $routes->get('me/results', 'Api\ResultController::mine');

    // Catalogue
    $routes->get('categories', 'Api\CategoryController::index');
    $routes->get('categories/(:segment)/exams', 'Api\ExamController::byCategory/$1');
    $routes->get('exams', 'Api\ExamController::index');
    $routes->get('exams/(:segment)', 'Api\ExamController::show/$1');
    $routes->get('exams/(:segment)/access', 'Api\ExamController::access/$1');
    $routes->get('exams/(:segment)/sections', 'Api\ExamController::sections/$1');

    // Attempts
    $routes->post('exams/(:segment)/attempts', 'Api\AttemptController::create/$1');
    $routes->get('attempts/(:segment)/bootstrap', 'Api\AttemptController::bootstrap/$1');
    $routes->post('attempts/(:segment)/start', 'Api\AttemptController::start/$1');
    $routes->post('attempts/(:segment)/heartbeat', 'Api\AttemptController::heartbeat/$1');
    $routes->post('attempts/(:segment)/sync', 'Api\AttemptController::sync/$1');
    $routes->post('attempts/(:segment)/pause', 'Api\AttemptController::pause/$1');
    $routes->post('attempts/(:segment)/resume', 'Api\AttemptController::resume/$1');
    $routes->post('attempts/(:segment)/submit', 'Api\AttemptController::submit/$1');
    $routes->post('attempts/(:segment)/sections/(:num)/activate', 'Api\AttemptController::activateSection/$1/$2');

    // Proctoring
    $routes->post('attempts/(:segment)/proctoring/verification-photo', 'Api\ProctoringController::verificationPhoto/$1');
    $routes->post('attempts/(:segment)/proctoring/events', 'Api\ProctoringController::event/$1');
    $routes->post('attempts/(:segment)/proctoring/heartbeat', 'Api\ProctoringController::heartbeat/$1');
    $routes->get('attempts/(:segment)/proctoring/status', 'Api\ProctoringController::status/$1');

    // Results
    $routes->get('attempts/(:segment)/result', 'Api\ResultController::showByAttempt/$1');
    $routes->get('attempts/(:segment)/result/sections', 'Api\ResultController::sectionsByAttempt/$1');
});

// Public auth endpoints
$routes->group('api/v1/auth', static function ($routes) {
    $routes->post('login', 'Api\AuthController::login');
    $routes->post('refresh', 'Api\AuthController::refresh');
    $routes->post('logout', 'Api\AuthController::logout');
});

// Admin
$routes->group('api/v1/admin', ['filter' => 'jwt:admin'], static function ($routes) {
    $routes->resource('exams', ['controller' => 'Api\Admin\ExamController']);
    $routes->resource('questions', ['controller' => 'Api\Admin\QuestionController']);
    $routes->resource('question-sets', ['controller' => 'Api\Admin\QuestionSetController']);
    $routes->resource('sections', ['controller' => 'Api\Admin\SectionController']);
    $routes->resource('categories', ['controller' => 'Api\Admin\CategoryController']);
    $routes->resource('products', ['controller' => 'Api\Admin\ProductController']);

    $routes->post('exams/from-template/(:num)', 'Api\Admin\ExamController::fromTemplate/$1');
    $routes->post('exams/(:num)/publish', 'Api\Admin\ExamController::publish/$1');
    $routes->post('exams/(:num)/pause', 'Api\Admin\ExamController::pause/$1');
    $routes->post('attempts/(:segment)/unlock', 'Api\Admin\AttemptController::unlock/$1');
    $routes->post('attempts/(:segment)/terminate', 'Api\Admin\AttemptController::terminate/$1');
    $routes->get('live/exams/(:num)/attempts', 'Api\Admin\LiveController::attempts/$1');
    $routes->get('live/attempts/(:segment)', 'Api\Admin\LiveController::attempt/$1');

    $routes->post('import/questions', 'Api\Admin\ImportController::questions');
    $routes->get('imports/(:segment)', 'Api\Admin\ImportController::show/$1');
    $routes->get('imports/(:segment)/errors', 'Api\Admin\ImportController::errors/$1');
});
