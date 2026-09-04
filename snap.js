/**
 * KlikQris Snap Payment Gateway Client Library
 * Formatted and enhanced with professional security & trust assurances.
 */
!(function () {
    const API_URL = "https://klikqris.com/api";
    let statusInterval = null;
    let countdownTimerInterval = null;

    // Load external resources (fonts, icons, QRCode library)
    function loadAssets() {
        const assets = [
            { tag: "link", rel: "preconnect", href: "https://fonts.googleapis.com" },
            { tag: "link", rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: true },
            { tag: "link", rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
            { tag: "link", rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" },
            { tag: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" }
        ];

        assets.forEach(asset => {
            let element;
            if (asset.tag === "link") {
                if (!document.querySelector(`link[href="${asset.href}"]`)) {
                    element = document.createElement("link");
                    element.rel = asset.rel;
                    element.href = asset.href;
                    if (asset.crossOrigin) {
                        element.crossOrigin = asset.crossOrigin;
                    }
                    document.head.appendChild(element);
                }
            } else if (asset.tag === "script") {
                if (!document.querySelector(`script[src="${asset.src}"]`)) {
                    element = document.createElement("script");
                    element.src = asset.src;
                    document.head.appendChild(element);
                }
            }
        });
    }

    // Update the payment modal UI with transaction data
    function updateModalUI(data) {
        const merchantNameEl = document.getElementById("snap-merchant-name");
        merchantNameEl.innerHTML = "";
        merchantNameEl.textContent = data.merchant_name;

        // Verified Merchant Icon
        const verifiedIcon = document.createElement("i");
        verifiedIcon.className = "bi bi-patch-check-fill";
        verifiedIcon.style.color = "var(--snap-primary)";
        verifiedIcon.style.marginLeft = "6px";
        merchantNameEl.appendChild(verifiedIcon);

        document.getElementById("snap-order-id").innerText = data.order_id;
        document.getElementById("snap-amount-val").innerText = new Intl.NumberFormat("id-ID").format(data.amount);
        document.getElementById("snap-date").innerText = new Date(data.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
        document.getElementById("snap-desc").innerText = data.keterangan || "-";

        const leftPanel = document.getElementById("snap-left-panel");
        const pendingState = document.getElementById("snap-pending");
        const successState = document.getElementById("snap-success");
        const expiredState = document.getElementById("snap-expired");

        // Hide all states first
        document.getElementById("snap-loading").classList.add("hidden");
        pendingState.classList.add("hidden");
        successState.classList.add("hidden");
        expiredState.classList.add("hidden");
        document.getElementById("btn-manual-check").classList.add("hidden");

        if (data.status === "SUCCESS" || data.status === "PAID" || data.status === "SETTLEMENT") {
            successState.classList.remove("hidden");
            leftPanel.style.backgroundColor = "var(--snap-success)";
            stopIntervals();
        } else if (data.is_expired || data.status === "EXPIRED") {
            expiredState.classList.remove("hidden");
            leftPanel.style.backgroundColor = "var(--snap-danger)";
            stopIntervals();
        } else {
            pendingState.classList.remove("hidden");
            leftPanel.style.backgroundColor = "var(--snap-bg-card-dark)";
            document.getElementById("btn-manual-check").classList.remove("hidden");

            // Generate QR Code / Render QR Image
            const qrContainer = document.getElementById("snap-qr-container");
            qrContainer.innerHTML = "";
            const qrisImgUrl = data.qris_image || data.qris_url;
            if (qrisImgUrl) {
                const img = document.createElement("img");
                img.src = qrisImgUrl;
                img.alt = "QRIS";
                img.className = "snap-qr-img";
                img.onerror = function () {
                    qrContainer.innerHTML = "";
                    if (data.qris_string && typeof QRCode !== "undefined") {
                        const qrSize = window.innerWidth <= 768 ? 180 : 200;
                        new QRCode(qrContainer, {
                            text: data.qris_string,
                            width: qrSize,
                            height: qrSize,
                            correctLevel: QRCode.CorrectLevel.L
                        });
                    }
                };
                qrContainer.appendChild(img);
            } else if (data.qris_string) {
                if (typeof QRCode === "undefined") {
                    qrContainer.innerText = "Loading QR...";
                    setTimeout(() => updateModalUI(data), 500);
                    return;
                }
                const qrSize = window.innerWidth <= 768 ? 180 : 200;
                new QRCode(qrContainer, {
                    text: data.qris_string,
                    width: qrSize,
                    height: qrSize,
                    correctLevel: QRCode.CorrectLevel.L
                });
            }

            // Start Countdown Timer
            if (data.remaining_time > 0) {
                startCountdown(data.remaining_time);
            } else {
                document.getElementById("snap-timer").innerText = "00:00";
            }

            // Start Transaction Status Polling
            startPolling(data.order_id);
        }
    }

    // Start countdown timer
    function startCountdown(seconds) {
        clearInterval(countdownTimerInterval);
        if (seconds <= 0) {
            document.getElementById("snap-timer").innerText = "00:00";
            return;
        }

        const targetTime = new Date().getTime() + seconds * 1000;

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance < 0) {
                clearInterval(countdownTimerInterval);
                document.getElementById("snap-timer").innerText = "00:00";
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((distance % (1000 * 60)) / 1000);

            const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
            const displaySeconds = secs < 10 ? "0" + secs : secs;

            document.getElementById("snap-timer").innerText = `${displayMinutes}:${displaySeconds}`;
        }

        updateTimer();
        countdownTimerInterval = setInterval(updateTimer, 1000);
    }

    // Start background status polling
    function startPolling(orderId) {
        if (statusInterval) return;

        statusInterval = setInterval(() => {
            fetch(`${API_URL}/cek-status-direct?order_id=${orderId}`)
                .then(res => res.json())
                .then(res => {
                    if (res.status && res.data.transaction_status === "SUCCESS") {
                        document.getElementById("snap-pending").classList.add("hidden");
                        document.getElementById("snap-success").classList.remove("hidden");
                        document.getElementById("snap-left-panel").style.backgroundColor = "var(--snap-success)";
                        stopIntervals();
                    }
                })
                .catch(console.error);
        }, 5000);
    }

    // Stop all active intervals
    function stopIntervals() {
        clearInterval(statusInterval);
        clearInterval(countdownTimerInterval);
        statusInterval = null;
    }

    // Initialize the checkout button on page load
    function init() {
        loadAssets();
        const payButton = document.getElementById("btnPay");
        if (payButton) {
            payButton.addEventListener("click", function (e) {
                e.preventDefault();
                const signature = this.getAttribute("data-signature");
                if (signature) {
                    SnapPayment.pay(signature);
                } else {
                    console.error("No signature found on #btnPay");
                }
            });
        }
    }

    // Define globally accessible payment SDK methods
    window.SnapPayment = {
        pay: function (signature) {
            loadAssets();

            // Inject CSS styles if they do not exist
            (function injectStyles() {
                const styleId = "snap-payment-styles";
                if (document.getElementById(styleId)) return;

                const styleElement = document.createElement("style");
                styleElement.id = styleId;
                styleElement.textContent = `
                    :root {
                        --snap-bg-overlay: rgba(15, 23, 42, 0.6);
                        --snap-bg-card-dark: #0F172A;
                        --snap-primary: #3B82F6;
                        --snap-warning: #F59E0B;
                        --snap-danger: #EF4444;
                        --snap-success: #16A34A;
                        --snap-font: 'Plus Jakarta Sans', sans-serif;
                    }
                    
                    #snap-modal-overlay {
                        position: fixed;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background: var(--snap-bg-overlay);
                        backdrop-filter: blur(4px);
                        z-index: 9999;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.3s ease;
                        padding: 16px;
                        box-sizing: border-box;
                    }
                    #snap-modal-overlay.open {
                        opacity: 1;
                        visibility: visible;
                    }
                    
                    .snap-card {
                        width: 100%;
                        max-width: 650px;
                        background: white;
                        border-radius: 24px;
                        box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.2);
                        display: flex;
                        overflow: hidden;
                        position: relative;
                        transform: translateY(20px);
                        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        font-family: var(--snap-font);
                    }
                    #snap-modal-overlay.open .snap-card {
                        transform: translateY(0);
                    }
                    
                    .snap-col-left {
                        flex: 1;
                        padding: 32px;
                        background-color: var(--snap-bg-card-dark);
                        color: #F8FAFC;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        transition: background-color 0.3s;
                    }
                    
                    .snap-col-right {
                        flex: 1.1;
                        padding: 32px 40px;
                        background: white;
                        color: #0F172A;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        position: relative;
                    }

                    .snap-close-btn {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #94A3B8;
                        padding: 0;
                        line-height: 1;
                        z-index: 10;
                    }
                    .snap-close-btn:hover { color: #64748B; }
                    
                    /* Mobile Optimized - NO SCROLL */
                    @media (max-width: 768px) {
                        #snap-modal-overlay {
                            padding: 0;
                            align-items: flex-start;
                        }
                        
                        .snap-card { 
                            flex-direction: column; 
                            max-width: 100%; 
                            width: 100%;
                            max-height: 100vh;
                            height: 100vh;
                            border-radius: 0;
                            box-shadow: none;
                            overflow: hidden;
                        }

                        .snap-col-left { 
                            padding: 16px 12px 12px;
                            flex: 0 0 auto;
                            min-height: 0;
                        }
                        
                        .snap-col-right { 
                            padding: 12px 16px 16px;
                            flex: 1 1 auto;
                            justify-content: flex-start;
                            overflow-y: auto;
                            -webkit-overflow-scrolling: touch;
                        }
                        
                        /* Compact Timer */
                        .snap-timer-box { 
                            padding: 4px 10px;
                            font-size: 0.7rem;
                            margin-bottom: 8px;
                            gap: 4px;
                        }
                        
                        /* Compact QR */
                        .snap-qr-frame { 
                            width: 100%;
                            max-width: 220px;
                            height: auto !important;
                            padding: 8px;
                            margin-bottom: 8px;
                            border-radius: 12px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        
                        /* Compact Text */
                        #snap-pending .mb-2 { 
                            font-size: 0.75rem;
                            margin-bottom: 6px;
                            font-weight: 600;
                        }
                        
                        #snap-pending > div:last-child {
                            font-size: 0.65rem;
                            margin-top: 6px;
                        }
                        
                        #snap-manual-msg {
                            font-size: 0.7rem !important;
                            margin-top: 4px !important;
                        }
                        
                        /* Right Panel - Compact */
                        #snap-merchant-name { 
                            font-size: 0.85rem !important;
                            margin-bottom: 2px !important;
                        }
                        
                        #snap-merchant-name i {
                            font-size: 0.75rem;
                        }
                        
                        #snap-order-id {
                            font-size: 0.65rem;
                        }
                        
                        .snap-col-right > div:first-child {
                            padding-bottom: 12px !important;
                            margin-bottom: 12px !important;
                        }
                        
                        .snap-col-right > div:nth-child(2) {
                            font-size: 0.65rem !important;
                            margin-bottom: 2px !important;
                        }
                        
                        /* Amount */
                        .snap-amount { 
                            font-size: 1.8rem !important;
                            margin-bottom: 12px !important;
                        }
                        
                        .snap-amount span:first-child { 
                            font-size: 1rem !important;
                            margin-top: 4px !important;
                        }
                        
                        /* Details */
                        .snap-detail-row { 
                            font-size: 0.7rem !important;
                            margin-bottom: 8px !important;
                        }
                        
                        /* Button */
                        .snap-btn-action { 
                            padding: 10px !important;
                            font-size: 0.8rem !important;
                            margin-top: 12px !important;
                            border-radius: 10px !important;
                        }
                        
                        /* Status Icons - Compact */
                        .snap-status-icon { 
                            font-size: 2.5rem !important;
                            margin-bottom: 8px !important;
                        }
                        
                        #snap-success h3, #snap-expired h3 { 
                            font-size: 1rem !important;
                            margin-bottom: 4px !important;
                        }
                        
                        #snap-success p, #snap-expired p { 
                            font-size: 0.75rem !important;
                            margin-bottom: 0 !important;
                        }
                        
                        /* Exit Button Style on Mobile */
                        .snap-close-btn {
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            background: rgba(255, 255, 255, 0.15);
                            backdrop-filter: blur(10px);
                            border: 2px solid rgba(255, 255, 255, 0.3);
                            width: 42px;
                            height: 42px;
                            border-radius: 50%;
                            font-size: 28px;
                            font-weight: 300;
                            cursor: pointer;
                            color: #fff;
                            padding: 0;
                            line-height: 1;
                            z-index: 10;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        }
                        .snap-close-btn:hover { 
                            background: rgba(255, 255, 255, 0.25);
                            border-color: rgba(255, 255, 255, 0.5);
                            transform: scale(1.08);
                            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
                        }
                        .snap-close-btn:active {
                            transform: scale(0.95);
                        }
                        
                        /* Loading State */
                        #snap-loading {
                            margin: 0;
                        }
                        
                        #snap-loading > div:first-child {
                            width: 32px !important;
                            height: 32px !important;
                            border-width: 3px !important;
                            margin-bottom: 10px !important;
                        }
                        
                        #snap-loading p {
                            font-size: 0.75rem;
                            margin: 0;
                        }

                        /* Footer styles overrides for mobile */
                        .snap-footer {
                            margin-top: 16px !important;
                            padding-top: 12px !important;
                            gap: 8px !important;
                        }
                        .snap-powered-by {
                            font-size: 0.7rem !important;
                        }
                    }

                    /* Components */
                    .snap-timer-box {
                        background: rgba(245, 158, 11, 0.1);
                        border: 1px solid rgba(245, 158, 11, 0.4);
                        color: #fbbf24;
                        padding: 6px 14px;
                        border-radius: 99px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 16px;
                        font-size: 0.9rem;
                        font-weight: 700;
                    }
                    
                    .snap-qr-frame {
                        background: white;
                        padding: 10px;
                        border-radius: 18px;
                        box-shadow: 0 0 40px -10px rgba(59, 130, 246, 0.2);
                        margin-bottom: 24px;
                        width: 100%;
                        max-width: 240px;
                        height: auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .snap-qr-img { width: 100%; height: auto !important; object-fit: contain; border-radius: 10px; display: block; }
                    .snap-qr-frame img, .snap-qr-frame canvas { width: 100%; height: auto !important; }
                    
                    .snap-amount {
                        font-size: 2.5rem;
                        font-weight: 800;
                        letter-spacing: -1px;
                        line-height: 1;
                        background: -webkit-linear-gradient(45deg, #0F172A, #334155);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 20px;
                    }
                    
                    .snap-detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 12px;
                        font-size: 0.9rem;
                    }
                    .snap-detail-label { color: #64748B; font-weight: 600; }
                    .snap-detail-value { color: #0F172A; font-weight: 700; }
                    
                    .snap-btn-action {
                        width: 100%;
                        padding: 16px;
                        border-radius: 12px;
                        background: var(--snap-bg-card-dark);
                        color: white;
                        border: none;
                        font-weight: 700;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        margin-top: 16px;
                    }
                    .snap-btn-action:hover { background: #1E293B; }
                    
                    .snap-status-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                        display: block;
                    }
                    
                    /* Utils */
                    .hidden { display: none !important; }
                    .text-center { text-align: center; }
                    .mb-2 { margin-bottom: 8px; }
                    .text-white { color: white !important; }
                    
                    @keyframes spin { 
                        0% { transform: rotate(0deg); } 
                        100% { transform: rotate(360deg); } 
                    }
                    
                    @keyframes spin-slow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    /* Footer & Security Assurances */
                    .snap-footer {
                        margin-top: auto;
                        padding-top: 20px;
                        border-top: 1px dashed #E2E8F0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                    }
                    .snap-powered-by {
                        font-size: 0.75rem;
                        color: #94A3B8;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }
                    .snap-powered-by a {
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 2px;
                        transition: opacity 0.2s ease;
                    }
                    .snap-powered-by a:hover {
                        opacity: 0.8;
                    }
                    .snap-powered-by .brand-qris {
                        font-weight: 800;
                        color: #0F172A;
                    }
                    .snap-powered-by .brand-color {
                        color: #2563EB;
                    }
                `;
                document.head.appendChild(styleElement);
            })();

            // Inject HTML Modal if it does not exist
            (function injectModal() {
                if (document.getElementById("snap-modal-overlay")) return;

                const modalWrapper = document.createElement("div");
                modalWrapper.id = "snap-modal-overlay";
                modalWrapper.innerHTML = `
                    <div class="snap-card">
                        <button class="snap-close-btn" onclick="SnapPayment.close()">&times;</button>
                        
                        <!-- LEFT SIDE: QR & Payment Info -->
                        <div class="snap-col-left" id="snap-left-panel">
                            <!-- Loading State -->
                            <div id="snap-loading" class="text-center">
                                <div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.2); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                                <p>Memuat Transaksi...</p>
                            </div>

                            <!-- Pending State (Active payment) -->
                            <div id="snap-pending" class="hidden" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <div class="snap-timer-box">
                                    <i class="bi bi-stopwatch"></i>
                                    <span id="snap-timer">--:--</span>
                                </div>
                                <div class="mb-2" style="font-weight: 600;">Scan QRIS untuk Membayar</div>
                                <div class="snap-qr-frame" id="snap-qr-container"></div>
                                <div style="font-size: 0.8rem; opacity: 0.85; margin-top: 10px; display: flex; align-items: center; gap: 6px;">
                                    <i class="bi bi-arrow-repeat" style="animation: spin-slow 2s linear infinite;"></i> Sistem mengecek status otomatis...
                                </div>
                                <div style="font-size: 0.75rem; opacity: 0.65; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                                    <i class="bi bi-shield-check"></i> QRIS Standar Nasional Terenkripsi
                                </div>
                                <div id="snap-manual-msg" style="margin-top: 8px; font-weight: 600; font-size: 0.85rem; color: #F59E0B; min-height: 20px;"></div>
                            </div>

                            <!-- Success State -->
                            <div id="snap-success" class="hidden text-center">
                                <i class="bi bi-check-circle-fill snap-status-icon text-white"></i>
                                <h3 class="text-white mb-2" style="font-weight: 700; font-size: 1.5rem;">Pembayaran Berhasil</h3>
                                <p class="text-white" style="opacity: 0.8; font-size: 0.9rem;">Terima kasih, pembayaran Anda telah diterima.</p>
                            </div>

                            <!-- Expired State -->
                            <div id="snap-expired" class="hidden text-center">
                                <i class="bi bi-x-circle-fill snap-status-icon text-white"></i>
                                <h3 class="text-white mb-2" style="font-weight: 700; font-size: 1.5rem;">Kadaluarsa</h3>
                                <p class="text-white" style="opacity: 0.8; font-size: 0.9rem;">Waktu pembayaran telah habis.</p>
                            </div>
                        </div>

                        <!-- RIGHT SIDE: Merchant & Billing Details -->
                        <div class="snap-col-right">
                            <div style="border-bottom: 2px dashed #E2E8F0; padding-bottom: 20px; margin-bottom: 20px;">
                                <h4 id="snap-merchant-name" style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px; display: flex; align-items: center; gap: 6px;">
                                    Merchant Name <i class="bi bi-patch-check-fill" style="color: var(--snap-primary);"></i>
                                </h4>
                                <div style="font-size: 0.75rem; color: #64748B; font-weight: 600;">ORDER ID: <span id="snap-order-id">...</span></div>
                            </div>

                            <div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Total Pembayaran</div>
                            <div class="snap-amount">
                                <span style="font-size: 1.5rem; vertical-align: top; margin-top: 8px; display: inline-block;">Rp</span>
                                <span id="snap-amount-val">0</span>
                            </div>

                            <div class="snap-detail-row">
                                <span class="snap-detail-label">Tanggal</span>
                                <span class="snap-detail-value" id="snap-date">-</span>
                            </div>
                            <div class="snap-detail-row">
                                <span class="snap-detail-label">Keterangan</span>
                                <span class="snap-detail-value" id="snap-desc" style="max-width: 65%; text-align: right; line-height: 1.2;">-</span>
                            </div>

                            <button class="snap-btn-action hidden" id="btn-manual-check" onclick="SnapPayment.checkStatusManual()">
                                <i class="bi bi-arrow-clockwise"></i> Cek Status Pembayaran
                            </button>

                            <!-- Trust Badges & Powered By footer -->
                            <div class="snap-footer">
                                <div class="snap-powered-by">
                                    <span>Powered by</span>
                                    <a href="https://klikqris.com/" target="_blank">
                                        <span class="brand-qris">Klik<span class="brand-color">QRIS</span></span>
                                    </a>
                                    <span style="color:#CBD5E1; margin: 0 2px;">|</span>
                                    <span style="display: flex; align-items: center; gap: 2px;">
                                        <i class="bi bi-shield-fill-check" style="color:#10B981;"></i> Aman & Terpercaya
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modalWrapper);
            })();

            // Show the modal backdrop & loader
            document.getElementById("snap-modal-overlay").classList.add("open");
            document.getElementById("snap-loading").classList.remove("hidden");
            document.getElementById("snap-pending").classList.add("hidden");
            
            const msgEl = document.getElementById("snap-manual-msg");
            if (msgEl) msgEl.innerText = "";

            // Check signature and load transaction from endpoint
            fetch(`${API_URL}/snap/check-transaction?signature=${signature}`)
                .then(res => res.json())
                .then(res => {
                    if (res.status) {
                        updateModalUI(res.data);
                    } else {
                        alert(res.message);
                        SnapPayment.close();
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Gagal memuat transaksi");
                    SnapPayment.close();
                });
        },

        close: function () {
            document.getElementById("snap-modal-overlay").classList.remove("open");
            stopIntervals();
        },

        checkStatusManual: function () {
            const orderId = document.getElementById("snap-order-id").innerText;
            const statusMsgEl = document.getElementById("snap-manual-msg");
            if (statusMsgEl) statusMsgEl.innerText = "Mengecek...";

            if (orderId && orderId !== "...") {
                fetch(`${API_URL}/cek-status-direct?order_id=${orderId}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.status && res.data.transaction_status === "SUCCESS") {
                            document.getElementById("snap-pending").classList.add("hidden");
                            document.getElementById("snap-success").classList.remove("hidden");
                            document.getElementById("snap-left-panel").style.backgroundColor = "var(--snap-success)";
                            stopIntervals();
                        } else {
                            if (statusMsgEl) {
                                statusMsgEl.style.color = "#F59E0B";
                                statusMsgEl.innerText = "Status: " + (res.data ? res.data.transaction_status : "Pending");
                                setTimeout(() => {
                                    statusMsgEl.innerText = "";
                                }, 3000);
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        if (statusMsgEl) {
                            statusMsgEl.style.color = "#EF4444";
                            statusMsgEl.innerText = "Gagal mengecek status";
                        }
                    });
            }
        }
    };

    // DOMContentLoaded or immediate initialization
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();