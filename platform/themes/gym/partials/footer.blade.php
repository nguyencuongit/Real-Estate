        <footer class="gym-footer">
            <div class="gym-shell gym-footer__grid">
                <div>
                    <a class="gym-brand" href="{{ BaseHelper::getHomepageUrl() }}" aria-label="PULSE Gym - Trang chủ">
                        <span class="gym-brand__mark"><i class="bi bi-lightning-charge-fill"></i></span>
                        <span class="gym-brand__text">PULSE<span>GYM</span></span>
                    </a>
                    <p class="gym-footer__intro">Không chỉ là một phòng tập. Đây là nơi bạn xây một phiên bản khoẻ hơn của chính mình.</p>
                </div>
                <div>
                    <p class="gym-footer__label">Khám phá</p>
                    <a href="#about">Về PULSE</a>
                    <a href="#programs">Lớp tập</a>
                    <a href="#coaches">Đội ngũ</a>
                    <a href="#memberships">Gói hội viên</a>
                </div>
                <div>
                    <p class="gym-footer__label">Liên hệ</p>
                    <a href="tel:02873009999">028 7300 9999</a>
                    <a href="mailto:hello@pulsegym.vn">hello@pulsegym.vn</a>
                    <span>08:00 - 22:00, mỗi ngày</span>
                    <span>Quận 7, TP. Hồ Chí Minh</span>
                </div>
                <div>
                    <p class="gym-footer__label">Theo dõi</p>
                    <div class="gym-socials">
                        <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                        <a href="#" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
                        <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>
            </div>

            <div class="gym-shell gym-footer__bottom">
                <span>© {{ date('Y') }} PULSE GYM. STRONGER EVERY DAY.</span>
                <a href="#top">Lên đầu trang <i class="bi bi-arrow-up"></i></a>
            </div>
        </footer>

        {!! Theme::footer() !!}
        @fluxScripts
    </body>
</html>
