<div class="gym-membership" wire:key="gym-membership">
    <div class="gym-membership__tabs" role="tablist" aria-label="Chọn gói hội viên">
        @foreach ($plans as $key => $plan)
            <flux:button
                type="button"
                wire:click="selectPlan('{{ $key }}')"
                @class(['gym-membership__tab', 'is-active' => $selectedPlan === $key])
                :aria-pressed="$selectedPlan === $key ? 'true' : 'false'"
            >
                {{ $plan['name'] }}
                @if ($key === 'core')
                    <span class="gym-membership__tab-badge">Phổ biến</span>
                @endif
            </flux:button>
        @endforeach
    </div>

    <div class="gym-membership__card" aria-live="polite">
        <div class="gym-membership__details">
            <div class="gym-membership__badge-row">
                <span class="gym-eyebrow gym-eyebrow--volt">Gói bạn đang chọn</span>
                @if ($selectedPlan === 'core')
                    <span class="gym-badge">Khuyên dùng</span>
                @endif
            </div>
            <h3 class="gym-membership__title">{{ $currentPlan['name'] }}</h3>
            <p class="gym-membership__desc">{{ $currentPlan['description'] }}</p>
            <ul class="gym-membership__features">
                @foreach ($currentPlan['features'] as $feature)
                    <li><i class="bi bi-check-circle-fill"></i><span>{{ $feature }}</span></li>
                @endforeach
            </ul>
        </div>

        <div class="gym-membership__price">
            <span class="gym-membership__price-label">Chi phí đầu tư</span>
            <div class="gym-membership__amount">
                <strong>{{ $currentPlan['price'] }}</strong>
                <span>{{ $currentPlan['period'] }}</span>
            </div>
            <a href="tel:02873009999" class="gym-btn gym-btn--primary gym-button gym-button--lime">Đăng ký tư vấn <i class="bi bi-arrow-up-right"></i></a>
            <small class="gym-membership__note"><i class="bi bi-shield-check"></i> Không phí ẩn · Hủy linh hoạt bất cứ lúc nào</small>
        </div>
    </div>
</div>
