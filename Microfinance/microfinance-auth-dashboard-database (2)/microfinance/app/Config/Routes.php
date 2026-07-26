<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false); // API-first: every endpoint is explicit, no magic auto-routing.

// -----------------------------------------------------------------
// Frontend (server-rendered shell that boots the Bootstrap/Alpine SPA)
// -----------------------------------------------------------------
$routes->get('/', 'Web\LoginController::index');
$routes->get('/login', 'Web\LoginController::index');
$routes->get('/dashboard', 'Web\DashboardController::index');

// -----------------------------------------------------------------
// API v1
// -----------------------------------------------------------------
$routes->group('api/v1', ['namespace' => 'App\Controllers\Api\V1'], static function (RouteCollection $routes) {

    // --- Auth: public endpoints (no access token required) -----------
    $routes->group('auth', ['filter' => 'ratelimit:10'], static function (RouteCollection $routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('refresh', 'AuthController::refresh');
        $routes->post('forgot-password', 'AuthController::forgotPassword');
        $routes->post('reset-password', 'AuthController::resetPassword');
    });

    // --- Auth: authenticated endpoints --------------------------------
    $routes->group('auth', ['filter' => 'jwtAuth'], static function (RouteCollection $routes) {
        $routes->post('logout', 'AuthController::logout');
        $routes->post('change-password', 'AuthController::changePassword');
        $routes->get('me', 'AuthController::me');
    });

    // --- Dashboard (any authenticated user with dashboard.view) -------
    $routes->group('dashboard', ['filter' => 'jwtAuth'], static function (RouteCollection $routes) {
        $routes->get('summary', 'DashboardController::summary', ['filter' => 'permission:dashboard.view']);
        $routes->get('charts/collection-trend', 'DashboardController::collectionTrend', ['filter' => 'permission:dashboard.view']);
        $routes->get('charts/loan-status', 'DashboardController::loanStatusBreakdown', ['filter' => 'permission:dashboard.view']);
    });

    // Further modules (customers, loans, collections, reports, ...) are
    // added here as dedicated route groups when each module is implemented,
    // following the same jwtAuth + permission:<module>.<action> pattern.
});
