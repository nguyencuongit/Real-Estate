<?php

namespace Tests\Feature;

use Botble\ACL\Models\User;
use Botble\Theme\Facades\Manager;
use Botble\Theme\Facades\Theme;
use Tests\TestCase;

class AnNhienThemeTest extends TestCase
{
    public function test_demo_is_available_in_the_theme_selector(): void
    {
        $themes = Manager::refreshThemes();

        $this->assertArrayHasKey('an-nhien-residence', $themes);
        $this->assertSame('Bất động sản', $themes['an-nhien-residence']['name']);
        $this->assertEmpty($themes['an-nhien-residence']['required_plugins']);
    }

    public function test_demo_renders_its_own_content_and_theme_asset_urls(): void
    {
        Theme::uses('an-nhien-residence')->layout('default');

        $html = Theme::scope('index')->render()->getContent();

        $this->assertStringContainsString('Chốn về bên biển', $html);
        $this->assertStringContainsString('/themes/an-nhien-residence/assets/hero-day.webp', $html);
        $this->assertStringContainsString('/themes/an-nhien-residence/script.js?v=13', $html);
        $this->assertStringContainsString('aria-controls="tower-preview"', $html);
        $this->assertStringContainsString('/themes/an-nhien-residence/assets/hotspot-villa.webp', $html);
        $this->assertStringContainsString('id="enquiry-form"', $html);
        $this->assertStringNotContainsString('LyLy Flower', $html);
    }

    public function test_admin_can_see_the_demo_theme_card(): void
    {
        $admin = User::query()->where('super_user', true)->firstOrFail();

        $this->actingAs($admin)
            ->get('/admin/theme/all')
            ->assertOk()
            ->assertSee('Bất động sản')
            ->assertSee('data:image/png;base64,', false);

        $this->assertFileExists(theme_path('an-nhien-residence/screenshot.png'));
    }
}
