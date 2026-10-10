<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\TGThang\Http\Controllers\ConstructionController;

Theme::routes();

Theme::registerRoutes(function (): void {
    Route::get('/', [ConstructionController::class, '__invoke'])->name('public.index');
});
