<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class SpaThemeTest extends TestCase
{
    public function test_spa_theme_is_available_in_preview_and_admin(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('spa', $themes);
        $this->assertSame('Spa', $themes['spa']['name']);
        $this->get('/theme-preview/')->assertOk()->assertViewHas('themes', fn (array $items): bool => collect($items)->contains(
            fn (array $theme): bool => $theme['id'] === 'spa' && $theme['name'] === 'Spa'
        ));
        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Spa');
    }

    public function test_spa_preview_renders_local_vietnamese_demo_without_changing_active_theme(): void
    {
        $active = Theme::getThemeName();
        $this->get('/theme-preview/demo/spa')->assertOk()
            ->assertSee('lang="vi"', false)->assertSee('TG THANG')
            ->assertSee('Chạm vào an yên')->assertSee('Massage đá nóng')
            ->assertSee('/themes/spa/assets/logo.svg', false)
            ->assertSee('/themes/spa/styles.css', false)
            ->assertSee('/themes/spa/script.js', false)
            ->assertSee('/themes/spa/reveal.js', false)
            ->assertSee('id="spa-journey"', false)
            ->assertSee('id="spa-rituals"', false)
            ->assertSee('id="spa-booking"', false)
            ->assertDontSee('7 SKY SPA');
        $this->assertSame($active, Theme::getThemeName());
    }
}
