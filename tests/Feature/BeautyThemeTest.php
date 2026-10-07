<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class BeautyThemeTest extends TestCase
{
    public function test_beauty_theme_is_available_in_preview_and_admin(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('lam-dep', $themes);
        $this->assertSame('Làm đẹp', $themes['lam-dep']['name']);
        $this->get('/theme-preview/')->assertOk()->assertViewHas('themes', fn (array $items): bool => collect($items)->contains(
            fn (array $theme): bool => $theme['id'] === 'lam-dep' && $theme['name'] === 'Làm đẹp'
        ));
        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Làm đẹp');
    }

    public function test_beauty_preview_uses_vietnamese_brand_and_local_assets_without_changing_the_active_theme(): void
    {
        $active = Theme::getThemeName();
        $this->get('/theme-preview/demo/lam-dep')->assertOk()
            ->assertSee('lang="vi"', false)->assertSee('TG THANG')
            ->assertSee('Đẹp từ từng chi tiết.')->assertSee('Chăm sóc mi')
            ->assertSee('/themes/lam-dep/assets/logo.svg', false)
            ->assertSee('/themes/lam-dep/styles.css', false)
            ->assertSee('/themes/lam-dep/reference-motion.css', false)
            ->assertDontSee('type="module" src=', false)
            ->assertSee('class="welcome-stage"', false)
            ->assertSee('id="beauty-booking"', false)
            ->assertSee('id="beauty-art"', false)
            ->assertSee('id="beauty-services"', false);
        $this->assertSame($active, Theme::getThemeName());
    }
}
