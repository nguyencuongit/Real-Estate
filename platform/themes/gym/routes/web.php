<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\TGThangGym\Http\Controllers\GymController;

Theme::routes();
Theme::registerRoutes(function (): void {
    Route::get('/', [GymController::class, '__invoke'])->name('public.index');
});
