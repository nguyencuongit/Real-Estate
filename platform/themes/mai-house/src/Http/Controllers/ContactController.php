<?php

namespace Theme\MaiHouse\Http\Controllers;

use Botble\Base\Rules\PhoneNumberRule;
use Botble\Contact\Events\SentContactEvent;
use Botble\Contact\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ContactController
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', new PhoneNumberRule()],
        ]);

        $name = mb_substr($this->field($request, 'name'), 0, 60);
        $email = mb_substr($this->field($request, 'email'), 0, 60);
        $content = $this->field($request, 'content');

        $contact = Contact::query()->create([
            'name' => $name !== '' ? $name : 'Khách liên hệ',
            'email' => $email !== '' ? $email : null,
            'phone' => $request->input('phone'),
            'subject' => 'Liên hệ từ Mai House',
            'content' => $content !== '' ? $content : 'Khách để lại số điện thoại để được liên hệ.',
        ]);

        try {
            event(new SentContactEvent($contact));
        } catch (Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'error' => false,
            'message' => 'Gửi tin nhắn thành công!',
        ]);
    }

    private function field(Request $request, string $name): string
    {
        $value = $request->input($name);

        return is_scalar($value) ? trim((string) $value) : '';
    }
}
