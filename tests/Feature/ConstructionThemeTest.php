<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class ConstructionThemeTest extends TestCase
{
    public function test_construction_theme_is_available_in_the_preview_and_admin(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('tg-thang', $themes);
        $this->assertSame('Công ty xây dựng — TG Thang', $themes['tg-thang']['name']);
        $this->get('/theme-preview/')->assertOk()->assertViewHas('themes', fn (array $themes): bool => collect($themes)->contains(
            fn (array $theme): bool => $theme['id'] === 'tg-thang' && $theme['name'] === 'Công ty xây dựng — TG Thang'
        ));
        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Công ty xây dựng — TG Thang');
    }

    public function test_preview_renders_vietnamese_content_with_local_assets_and_preserves_the_active_theme(): void
    {
        $active = Theme::getThemeName();
        $this->get('/theme-preview/demo/tg-thang')->assertOk()
            ->assertSee('lang="vi"', false)->assertSee('TG THANG')
            ->assertSee('Kiến tạo')->assertSee('Giải pháp')->assertSee('Dự án')
            ->assertSee('/themes/tg-thang/styles.css', false)
            ->assertSee('/themes/tg-thang/assets/building.min.js', false)
            ->assertSee('id="construction-contact"', false);
        $this->assertSame($active, Theme::getThemeName());
    }
}
