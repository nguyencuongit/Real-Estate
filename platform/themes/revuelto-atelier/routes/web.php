<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\RevueltoAtelier\Http\Controllers\RevueltoController;

Theme::routes();

Theme::registerRoutes(function (): void {
    Route::get('/', [RevueltoController::class, '__invoke'])->name('public.index');
});
