<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\LumiAcademy\Http\Controllers\LumiAcademyController;

Theme::routes();

// Render the static demo even when the database has an existing CMS homepage.
Theme::registerRoutes(function (): void {
    Route::get('/', [LumiAcademyController::class, '__invoke'])->name('public.index');
});
