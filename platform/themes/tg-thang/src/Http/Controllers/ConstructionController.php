<?php

namespace Theme\TGThang\Http\Controllers;

use Botble\Base\Http\Controllers\BaseController;
use Botble\Theme\Facades\Theme;
use Illuminate\Http\Response;

class ConstructionController extends BaseController
{
    public function __invoke(): Response
    {
        return Theme::layout('default')->scope('index')->render();
    }
}
