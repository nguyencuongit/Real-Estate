<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\MaiHouse\Http\Controllers\ContactController;
use Theme\MaiHouse\Http\Controllers\HomeController;

Theme::routes();
Theme::registerRoutes(function (): void {
    Route::get('/', [HomeController::class, '__invoke'])->name('public.index');
    Route::post('/mai-house/contact', [ContactController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('mai-house.contact.store');
});
