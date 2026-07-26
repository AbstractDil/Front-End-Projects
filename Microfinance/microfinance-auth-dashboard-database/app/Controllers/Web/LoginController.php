<?php

namespace App\Controllers\Web;

use App\Controllers\BaseController;

/**
 * Thin, view-only controller. All real work (authentication) happens
 * client-side against the JSON API via Axios — this controller's only
 * job is to hand back the HTML shell.
 */
class LoginController extends BaseController
{
    public function index()
    {
        return view('web/login');
    }
}
