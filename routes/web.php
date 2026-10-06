<?php

use Illuminate\Support\Facades\Route;
use Botble\Theme\Facades\Theme;
use Illuminate\Support\Facades\File;

Route::get('/theme-preview', function () {
    $themes = collect(File::directories(theme_path()))
        ->map(function (string $directory): ?array {
            $folder = basename($directory);
            $manifestPath = $directory . '/theme.json';

            if (! File::exists($manifestPath)) {
                return null;
            }

            $manifest = json_decode(File::get($manifestPath), true);

            if (! is_array($manifest)) {
                return null;
            }

            return [
                'id' => $folder,
                'name' => $manifest['name'] ?? ucfirst($folder),
                'url' => $folder === 'shofy'
                    ? url('/theme-preview/shofy')
                    : url('/theme-preview/demo/' . $folder),
                'note' => $folder === 'shofy'
                    ? 'Theme Shofy dùng trang chủ và dữ liệu đang cấu hình trong Botble.'
                    : '',
            ];
        })
        ->filter()
        ->values()
        ->all();

    return view('theme-preview.index', compact('themes'));
})->name('theme-preview.index');

Route::get('/theme-preview/demo/{theme}', function (string $theme) {
    abort_unless(preg_match('/^[a-zA-Z0-9_-]+$/', $theme), 404);

    $themePath = theme_path($theme);
    abort_unless(File::exists($themePath . '/theme.json'), 404);

    $demoView = collect([
        $themePath . '/views/home.blade.php',
        $themePath . '/views/index.blade.php',
    ])->first(fn (string $path) => File::exists($path));

    abort_unless($demoView, 404, 'Theme demo needs views/home.blade.php or views/index.blade.php.');

    $currentTheme = Theme::getThemeName();

    try {
        Theme::uses($theme);

        return response(view()->file($demoView)->render());
    } finally {
        Theme::uses($currentTheme);
    }
})->name('theme-preview.demo');

Route::get('/theme-preview/shofy', function () {
    $theme = app(\Botble\Theme\Theme::class);
    $themeReflection = new \ReflectionClass($theme);
    $themeProperty = $themeReflection->getProperty('theme');
    $themeProperty->setAccessible(true);
    $themeProperty->setValue($theme, null);
    $configProperty = $themeReflection->getProperty('themeConfig');
    $configProperty->setAccessible(true);
    $configProperty->setValue($theme, []);

    config(['packages.theme.general.themes.shofy' => []]);
    Theme::uses('shofy')->layout('default');

    if (function_exists('is_plugin_active') && is_plugin_active('ecommerce')) {
        app()->register(\Botble\Ecommerce\Providers\HookServiceProvider::class);
    }

    $homePageId = theme_option('homepage_id');

    if ($homePageId && class_exists(\Botble\Page\Services\PageService::class)) {
        $data = app(\Botble\Page\Services\PageService::class)->handleFrontRoutes(null);

        if ($data) {
            return Theme::scope($data['view'], $data['data'], $data['default_view'] ?? null)->render();
        }
    }

    return Theme::scope('index')->render();
})->name('theme-preview.shofy');

