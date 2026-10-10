<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\TGThangBeauty\Http\Controllers\BeautyController;

Theme::routes();
Theme::registerRoutes(function (): void {
    Route::get('/', [BeautyController::class, '__invoke'])->name('public.index');
});
