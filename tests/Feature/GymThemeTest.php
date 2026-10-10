<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class GymThemeTest extends TestCase
{
    public function test_gym_theme_is_available_in_preview_and_admin(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('gym', $themes);
        $this->assertSame('Phòng gym', $themes['gym']['name']);
        $this->get('/theme-preview/')->assertOk()->assertViewHas('themes', fn (array $items): bool => collect($items)->contains(
            fn (array $theme): bool => $theme['id'] === 'gym' && $theme['name'] === 'Phòng gym'
        ));
        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Phòng gym');
    }

    public function test_gym_preview_uses_vietnamese_brand_and_local_assets_and_preserves_active_theme(): void
    {
        $active = Theme::getThemeName();
        $this->get('/theme-preview/demo/gym')->assertOk()
            ->assertSee('lang="vi"', false)->assertSee('TG THANG')
            ->assertSee('Mạnh mẽ')->assertSee('Từ hôm nay.')
            ->assertSee('/themes/gym/assets/logo.svg', false)
            ->assertSee('/themes/gym/assets/hero.mp4', false)
            ->assertSee('/themes/gym/styles.css', false)
            ->assertSee('/themes/gym/script.js', false)
            ->assertSee('id="gym-trainers"', false)
            ->assertSee('id="gym-services"', false)
            ->assertSee('id="gym-contact-form"', false)
            ->assertSee('id="gym-schedule"', false)
            ->assertDontSee('Flexova');
        $this->assertSame($active, Theme::getThemeName());
    }
}
