<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class FashionThemeTest extends TestCase
{
    public function test_fashion_theme_is_available_in_preview_and_admin(): void
    {
        $themes = Manager::refreshThemes();
        $this->assertArrayHasKey('fashion', $themes);
        $this->assertSame('Thời trang', $themes['fashion']['name']);
        $this->get('/theme-preview/')->assertOk()->assertViewHas('themes', fn (array $items): bool => collect($items)->contains(
            fn (array $theme): bool => $theme['id'] === 'fashion' && $theme['name'] === 'Thời trang'
        ));
        $admin = User::query()->where('super_user', true)->firstOrFail();
        $this->actingAs($admin)->get('/admin/theme/all')->assertOk()->assertSee('Thời trang');
    }

    public function test_fashion_preview_uses_local_assets_and_preserves_the_active_theme(): void
    {
        $active = Theme::getThemeName();
        $this->get('/theme-preview/demo/fashion')->assertOk()
            ->assertSee('lang="vi"', false)->assertSee('TG THANG')
            ->assertSee('Nghệ thuật trong từng đường thêu.')
            ->assertSee('/themes/fashion/assets/logo.svg', false)
            ->assertSee('/themes/fashion/assets/hero.mp4', false)
            ->assertSee('/themes/fashion/styles.css', false)
            ->assertSee('id="fashion-spinner"', false)
            ->assertSee('id="fashion-booking"', false)
            ->assertSee('id="fashion-newsletter"', false)
            ->assertDontSee('agnestoth.com/cdn');
        $this->assertSame($active, Theme::getThemeName());
    }

    public function test_rotation_video_supports_byte_ranges_and_rejects_other_files(): void
    {
        $size = filesize(theme_path('fashion') . '/public/assets/spinner-3.mp4');
        $this->withHeaders(['Range' => 'bytes=0-15'])->get('/theme-preview/media/fashion/spinner-3.mp4')
            ->assertStatus(206)->assertHeader('Content-Range', 'bytes 0-15/' . $size)
            ->assertHeader('Content-Length', '16')->assertHeader('Content-Type', 'video/mp4');
        $this->get('/theme-preview/media/fashion/logo.svg')->assertNotFound();
        $this->get('/theme-preview/media/fashion/spinner-99.mp4')->assertNotFound();
    }
}
