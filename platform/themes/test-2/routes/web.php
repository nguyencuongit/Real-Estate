<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;

Route::get('/test-2', function () {
    return response()->file(__DIR__ . '/../views/home.blade.php', [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]);
})->name('theme-test-2.home');
