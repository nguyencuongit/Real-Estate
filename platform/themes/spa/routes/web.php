<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\TGThangSpa\Http\Controllers\SpaController;

Theme::routes();
Theme::registerRoutes(function (): void {
    Route::get('/', [SpaController::class, '__invoke'])->name('public.index');
});
