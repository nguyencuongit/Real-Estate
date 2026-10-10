<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\TGThangFashion\Http\Controllers\FashionController;

Theme::routes();
Theme::registerRoutes(function (): void {
    Route::get('/', [FashionController::class, '__invoke'])->name('public.index');
});
