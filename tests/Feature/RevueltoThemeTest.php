<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class RevueltoThemeTest extends TestCase
{
    public function test_car_theme_is_available_in_both_selectors(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('revuelto-atelier', $themes);
        $this->assertSame('Giới thiệu xe ô tô', $themes['revuelto-atelier']['name']);

        $this->get('/theme-preview/')->assertOk()
            ->assertViewHas('themes', fn (array $themes): bool => collect($themes)->contains(
                fn (array $theme): bool => $theme['id'] === 'revuelto-atelier'
                    && $theme['name'] === 'Giới thiệu xe ô tô'
            ));

        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Giới thiệu xe ô tô');
    }

    public function test_car_preview_has_local_assets_and_the_360_viewer(): void
    {
        $activeTheme = Theme::getThemeName();

        $this->get('/theme-preview/demo/revuelto-atelier')->assertOk()
            ->assertSee('VANTA Atelier')
            ->assertSee('/themes/revuelto-atelier/assets/vehicle-3d.min.js', false)
            ->assertSee('/themes/revuelto-atelier/orbit-viewer.js', false)
            ->assertSee('Xem xe 360°')
            ->assertSee('id="vehicle-orbit"', false);

        $this->assertSame($activeTheme, Theme::getThemeName());
        $this->assertFileExists(theme_path('revuelto-atelier/public/assets/models/revuelto.glb'));
    }
}
