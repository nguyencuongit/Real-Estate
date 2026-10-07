<?php

namespace Theme\TGThangBeauty\Http\Controllers;

use Botble\Base\Http\Controllers\BaseController;
use Botble\Theme\Facades\Theme;
use Illuminate\Http\Response;

class BeautyController extends BaseController
{
    public function __invoke(): Response
    {
        return Theme::layout('default')->scope('index')->render();
    }
}
