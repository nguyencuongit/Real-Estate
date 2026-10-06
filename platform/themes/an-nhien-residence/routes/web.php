<?php

use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\Route;
use Theme\AnNhienResidence\Http\Controllers\ResidenceController;

Theme::routes();

// Use the demo homepage even when the database has an existing CMS homepage.
Theme::registerRoutes(function (): void {
    Route::get('/', ResidenceController::class)->name('public.index');
});
