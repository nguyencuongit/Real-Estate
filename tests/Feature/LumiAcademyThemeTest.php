<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class LumiAcademyThemeTest extends TestCase
{
    public function test_lumi_is_available_in_the_theme_selector(): void
    {
        $themes = Manager::refreshThemes();

        $this->assertArrayHasKey('lumi-academy', $themes);
        $this->assertSame('Lumi Academy', $themes['lumi-academy']['name']);
        $this->assertEmpty($themes['lumi-academy']['required_plugins']);
    }

    public function test_preview_selector_includes_lumi(): void
    {
        $this->get('/theme-preview/')
            ->assertOk()
            ->assertViewHas('themes', fn (array $themes): bool => collect($themes)->contains(
                fn (array $theme): bool => $theme['id'] === 'lumi-academy'
                    && $theme['name'] === 'Lumi Academy'
                    && $theme['url'] === url('/theme-preview/demo/lumi-academy')
            ));
    }

    public function test_lumi_preview_uses_its_own_assets_and_preserves_the_active_theme(): void
    {
        $activeTheme = Theme::getThemeName();

        $this->get('/theme-preview/demo/lumi-academy')
            ->assertOk()
            ->assertSee('Lumi Academy')
            ->assertSee('/themes/lumi-academy/styles.css?v=10', false)
            ->assertSee('/themes/lumi-academy/assets/scene.bundle.js?v=4', false)
            ->assertSee('id="preview-dialog"', false)
            ->assertSee('id="enroll-form"', false);

        $this->assertSame($activeTheme, Theme::getThemeName());
    }

    public function test_admin_can_see_the_lumi_theme_card(): void
    {
        $admin = User::query()->where('super_user', true)->firstOrFail();

        $this->actingAs($admin)->get('/admin/theme/all')
            ->assertOk()
            ->assertSee('Lumi Academy');

        $this->assertFileExists(theme_path('lumi-academy/screenshot.png'));
    }
}
