<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        then: function (): void {
            foreach (glob(base_path('platform/themes/*/routes/web.php')) ?: [] as $routes) {
                $theme = basename(dirname(dirname($routes)));

                // The active theme routes are already loaded by Botble's Theme RouteServiceProvider.
                if ($theme === 'shofy') {
                    continue;
                }

                if (is_file($routes)) {
                    require $routes;
                }
            }
        },
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
