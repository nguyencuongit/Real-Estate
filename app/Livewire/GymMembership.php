<?php

namespace App\Livewire;

use Illuminate\Contracts\View\View;
use Livewire\Component;

class GymMembership extends Component
{
    public string $selectedPlan = 'core';

    /** The landing page deliberately has no persistence. */
    public function selectPlan(string $plan): void
    {
        if (array_key_exists($plan, $this->plans())) {
            $this->selectedPlan = $plan;
        }
    }

    public function plans(): array
    {
        return [
            'start' => ['name' => 'Khởi động', 'price' => '399.000đ', 'period' => '/ tháng', 'description' => 'Dành cho người mới muốn xây nền tảng thật chắc.', 'features' => ['Khu tập không giới hạn', '1 buổi đánh giá thể chất', 'Lịch tập cá nhân cơ bản']],
            'core' => ['name' => 'Bứt phá', 'price' => '699.000đ', 'period' => '/ tháng', 'description' => 'Lựa chọn cân bằng để giữ nhịp tiến bộ mỗi tuần.', 'features' => ['Mọi quyền lợi Khởi động', 'Không giới hạn lớp nhóm', '2 buổi PT mỗi tháng']],
            'elite' => ['name' => 'Toàn diện', 'price' => '1.290.000đ', 'period' => '/ tháng', 'description' => 'Đồng hành 1:1 cho mục tiêu lớn và kết quả đo được.', 'features' => ['Mọi quyền lợi Bứt phá', '8 buổi PT mỗi tháng', 'Tư vấn dinh dưỡng hàng tuần']],
        ];
    }

    public function render(): View
    {
        $plans = $this->plans();

        return view('livewire.gym-membership', [
            'plans' => $plans,
            'currentPlan' => $plans[$this->selectedPlan] ?? $plans['core'],
        ]);
    }
}
