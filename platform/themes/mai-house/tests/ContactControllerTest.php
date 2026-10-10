<?php

namespace Tests\Feature;

use Botble\Contact\Events\SentContactEvent;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_phone_alone_creates_an_admin_contact_without_terms(): void
    {
        Event::fake([SentContactEvent::class]);

        $this->postJson(route('mai-house.contact.store'), [
            'phone' => '0901234567',
        ])->assertOk()->assertJsonPath('error', false);

        $this->assertDatabaseHas('contacts', [
            'phone' => '0901234567',
            'name' => 'Khách liên hệ',
            'content' => 'Khách để lại số điện thoại để được liên hệ.',
        ]);
        Event::assertDispatched(SentContactEvent::class);
    }

    public function test_invalid_phone_does_not_create_a_contact(): void
    {
        $this->postJson(route('mai-house.contact.store'), [
            'phone' => 'abc',
        ])->assertUnprocessable()->assertJsonValidationErrors('phone');

        $this->assertDatabaseMissing('contacts', ['phone' => 'abc']);
    }
}
