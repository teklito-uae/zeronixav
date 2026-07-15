<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    /**
     * Seed the ZeroNix AV Platform with 5 services and 12 products each (60 total).
     */
    public function run(): void
    {
        // ─── Services ─────────────────────────────────────────────────────────
        $servicesData = [
            [
                'title'           => 'Meeting Room Solutions',
                'slug'            => 'meeting-room-solutions-in-dubai',
                'summary'         => 'End-to-end AV integration for boardrooms, huddle rooms, and executive suites across Dubai.',
                'content'         => <<<'MD'
### The Challenge

Most Dubai boardrooms run on mismatched hardware — echoing audio, tangled cabling, and touch panels that fail mid-call. Every new office becomes a one-off configuration your IT team has to relearn and support separately.

### The ZeroNix Solution

We deploy certified Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex systems on one standardized hardware blueprint. From a 2-person huddle space to a 30-seat boardroom, every room runs the same tested Crestron and Yealink stack — so your team supports one system, not twenty.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — On-site acoustic and network survey of your Dubai facility.
2. **Design** — A standardized room blueprint sized to your headcount and UC platform.
3. **Install** — Certified engineers commission each room in days, not weeks.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
MD,
                'seo_title'       => 'Meeting Room Solutions in Dubai | ZeroNix AV',
                'seo_description' => 'Professional meeting room AV integration in Dubai. Microsoft Teams Rooms, Zoom Rooms, Cisco Webex certified. Contact ZeroNix AV Solutions.',
                'keywords'        => ['meeting room AV Dubai', 'Microsoft Teams Rooms UAE', 'Zoom Rooms installation Dubai', 'boardroom AV integrator', 'huddle room solutions UAE', 'video conferencing Dubai'],
            ],
            [
                'title'           => 'Digital Signage & LED Walls',
                'slug'            => 'digital-signage-led-walls-in-dubai',
                'summary'         => 'Dynamic digital signage and high-impact LED video walls for retail, hospitality, and corporate environments in Dubai.',
                'content'         => <<<'MD'
### The Challenge

Retail and hospitality brands in Dubai often end up with signage that's hard to update, inconsistent across locations, and dim enough to wash out under mall or lobby lighting — a missed opportunity in a market built on visual impact.

### The ZeroNix Solution

We design fine-pitch LED walls and commercial displays managed from one cloud CMS, so marketing teams push content to every screen across Dubai, Abu Dhabi, or Sharjah in minutes. Every panel is rated for 24/7 operation and calibrated for UAE ambient lighting.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Survey** — We measure your space, lighting, and viewing distance on-site.
2. **Design** — Pixel pitch, mounting, and content workflow matched to your brand.
3. **Install** — Structural mounting and calibration by certified technicians.
4. **Support** — Proactive uptime monitoring and rapid panel replacement.
MD,
                'seo_title'       => 'Digital Signage & LED Video Walls in Dubai | ZeroNix AV',
                'seo_description' => 'LED video walls and digital signage solutions for retail, hospitality, and corporate spaces in Dubai, UAE. ZeroNix AV Solutions.',
                'keywords'        => ['digital signage Dubai', 'LED video wall UAE', 'fine pitch LED installer', 'retail signage solutions Dubai', 'commercial display supplier UAE'],
            ],
            [
                'title'           => 'CCTV & Video Surveillance',
                'slug'            => 'cctv-video-surveillance-in-dubai',
                'summary'         => 'IP-based CCTV and intelligent video surveillance systems designed for enterprise and critical infrastructure in Dubai.',
                'content'         => <<<'MD'
### The Challenge

Many UAE facilities still rely on aging analog cameras and disconnected recorders — leaving blind spots, poor footage quality, and no clear way to meet SIRA compliance requirements when audited.

### The ZeroNix Solution

We design IP surveillance systems with AI analytics — facial recognition, LPR, and perimeter alerts — built on Hikvision, Axis, and Bosch hardware, monitored around the clock from our Dubai NOC and fully aligned with SIRA and Civil Defense standards.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Audit** — Site walk to map coverage gaps and compliance requirements.
2. **Design** — Camera placement, storage, and VMS architecture for your facility.
3. **Install** — Structured cabling and camera commissioning with zero downtime.
4. **Monitor** — 24/7 NOC monitoring with SIRA-compliant documentation on file.
MD,
                'seo_title'       => 'CCTV & Video Surveillance in Dubai | ZeroNix AV',
                'seo_description' => 'Enterprise CCTV and IP surveillance systems in Dubai. AI analytics, LPR, facial recognition, SIRA compliant. ZeroNix AV Solutions.',
                'keywords'        => ['CCTV installation Dubai', 'SIRA approved CCTV company', 'IP surveillance UAE', 'video analytics Dubai', 'access control integrator UAE', 'security camera supplier Dubai'],
            ],
            [
                'title'           => 'Audio & Conferencing Systems',
                'slug'            => 'audio-conferencing-systems-in-dubai',
                'summary'         => 'Engineered audio and conferencing solutions for auditoriums, houses of worship, broadcast studios, and meeting spaces in Dubai.',
                'content'         => <<<'MD'
### The Challenge

Auditoriums, worship spaces, and studios across the UAE frequently suffer from muddy speech intelligibility and feedback — the result of retrofitted consumer audio gear never designed for the room.

### The ZeroNix Solution

Our acoustic engineers design DSP-tuned distributed audio, line arrays, and wireless conferencing systems built around Shure, QSC, and Jabra — engineered for the specific volume and geometry of your space, not a generic install.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Acoustic Survey** — Room measurements and noise analysis on-site.
2. **Design** — Speaker layout and DSP tuning modeled before install.
3. **Install** — Precision calibration by CTS-certified audio engineers.
4. **Support** — Ongoing tuning and hardware warranty across the UAE.
MD,
                'seo_title'       => 'Audio & Conferencing Systems in Dubai | ZeroNix AV',
                'seo_description' => 'Pro audio and conferencing system design and installation in Dubai — auditoriums, houses of worship, offices. Shure, QSC, Jabra. ZeroNix AV.',
                'keywords'        => ['pro audio installer Dubai', 'conferencing systems UAE', 'auditorium sound system Dubai', 'DSP audio engineering UAE', 'wireless microphone supplier Dubai'],
            ],
            [
                'title'           => 'IT Infrastructure Solutions',
                'slug'            => 'it-infrastructure-solutions-in-dubai',
                'summary'         => 'Structured cabling, server room design, and network infrastructure for AV-over-IP and unified communications in Dubai.',
                'content'         => <<<'MD'
### The Challenge

AV-over-IP and unified communications systems fail when they're bolted onto office networks never designed for them — causing latency, dropped calls, and cabling that doesn't meet TIA-568 standards.

### The ZeroNix Solution

We build the network underneath the AV: BICSI-certified structured cabling, dedicated AVoIP VLANs, and server room fitouts engineered specifically for AV and UC workloads — so performance doesn't degrade under load.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — Network audit against your AV and UC bandwidth needs.
2. **Design** — Cabling, VLAN, and rack architecture mapped to TIA-568.
3. **Install** — BICSI-certified cabling teams deploy with minimal disruption.
4. **Support** — Ongoing monitoring and capacity planning as you scale.
MD,
                'seo_title'       => 'IT Infrastructure Solutions in Dubai | ZeroNix AV',
                'seo_description' => 'Structured cabling, server room design, AVoIP networking for AV systems in Dubai. BICSI certified. ZeroNix AV Solutions.',
                'keywords'        => ['structured cabling Dubai', 'AVoIP network design UAE', 'server room fitout Dubai', 'BICSI certified cabling contractor', 'data centre infrastructure UAE'],
            ],
        ];

        // ─── FAQs (per service, matches $servicesData order) ────────────────────
        $faqsData = [
            0 => [
                ['question' => 'What UC platforms do you support for meeting rooms in Dubai?', 'answer' => 'We design and certify meeting rooms for Microsoft Teams Rooms, Zoom Rooms, and Cisco Webex, so your hardware works natively with the platform your Dubai office already standardizes on — no third-party bridging required.'],
                ['question' => 'How long does a typical boardroom installation take in the UAE?', 'answer' => 'A single boardroom in Dubai is typically surveyed, installed, and commissioned within 5-10 working days, including acoustic treatment and calendar/room-scheduler integration. Multi-branch UAE rollouts are scheduled in phased batches to avoid business disruption.'],
                ['question' => 'Do you provide ongoing maintenance and support after installation?', 'answer' => 'Yes. Every deployment includes SLA-backed maintenance with 24/7 cloud remote monitoring, automated firmware patching, and a 2-hour on-site hot-swap replacement guarantee across Dubai.'],
                ['question' => 'Is the hardware compliant with UAE civil defense and SIRA regulations?', 'answer' => 'All meeting room deployments follow UAE Civil Defense guidelines, and any integrated surveillance or access components are SIRA-compliant where applicable.'],
            ],
            1 => [
                ['question' => 'What pixel pitch is recommended for indoor LED walls in Dubai retail spaces?', 'answer' => 'For close-viewing retail and lobby environments across Dubai we typically recommend P1.5-P2.5mm fine-pitch LED, while larger-format exhibition and hospitality walls can use P2.5-P4mm for a lower cost per square meter without visible pixelation.'],
                ['question' => 'Can you manage content remotely across multiple UAE locations?', 'answer' => 'Yes, every signage deployment ships with a cloud CMS (MagicInfo, SuperSign, or Broadsign depending on hardware) so your team can push content to screens across Dubai, Abu Dhabi, and Sharjah from a single dashboard.'],
                ['question' => 'Do outdoor LED displays withstand Dubai’s summer heat and humidity?', 'answer' => 'Our outdoor-rated displays carry IP56+ protection and are heat-tested for GCC climate conditions, with brightness up to 3000 nits for direct sunlight readability during peak Dubai summer months.'],
            ],
            2 => [
                ['question' => 'Are your CCTV installations SIRA approved?', 'answer' => 'Yes, ZeroNix AV designs and installs surveillance systems compliant with Dubai SIRA and UAE Civil Defense requirements, and we handle the compliance documentation as part of the project.'],
                ['question' => 'What AI analytics are available on your surveillance systems?', 'answer' => 'Our Hikvision, Axis, and Bosch deployments support facial recognition, license plate recognition (LPR), crowd detection, and perimeter intrusion alerts, all manageable from a central VMS with 24/7 monitoring from our Dubai NOC.'],
                ['question' => 'Can CCTV be integrated with access control at our UAE facility?', 'answer' => 'Yes. We commonly integrate video surveillance with access control and alarm management on one unified platform, giving your security team a single pane of glass across all UAE sites.'],
            ],
            3 => [
                ['question' => 'Do you design audio systems for houses of worship in the UAE?', 'answer' => 'Yes, our acoustic engineers have delivered distributed audio and line-array systems for mosques, churches, and multi-faith worship spaces across Dubai and the wider UAE, tuned for speech intelligibility in large volumes.'],
                ['question' => 'What wireless microphone frequencies are legal to use in the UAE?', 'answer' => 'We select and license wireless microphone frequency bands in line with UAE Telecommunications and Digital Government Regulatory Authority (TDRA) requirements, so your system operates interference-free and compliant from day one.'],
            ],
            4 => [
                ['question' => 'Do you provide BICSI-certified structured cabling in Dubai?', 'answer' => 'Yes, our cabling teams are BICSI-certified and deploy Cat6A, fiber, and AV cabling to TIA-568 standards across Dubai commercial and enterprise projects.'],
                ['question' => 'Can you retrofit AVoIP networking into an existing office network in the UAE?', 'answer' => 'Yes, we regularly design isolated or converged AVoIP VLANs on top of existing UAE office infrastructure, minimizing disruption to production networks while guaranteeing AV-grade latency and bandwidth.'],
            ],
        ];

        $services = [];
        foreach ($servicesData as $index => $serviceData) {
            $service = Service::create($serviceData);
            $services[] = $service;

            foreach ($faqsData[$index] ?? [] as $order => $faq) {
                $service->faqs()->create([
                    'question' => $faq['question'],
                    'answer' => $faq['answer'],
                    'sort_order' => $order,
                ]);
            }
        }

        // ─── Categories ───────────────────────────────────────────────────────
        $catConference  = Category::create(['name' => 'Conference Room', 'slug' => 'conference-room']);
        $catSignage     = Category::create(['name' => 'Digital Signage', 'slug' => 'digital-signage']);
        $catSurveillance = Category::create(['name' => 'Surveillance', 'slug' => 'surveillance']);
        $catAudio       = Category::create(['name' => 'Professional Audio', 'slug' => 'professional-audio']);
        $catIT          = Category::create(['name' => 'IT Infrastructure', 'slug' => 'it-infrastructure']);

        // ─── Products ─────────────────────────────────────────────────────────
        // Helper: build placehold URL
        $img = fn(string $label) => 'https://placehold.co/800x600/111318/2563EB?text=' . urlencode($label);

        // ── Service 0: Conference Room Solutions ──────────────────────────────
        $conferenceProducts = [
            [
                'sku'         => 'YL-MVC400',
                'title'       => 'Yealink MVC400 Microsoft Teams Room System',
                'slug'        => 'yealink-mvc400-teams-room',
                'brand'       => 'Yealink',
                'description' => 'All-in-one Microsoft Teams Room system for medium-sized conference rooms. Includes UVC40 camera, touch console, and compute unit.',
                'price'       => 12500.00,
                'stock'       => 18,
                'tech_specs'  => [
                    'resolution'    => '4K Ultra HD',
                    'connectivity'  => 'USB-C, HDMI 2.0, RJ45 Gigabit',
                    'compatibility' => 'Microsoft Teams, Zoom',
                    'fov'           => '120° wide-angle',
                    'certification' => 'Microsoft Teams Certified',
                ],
                'images'      => [$img('Yealink+MVC400'), $img('MVC400+Rear')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'YL-CP960',
                'title'       => 'Yealink CP960 Conference IP Phone',
                'slug'        => 'yealink-cp960-conference-phone',
                'brand'       => 'Yealink',
                'description' => 'Flagship conference phone with 5-inch multi-touch screen, Optima HD voice, and hybrid UC platform support.',
                'price'       => 2800.00,
                'stock'       => 35,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Wi-Fi 802.11ac, Bluetooth 4.0, USB, RJ45',
                    'compatibility' => 'SIP, Microsoft Teams, Zoom',
                    'microphone'    => '20-foot pickup range, 6-mic array',
                    'display'       => '5-inch IPS touchscreen',
                ],
                'images'      => [$img('Yealink+CP960'), $img('CP960+Top')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'LG-TRONE55',
                'title'       => 'LG 55" One:Quick Flex Smart Collaboration Display',
                'slug'        => 'lg-55-onequick-flex-display',
                'brand'       => 'LG',
                'description' => 'Modular 55-inch 4K UHD collaboration display with built-in camera, mic, and speaker — ideal for hybrid huddle rooms.',
                'price'       => 18900.00,
                'stock'       => 12,
                'tech_specs'  => [
                    'resolution'    => '3840×2160 (4K UHD)',
                    'connectivity'  => 'HDMI 2.0, USB-C 65W PD, LAN, Wi-Fi, Bluetooth',
                    'compatibility' => 'Microsoft Teams, Zoom, Google Meet',
                    'brightness'    => '400 nit',
                    'touch'         => '20-point capacitive touch',
                ],
                'images'      => [$img('LG+OneQuick+Flex'), $img('LG+55+Side')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'LOGI-RALLY-PLUS',
                'title'       => 'Logitech Rally Plus Conference Camera System',
                'slug'        => 'logitech-rally-plus-conference-camera',
                'brand'       => 'Logitech',
                'description' => 'Modular 4K PTZ conference camera with speaker system for large meeting rooms. Supports auto-framing and RightSense AI.',
                'price'       => 9750.00,
                'stock'       => 22,
                'tech_specs'  => [
                    'resolution'    => '4K Ultra HD (3840×2160)',
                    'connectivity'  => 'USB-A, USB-C, Ethernet',
                    'compatibility' => 'Microsoft Teams, Zoom, Cisco Webex',
                    'fov'           => '90° diagonal FOV, 15× zoom',
                    'ai'            => 'RightSight auto-framing, RightLight HDR',
                ],
                'images'      => [$img('Logitech+Rally+Plus'), $img('Rally+Camera')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'CRST-UC-B140',
                'title'       => 'Crestron UC-B140 Zoom Room System',
                'slug'        => 'crestron-uc-b140-zoom-room',
                'brand'       => 'Crestron',
                'description' => 'Crestron Flex medium room video conferencing system for Zoom Rooms. Complete kit with camera, codec, and touch controller.',
                'price'       => 22400.00,
                'stock'       => 8,
                'tech_specs'  => [
                    'resolution'    => '4K PTZ camera',
                    'connectivity'  => 'HDMI 2.0, USB, RJ45, Wi-Fi',
                    'compatibility' => 'Zoom Rooms certified',
                    'control'       => '7-inch touch panel included',
                    'management'    => 'XiO Cloud remote management',
                ],
                'images'      => [$img('Crestron+UCB140'), $img('Crestron+Touch')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'EXTRN-DMP128',
                'title'       => 'Extron DMP 128 Digital Matrix Processor',
                'slug'        => 'extron-dmp128-matrix-processor',
                'brand'       => 'Extron',
                'description' => '12×8 digital matrix processor with AEC, automixer, and feedback suppression — the DSP backbone for pro conference rooms.',
                'price'       => 14200.00,
                'stock'       => 15,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'USB, RS-232, Ethernet, 8×analog in, 8×analog out',
                    'compatibility' => 'AMX, Crestron, Q-SYS control',
                    'channels'      => '12 inputs × 8 outputs',
                    'processing'    => 'AEC, automixer, feedback suppression, EQ, compression',
                ],
                'images'      => [$img('Extron+DMP128'), $img('DMP128+Rear')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'SONY-SRSG80',
                'title'       => 'Sony SRS-G80 Portable Wireless Conference Speaker',
                'slug'        => 'sony-srs-g80-conference-speaker',
                'brand'       => 'Sony',
                'description' => 'Portable 360-degree wireless conference speaker with omnidirectional microphone array and up to 10-hour battery life.',
                'price'       => 3200.00,
                'stock'       => 40,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Bluetooth 5.0, USB-A, USB-C',
                    'compatibility' => 'Universal, plug-and-play',
                    'battery'       => '10 hours continuous use',
                    'microphone'    => '360° omnidirectional pickup',
                ],
                'images'      => [$img('Sony+SRS-G80'), $img('Sony+G80+Top')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'SHURE-MXA910',
                'title'       => 'Shure MXA910 Ceiling Array Microphone',
                'slug'        => 'shure-mxa910-ceiling-array',
                'brand'       => 'Shure',
                'description' => 'Networked ceiling microphone array with IntelliMix DSP for clean, AEC-processed audio in boardrooms and executive suites.',
                'price'       => 8900.00,
                'stock'       => 25,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Dante/AES67 networked audio, USB, Euroblock',
                    'compatibility' => 'IntelliMix Room, Q-SYS, Biamp, Crestron',
                    'lobes'         => '8 configurable steerable lobes',
                    'processing'    => 'IntelliMix AEC, noise reduction, automix',
                ],
                'images'      => [$img('Shure+MXA910'), $img('MXA910+Ceiling')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'YL-MVC940',
                'title'       => 'Yealink MVC940 Microsoft Teams Large Room System',
                'slug'        => 'yealink-mvc940-teams-large-room',
                'brand'       => 'Yealink',
                'description' => 'Enterprise Microsoft Teams Rooms system for large conference rooms with dual 4K cameras, compute unit, and touch panel.',
                'price'       => 28500.00,
                'stock'       => 6,
                'tech_specs'  => [
                    'resolution'    => '4K Ultra HD dual camera',
                    'connectivity'  => 'USB-C, HDMI 2.0 ×2, RJ45, Wi-Fi 6',
                    'compatibility' => 'Microsoft Teams Certified',
                    'room_size'     => 'Up to 30-person large rooms',
                    'control'       => '10-inch touch panel, CTP18',
                ],
                'images'      => [$img('Yealink+MVC940'), $img('MVC940+System')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'CRST-TSW-770',
                'title'       => 'Crestron TSW-770 7" Room Scheduling Touch Panel',
                'slug'        => 'crestron-tsw770-room-scheduling-panel',
                'brand'       => 'Crestron',
                'description' => '7-inch touch panel for room booking and AV control, integrating with Exchange, O365, and Google Calendar via Crestron Scheduling.',
                'price'       => 5800.00,
                'stock'       => 30,
                'tech_specs'  => [
                    'resolution'    => '1280×800 (HD)',
                    'connectivity'  => 'PoE+, Wi-Fi 802.11ac, Bluetooth',
                    'compatibility' => 'Microsoft Exchange, Google Calendar, Crestron Fusion',
                    'display'       => '7-inch capacitive multi-touch',
                    'mounting'      => 'Flush wall mount, VESA 75×75',
                ],
                'images'      => [$img('Crestron+TSW770'), $img('TSW770+Wall')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'EXTRN-SW4-HD',
                'title'       => 'Extron SW4 HD 4K HDMI Switcher',
                'slug'        => 'extron-sw4-hd-hdmi-switcher',
                'brand'       => 'Extron',
                'description' => 'Compact 4-input HDMI presentation switcher with 4K/60 support and auto-switching for clean laptop connectivity in meeting rooms.',
                'price'       => 2100.00,
                'stock'       => 50,
                'tech_specs'  => [
                    'resolution'    => '4K/60 (4:4:4), 1080p/60',
                    'connectivity'  => 'HDMI 2.0 ×4 in, HDMI 2.0 ×1 out, USB, RS-232',
                    'compatibility' => 'HDCP 2.2, EDID management',
                    'inputs'        => '4× HDMI',
                    'switching'     => 'Auto-switching, manual, RS-232 control',
                ],
                'images'      => [$img('Extron+SW4+HD'), $img('SW4+Ports')],
                'category'    => $catConference,
                'service'     => 0,
            ],
            [
                'sku'         => 'LOGI-TAP-IP',
                'title'       => 'Logitech Tap IP Room Controller',
                'slug'        => 'logitech-tap-ip-room-controller',
                'brand'       => 'Logitech',
                'description' => 'IP-connected 10-inch touch controller for Zoom Rooms and Microsoft Teams Rooms, with intuitive one-touch meeting start.',
                'price'       => 4500.00,
                'stock'       => 28,
                'tech_specs'  => [
                    'resolution'    => '1280×800 IPS display',
                    'connectivity'  => 'PoE+, Ethernet RJ45, USB-A',
                    'compatibility' => 'Zoom Rooms, Microsoft Teams Rooms',
                    'display'       => '10.1-inch multi-touch IPS',
                    'mounting'      => 'Table stand, wall mount included',
                ],
                'images'      => [$img('Logitech+Tap+IP'), $img('Tap+IP+Table')],
                'category'    => $catConference,
                'service'     => 0,
            ],
        ];

        // ── Service 1: Digital Signage & LED Walls ────────────────────────────
        $signageProducts = [
            [
                'sku'         => 'SAM-QH65B',
                'title'       => 'Samsung QH65B 65" 4K QLED Commercial Display',
                'slug'        => 'samsung-qh65b-65-commercial-display',
                'brand'       => 'Samsung',
                'description' => '65-inch QLED commercial-grade display with 700 nit brightness, 24/7 operation rating, and Samsung MagicInfo CMS built-in.',
                'price'       => 14500.00,
                'stock'       => 20,
                'tech_specs'  => [
                    'resolution'    => '3840×2160 (4K UHD)',
                    'connectivity'  => 'HDMI 2.0 ×2, DisplayPort, USB, LAN',
                    'compatibility' => 'Samsung MagicInfo, SSSP 6.0',
                    'brightness'    => '700 nit',
                    'operation'     => '24/7 rated, 3-year warranty',
                ],
                'images'      => [$img('Samsung+QH65B'), $img('QH65B+Wall')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-LED-IF025',
                'title'       => 'Samsung The Wall IF025R Fine Pitch LED Module',
                'slug'        => 'samsung-wall-if025r-led-module',
                'brand'       => 'Samsung',
                'description' => 'P2.5mm fine-pitch LED tile for seamless indoor video wall construction. HDR10 support and modular cabinet design.',
                'price'       => 38000.00,
                'stock'       => 10,
                'tech_specs'  => [
                    'resolution'    => 'Scalable (P2.5mm pixel pitch)',
                    'connectivity'  => 'Ethernet, HDMI in, loop-out',
                    'compatibility' => 'Samsung VXT CMS, generic AV processors',
                    'brightness'    => '1200 nit peak',
                    'hdr'           => 'HDR10 supported',
                ],
                'images'      => [$img('Samsung+LED+Wall'), $img('IF025R+Module')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'LG-SVH7F55',
                'title'       => 'LG 55" VH7F Video Wall Display (0.44mm Bezel)',
                'slug'        => 'lg-55-vh7f-video-wall',
                'brand'       => 'LG',
                'description' => 'Ultra-narrow bezel 55-inch FHD video wall display with 500 nit brightness and tile mapping, ideal for 2×2 or larger arrays.',
                'price'       => 11200.00,
                'stock'       => 16,
                'tech_specs'  => [
                    'resolution'    => '1920×1080 (Full HD)',
                    'connectivity'  => 'HDMI, DVI, DP, USB, RS-232',
                    'compatibility' => 'LG SuperSign, Scala, Broadsign',
                    'bezel'         => '0.44mm gap (VHB-to-VHB)',
                    'brightness'    => '500 nit',
                ],
                'images'      => [$img('LG+VH7F+55'), $img('VH7F+Array')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-SSSP-PM43',
                'title'       => 'Samsung PM43 43" 4K UHD Smart Signage Display',
                'slug'        => 'samsung-pm43-smart-signage',
                'brand'       => 'Samsung',
                'description' => '43-inch slim commercial display with MagicInfo Player S6, landscape/portrait support, and enterprise-grade remote management.',
                'price'       => 5900.00,
                'stock'       => 30,
                'tech_specs'  => [
                    'resolution'    => '3840×2160 (4K UHD)',
                    'connectivity'  => 'HDMI ×2, USB ×3, LAN, RS-232',
                    'compatibility' => 'MagicInfo S6, SSSP 6.0',
                    'brightness'    => '500 nit',
                    'orientation'   => 'Landscape and portrait (auto-rotate)',
                ],
                'images'      => [$img('Samsung+PM43'), $img('PM43+Portrait')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'LG-ST5200',
                'title'       => 'LG SuperSign Control Media Player ST5200',
                'slug'        => 'lg-supersign-st5200-media-player',
                'brand'       => 'LG',
                'description' => 'Embedded SuperSign media player for LG commercial displays — schedules and plays 4K content with remote monitoring capability.',
                'price'       => 1800.00,
                'stock'       => 45,
                'tech_specs'  => [
                    'resolution'    => '4K UHD playback',
                    'connectivity'  => 'Wi-Fi, LAN, HDMI, USB 3.0',
                    'compatibility' => 'LG SuperSign CMS, SNMP',
                    'storage'       => '16GB internal + microSD expandable',
                    'os'            => 'webOS 6.0',
                ],
                'images'      => [$img('LG+ST5200'), $img('ST5200+Ports')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-OH55F',
                'title'       => 'Samsung OH55F 55" Outdoor High Brightness Display',
                'slug'        => 'samsung-oh55f-outdoor-display',
                'brand'       => 'Samsung',
                'description' => '55-inch outdoor-rated digital signage display with 3000 nit brightness, IP56 protection, and direct sunlight readability.',
                'price'       => 32000.00,
                'stock'       => 8,
                'tech_specs'  => [
                    'resolution'    => '1920×1080 (Full HD)',
                    'connectivity'  => 'HDMI, USB, LAN',
                    'compatibility' => 'Samsung MagicInfo, external media players',
                    'brightness'    => '3000 nit (direct sun readable)',
                    'protection'    => 'IP56 dust and water resistant',
                ],
                'images'      => [$img('Samsung+OH55F'), $img('OH55F+Outdoor')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'LG-86TR3PJ',
                'title'       => 'LG 86" CreateBoard Interactive Display',
                'slug'        => 'lg-86-createboard-interactive',
                'brand'       => 'LG',
                'description' => '86-inch 4K interactive touchscreen with built-in CreateBoard collaboration software and wireless screen sharing.',
                'price'       => 36500.00,
                'stock'       => 5,
                'tech_specs'  => [
                    'resolution'    => '3840×2160 (4K UHD)',
                    'connectivity'  => 'HDMI ×3, USB-C, USB-A ×5, LAN, Wi-Fi, Bluetooth',
                    'compatibility' => 'Windows, macOS, Android screen share',
                    'touch'         => '40-point infrared touch',
                    'software'      => 'LG CreateBoard built-in',
                ],
                'images'      => [$img('LG+CreateBoard+86'), $img('CreateBoard+Touch')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-QMB-55',
                'title'       => 'Samsung QMB 55" Slim Direct-View LED Display',
                'slug'        => 'samsung-qmb-55-slim-led',
                'brand'       => 'Samsung',
                'description' => 'Ultra-slim 55-inch commercial display with HDR10+ and Samsung QMagicInfo for energy-efficient lobby and retail environments.',
                'price'       => 9800.00,
                'stock'       => 14,
                'tech_specs'  => [
                    'resolution'    => '3840×2160 (4K UHD)',
                    'connectivity'  => 'HDMI 2.0 ×2, USB ×2, LAN, RS-232',
                    'compatibility' => 'MagicInfo Player, SSSP 6.0',
                    'brightness'    => '600 nit',
                    'hdr'           => 'HDR10+',
                ],
                'images'      => [$img('Samsung+QMB55'), $img('QMB+Lobby')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'LG-40FT5J',
                'title'       => 'LG 40" FHD Flexible OLED Signage Display',
                'slug'        => 'lg-40ft5j-flexible-oled-signage',
                'brand'       => 'LG',
                'description' => 'Bendable 40-inch OLED signage display for curved retail installations, with self-luminous pixels and infinite contrast.',
                'price'       => 48000.00,
                'stock'       => 4,
                'tech_specs'  => [
                    'resolution'    => '1920×540',
                    'connectivity'  => 'HDMI, USB, LAN',
                    'compatibility' => 'LG SuperSign, external media players',
                    'panel'         => 'Flexible OLED, concave/convex bendable',
                    'contrast'      => 'Infinite contrast ratio',
                ],
                'images'      => [$img('LG+Flexible+OLED'), $img('OLED+Curved')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-KIOS-55K',
                'title'       => 'Samsung KM55F 55" Kiosk Interactive Display',
                'slug'        => 'samsung-km55f-kiosk-display',
                'brand'       => 'Samsung',
                'description' => 'Free-standing 55-inch touch kiosk with integrated media player, front-facing camera, and QR code scanning capability.',
                'price'       => 24500.00,
                'stock'       => 7,
                'tech_specs'  => [
                    'resolution'    => '1920×1080 (Full HD)',
                    'connectivity'  => 'HDMI, USB ×4, LAN, Wi-Fi',
                    'compatibility' => 'MagicInfo Kiosk, web browser, custom apps',
                    'touch'         => '10-point capacitive touch',
                    'features'      => 'QR scanner, front camera, thermal printer optional',
                ],
                'images'      => [$img('Samsung+Kiosk+55'), $img('KM55F+Front')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'LG-32SM5J',
                'title'       => 'LG 32" SM5J FHD Smart Signage Display',
                'slug'        => 'lg-32sm5j-smart-signage',
                'brand'       => 'LG',
                'description' => 'Entry-level 32-inch commercial smart signage for back office, hospitality, and small retail — 24/7 capable, webOS embedded.',
                'price'       => 2950.00,
                'stock'       => 60,
                'tech_specs'  => [
                    'resolution'    => '1920×1080 (Full HD)',
                    'connectivity'  => 'HDMI, USB, LAN, Wi-Fi',
                    'compatibility' => 'LG SuperSign EZ, webOS 4.1',
                    'brightness'    => '400 nit',
                    'operation'     => '24/7 rated',
                ],
                'images'      => [$img('LG+32SM5J'), $img('SM5J+Menu')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
            [
                'sku'         => 'SAM-BD-J1500',
                'title'       => 'Samsung SBB-B SSD Media Player Box for Tizen',
                'slug'        => 'samsung-sbb-b-media-player',
                'brand'       => 'Samsung',
                'description' => 'External Tizen-based media player box for non-smart Samsung commercial displays, enabling MagicInfo content playback.',
                'price'       => 1400.00,
                'stock'       => 55,
                'tech_specs'  => [
                    'resolution'    => '4K UHD output',
                    'connectivity'  => 'HDMI out, USB ×2, LAN, RS-232',
                    'compatibility' => 'Samsung MagicInfo S6/S7',
                    'storage'       => '64GB internal SSD',
                    'os'            => 'Tizen OS (Samsung)',
                ],
                'images'      => [$img('Samsung+SBB-B'), $img('SBB+Box')],
                'category'    => $catSignage,
                'service'     => 1,
            ],
        ];

        // ── Service 2: Video Surveillance & CCTV ─────────────────────────────
        $cctvProducts = [
            [
                'sku'         => 'HIK-DS2CD2347G2',
                'title'       => 'Hikvision DS-2CD2347G2-LU 4MP ColorVu Fixed Dome',
                'slug'        => 'hikvision-ds2cd2347g2-colorvu-dome',
                'brand'       => 'Hikvision',
                'description' => '4MP ColorVu fixed dome IP camera with full-colour night vision, deep learning analytics, and IP67/IK10 protection.',
                'price'       => 780.00,
                'stock'       => 100,
                'tech_specs'  => [
                    'resolution'    => '4MP (2688×1520)',
                    'connectivity'  => 'PoE RJ45, Hi-PoE',
                    'compatibility' => 'ONVIF Profile S/G/T, Hikvision NVR/VMS',
                    'protection'    => 'IP67, IK10',
                    'features'      => 'ColorVu full-colour night, deep learning AI',
                ],
                'images'      => [$img('Hikvision+ColorVu+Dome'), $img('DS2CD2347+Mount')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-DS2CD2T87G2',
                'title'       => 'Hikvision DS-2CD2T87G2-LU 8MP AcuSense Bullet',
                'slug'        => 'hikvision-8mp-acusense-bullet',
                'brand'       => 'Hikvision',
                'description' => '8MP AcuSense outdoor bullet camera with human/vehicle classification, strobe alarm, and 80m IR range.',
                'price'       => 1150.00,
                'stock'       => 75,
                'tech_specs'  => [
                    'resolution'    => '8MP (3840×2160 4K)',
                    'connectivity'  => 'PoE RJ45',
                    'compatibility' => 'ONVIF, Hikvision iVMS-4200, Hik-Connect',
                    'ir_range'      => '80 meters',
                    'ai'            => 'AcuSense human/vehicle classification',
                ],
                'images'      => [$img('Hikvision+8MP+Bullet'), $img('AcuSense+Bullet')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'AXIS-P3245V',
                'title'       => 'Axis P3245-V 2MP Fixed Dome Network Camera',
                'slug'        => 'axis-p3245v-fixed-dome-camera',
                'brand'       => 'Axis',
                'description' => 'Axis P3245-V 2MP dome camera with WDR, OptimizedIR, and AXIS Lightfinder 2.0 for low-light performance in demanding environments.',
                'price'       => 1850.00,
                'stock'       => 50,
                'tech_specs'  => [
                    'resolution'    => '2MP (1920×1080)',
                    'connectivity'  => 'PoE RJ45 (IEEE 802.3af)',
                    'compatibility' => 'ONVIF, AXIS Camera Station, Milestone, Genetec',
                    'wdr'           => 'Forensic WDR 120dB',
                    'light'         => 'AXIS Lightfinder 2.0, OptimizedIR',
                ],
                'images'      => [$img('Axis+P3245V'), $img('P3245+Ceiling')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-DS7732NXI',
                'title'       => 'Hikvision DS-7732NXI-I4 32-Channel AcuSense NVR',
                'slug'        => 'hikvision-32ch-acusense-nvr',
                'brand'       => 'Hikvision',
                'description' => '32-channel H.265+ AcuSense NVR supporting up to 32MP cameras, with 4-SATA bays and RAID storage support.',
                'price'       => 4800.00,
                'stock'       => 20,
                'tech_specs'  => [
                    'resolution'    => 'Up to 32MP decoding per channel',
                    'connectivity'  => 'RJ45 ×2 (1GbE), SATA ×4, USB ×4, HDMI, VGA',
                    'compatibility' => 'Hikvision IP cameras, ONVIF cameras',
                    'storage'       => '4× SATA HDD bays, up to 10TB each',
                    'ai'            => 'AcuSense deep learning, perimeter intrusion',
                ],
                'images'      => [$img('Hikvision+32CH+NVR'), $img('NVR+Rear')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'AXIS-Q6135LE',
                'title'       => 'Axis Q6135-LE 2MP PTZ Network Camera',
                'slug'        => 'axis-q6135le-ptz-camera',
                'brand'       => 'Axis',
                'description' => 'High-performance 32× optical zoom PTZ camera with AXIS OptimizedIR and IP66/NEMA 4X for demanding outdoor perimeter surveillance.',
                'price'       => 18500.00,
                'stock'       => 10,
                'tech_specs'  => [
                    'resolution'    => '2MP (1920×1080) @ 60fps',
                    'connectivity'  => 'RJ45 Hi-PoE, BNC optional',
                    'compatibility' => 'ONVIF, AXIS Camera Station, Milestone, Genetec',
                    'zoom'          => '32× optical zoom, 16× digital',
                    'protection'    => 'IP66, NEMA 4X, IK10, -40°C to +65°C',
                ],
                'images'      => [$img('Axis+Q6135+PTZ'), $img('PTZ+Outdoor')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-DS2DE4425IW',
                'title'       => 'Hikvision DS-2DE4425IWG-E 4MP PTZ Dome Camera',
                'slug'        => 'hikvision-4mp-ptz-dome-camera',
                'brand'       => 'Hikvision',
                'description' => '4MP network PTZ dome camera with 25× optical zoom, 100m IR night vision, and deep learning auto-tracking.',
                'price'       => 5200.00,
                'stock'       => 18,
                'tech_specs'  => [
                    'resolution'    => '4MP (2560×1440)',
                    'connectivity'  => 'PoE RJ45, RS-485',
                    'compatibility' => 'ONVIF, Hikvision NVR, iVMS-4200',
                    'zoom'          => '25× optical zoom',
                    'ir_range'      => '100 meters IR range',
                ],
                'images'      => [$img('Hikvision+PTZ+4MP'), $img('PTZ+Dome+Mount')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'AXIS-P8815-2',
                'title'       => 'Axis P8815-2 Under-Vehicle Surveillance Camera',
                'slug'        => 'axis-p8815-2-under-vehicle',
                'brand'       => 'Axis',
                'description' => 'Specialized under-vehicle inspection camera system for checkpoints, parking facilities, and border control in the GCC.',
                'price'       => 22000.00,
                'stock'       => 5,
                'tech_specs'  => [
                    'resolution'    => '2× 5MP sensors',
                    'connectivity'  => 'RJ45 Gigabit PoE',
                    'compatibility' => 'ONVIF, AXIS Camera Station',
                    'application'   => 'Under-vehicle inspection, checkpoint security',
                    'lighting'      => 'Built-in IR and white light LEDs',
                ],
                'images'      => [$img('Axis+Under+Vehicle'), $img('P8815+Install')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-DS2CD2T86G2',
                'title'       => 'Hikvision DS-2CD2T86G2-ISU/SL 8MP AcuSense Strobe Bullet',
                'slug'        => 'hikvision-8mp-strobe-bullet',
                'brand'       => 'Hikvision',
                'description' => '8MP AcuSense bullet camera with audio alarm and visual deterrent strobe for active intrusion response.',
                'price'       => 1380.00,
                'stock'       => 60,
                'tech_specs'  => [
                    'resolution'    => '8MP (3840×2160)',
                    'connectivity'  => 'PoE RJ45, audio in/out',
                    'compatibility' => 'ONVIF, Hikvision NVR',
                    'deterrent'     => 'Strobe light, audible alarm',
                    'ai'            => 'AcuSense human/vehicle detection',
                ],
                'images'      => [$img('Hikvision+Strobe+Bullet'), $img('AcuSense+Strobe')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'AXIS-F4105-LRE',
                'title'       => 'Axis F4105-LRE Dome Sensor for F-series',
                'slug'        => 'axis-f4105-lre-dome-sensor',
                'brand'       => 'Axis',
                'description' => 'Discreet F-series dome sensor unit for covert surveillance in offices, retail, and hospitality environments.',
                'price'       => 1200.00,
                'stock'       => 35,
                'tech_specs'  => [
                    'resolution'    => '2MP (1920×1080)',
                    'connectivity'  => 'Proprietary cable to Axis F-series main unit',
                    'compatibility' => 'Axis F-series main unit required',
                    'form_factor'   => 'Miniature dome sensor, 34mm diameter',
                    'feature'       => 'Day/night, WDR',
                ],
                'images'      => [$img('Axis+F4105'), $img('F4105+Covert')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-DS2TD2617B',
                'title'       => 'Hikvision DS-2TD2617B-6/PA Thermal & Optical Bi-Spectrum Camera',
                'slug'        => 'hikvision-thermal-optical-camera',
                'brand'       => 'Hikvision',
                'description' => 'Dual-spectrum thermal and optical camera for perimeter detection and fire prevention, with AI heat anomaly alerts.',
                'price'       => 9800.00,
                'stock'       => 12,
                'tech_specs'  => [
                    'resolution'    => 'Thermal 160×120, Optical 2MP',
                    'connectivity'  => 'PoE RJ45',
                    'compatibility' => 'ONVIF, Hikvision NVR/VMS',
                    'detection'     => 'Perimeter intrusion, fire/heat anomaly',
                    'range'         => '19mm lens, up to 100m thermal detection',
                ],
                'images'      => [$img('Hikvision+Thermal'), $img('Thermal+Optical')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'AXIS-XP40Q8X',
                'title'       => 'Axis XP40-Q8X Explosion-Protected PTZ Camera',
                'slug'        => 'axis-xp40-q8x-explosion-proof',
                'brand'       => 'Axis',
                'description' => 'ATEX/IECEx certified explosion-protected PTZ camera for oil & gas, petrochemical, and hazardous area surveillance in the GCC.',
                'price'       => 45000.00,
                'stock'       => 3,
                'tech_specs'  => [
                    'resolution'    => '2MP (1920×1080) @ 30fps',
                    'connectivity'  => 'RJ45, 12VDC/24VAC',
                    'compatibility' => 'ONVIF, AXIS Camera Station',
                    'zoom'          => '32× optical zoom',
                    'certification' => 'ATEX Zone 1/21, IECEx, IP66/68',
                ],
                'images'      => [$img('Axis+Explosion+PTZ'), $img('ATEX+Camera')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
            [
                'sku'         => 'HIK-ACS-K1T341',
                'title'       => 'Hikvision DS-K1T341AMF Face Recognition Terminal',
                'slug'        => 'hikvision-face-recognition-terminal',
                'brand'       => 'Hikvision',
                'description' => 'Standalone face recognition access control terminal with fingerprint, card, and PIN support — integrates with Hikvision ACS and CCTV.',
                'price'       => 3200.00,
                'stock'       => 25,
                'tech_specs'  => [
                    'resolution'    => '2MP face recognition camera',
                    'connectivity'  => 'PoE, RS-485, Wiegand, relay output',
                    'compatibility' => 'Hikvision iVMS-4200, HikCentral',
                    'capacity'      => '6000 faces, 10000 cards, 100000 events',
                    'modes'         => 'Face, fingerprint, card, PIN, multi-factor',
                ],
                'images'      => [$img('Hikvision+Face+Terminal'), $img('K1T341+Front')],
                'category'    => $catSurveillance,
                'service'     => 2,
            ],
        ];

        // ── Service 3: Professional Audio Systems ─────────────────────────────
        $audioProducts = [
            [
                'sku'         => 'SHURE-QLXD24',
                'title'       => 'Shure QLXD24/SM58 Digital Wireless Microphone System',
                'slug'        => 'shure-qlxd24-sm58-wireless-mic',
                'brand'       => 'Shure',
                'description' => 'Professional digital wireless handheld system with SM58 capsule, 24-bit encryption, and 300-foot range for live events and houses of worship.',
                'price'       => 4800.00,
                'stock'       => 20,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR output, BNC antenna, USB charging',
                    'compatibility' => 'Universal PA/mixer input',
                    'frequency'     => 'Band J50A (572–616 MHz)',
                    'range'         => 'Up to 91 meters line of sight',
                ],
                'images'      => [$img('Shure+QLXD24+SM58'), $img('QLXD+Receiver')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SHURE-ULXD4Q',
                'title'       => 'Shure ULXD4Q Quad-Channel Digital Wireless Receiver',
                'slug'        => 'shure-ulxd4q-quad-receiver',
                'brand'       => 'Shure',
                'description' => 'Rack-mountable quad-channel ULX-D receiver with Dante/AES67 network audio output for large venue professional productions.',
                'price'       => 14500.00,
                'stock'       => 10,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR ×4, Dante/AES67, BNC antenna ×8, USB, Ethernet',
                    'compatibility' => 'Shure Wireless Workbench, Dante network audio',
                    'channels'      => '4 simultaneous independent channels',
                    'rack'          => '1U rack mountable',
                ],
                'images'      => [$img('Shure+ULXD4Q'), $img('ULXD4Q+Rack')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SHURE-MXA920',
                'title'       => 'Shure MXA920 Ceiling Array Microphone with IntelliMix',
                'slug'        => 'shure-mxa920-ceiling-intellimix',
                'brand'       => 'Shure',
                'description' => 'Next-generation ceiling array microphone with 360° steerable coverage, built-in IntelliMix DSP, and full Dante/AES67 networked audio.',
                'price'       => 18900.00,
                'stock'       => 12,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Dante/AES67 PoE+, USB',
                    'compatibility' => 'IntelliMix Room, Q-SYS, Biamp, Teams/Zoom',
                    'coverage'      => '360° toroidal beam steering',
                    'processing'    => 'AEC, automix, noise reduction, de-reverb',
                ],
                'images'      => [$img('Shure+MXA920'), $img('MXA920+Install')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'QSC-K12-2',
                'title'       => 'QSC K12.2 2000W 12" Active PA Loudspeaker',
                'slug'        => 'qsc-k122-active-pa-speaker',
                'brand'       => 'Crestron',
                'description' => '2000W Class D powered 12-inch two-way speaker with DSP, multiple input modes, and compact lightweight design for live sound.',
                'price'       => 5200.00,
                'stock'       => 25,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR ×2, TRS, Dante optional',
                    'compatibility' => 'Universal mixer/audio interface input',
                    'power'         => '2000W Class D amplifier',
                    'freq_response' => '50Hz–20kHz (±4dB)',
                ],
                'images'      => [$img('QSC+K12.2'), $img('K12+Side')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SONY-OA-MSP1',
                'title'       => 'Sony SRS-XB43 Portable Wireless Speaker (Commercial)',
                'slug'        => 'sony-srs-xb43-commercial-speaker',
                'brand'       => 'Sony',
                'description' => 'Robust commercial-grade portable Bluetooth speaker with IP67 waterproofing and 24-hour battery for outdoor and flexible venue use.',
                'price'       => 900.00,
                'stock'       => 80,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Bluetooth 5.0, USB-C, 3.5mm aux',
                    'compatibility' => 'Universal',
                    'battery'       => '24 hours',
                    'protection'    => 'IP67 waterproof and dustproof',
                ],
                'images'      => [$img('Sony+XB43'), $img('XB43+Outdoor')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SHURE-SLX-D-B87A',
                'title'       => 'Shure SLXD14/B87A Digital Wireless Lavalier System',
                'slug'        => 'shure-slxd14-b87a-lavalier',
                'brand'       => 'Shure',
                'description' => 'Digital wireless bodypack system with B87A lavalier microphone — ideal for presenters, worship leaders, and broadcast applications.',
                'price'       => 3800.00,
                'stock'       => 30,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR output, USB-C charging',
                    'compatibility' => 'Universal PA/mixer',
                    'frequency'     => 'H55 band (514–558 MHz)',
                    'battery'       => '8 hours per charge',
                ],
                'images'      => [$img('Shure+SLXD+Lavalier'), $img('SLXD+Bodypack')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'EXTRN-XPA2004',
                'title'       => 'Extron XPA 2004 4-Channel Power Amplifier',
                'slug'        => 'extron-xpa2004-power-amplifier',
                'brand'       => 'Extron',
                'description' => '4-channel 200W power amplifier with balanced inputs, 70V/100V line outputs, and onboard DSP for distributed audio in large venues.',
                'price'       => 6800.00,
                'stock'       => 15,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Balanced XLR/TRS in, 70V/100V/8Ω out, RS-232, Ethernet',
                    'compatibility' => 'Extron control systems, third-party control',
                    'power'         => '4× 200W into 8Ω',
                    'output'        => '70V and 100V constant voltage',
                ],
                'images'      => [$img('Extron+XPA2004'), $img('XPA+Rack')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SHURE-AD4Q',
                'title'       => 'Shure AD4Q Axient Digital Quad-Channel Wireless Receiver',
                'slug'        => 'shure-ad4q-axient-receiver',
                'brand'       => 'Shure',
                'description' => 'Top-tier Axient Digital quad-channel wireless receiver with ShowLink remote control, Dante/AES67 output, and interference avoidance.',
                'price'       => 32000.00,
                'stock'       => 5,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR ×4, Dante/AES67, BNC antenna ×8, Ethernet, USB',
                    'compatibility' => 'Shure Wireless Workbench, Dante',
                    'channels'      => '4 independent channels, 24-bit encryption',
                    'features'      => 'Frequency diversity, ShowLink, interference avoidance',
                ],
                'images'      => [$img('Shure+AD4Q+Axient'), $img('Axient+Rack')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SONY-DPAS3000',
                'title'       => 'Sony SRS-XV900 Powerful Portable Bluetooth Party Speaker',
                'slug'        => 'sony-srs-xv900-party-speaker',
                'brand'       => 'Sony',
                'description' => 'High-output wireless party speaker with 25+ hours battery, IP66 rating, and built-in light show — for events and outdoor activations.',
                'price'       => 3600.00,
                'stock'       => 15,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Bluetooth 5.0, USB-C, 3.5mm aux, USB-A charge out',
                    'compatibility' => 'Universal',
                    'battery'       => '25 hours',
                    'protection'    => 'IP66 waterproof',
                ],
                'images'      => [$img('Sony+XV900'), $img('XV900+Lights')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'EXTRN-DMP64',
                'title'       => 'Extron DMP 64 Digital Matrix Processor 6×4',
                'slug'        => 'extron-dmp64-matrix-processor',
                'brand'       => 'Extron',
                'description' => 'Compact 6-input, 4-output digital matrix processor with AEC, NLP, automixer, and AES67 networked audio for medium-sized rooms.',
                'price'       => 8900.00,
                'stock'       => 20,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Analog in ×6, analog out ×4, AES3, AES67, USB, RS-232',
                    'compatibility' => 'Crestron, AMX, Q-SYS control',
                    'channels'      => '6 inputs × 4 outputs',
                    'processing'    => 'AEC, NLP automix, EQ, compression, limiter',
                ],
                'images'      => [$img('Extron+DMP64'), $img('DMP64+Rear')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'SHURE-MX-DESK',
                'title'       => 'Shure MX412 12" Gooseneck Microphone with Cardioid Capsule',
                'slug'        => 'shure-mx412-gooseneck-microphone',
                'brand'       => 'Shure',
                'description' => '12-inch desktop gooseneck condenser microphone with supercardioid capsule for conference tables, council chambers, and podiums.',
                'price'       => 1200.00,
                'stock'       => 60,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'XLR (phantom power 11–52V), snap-fit mount',
                    'compatibility' => 'Universal mixer/DSP input',
                    'polar_pattern' => 'Supercardioid',
                    'frequency'     => '50Hz–20kHz',
                ],
                'images'      => [$img('Shure+MX412'), $img('MX412+Table')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
            [
                'sku'         => 'EXTRN-PA-PA122',
                'title'       => 'Extron PA 122 2-Channel 2×120W Power Amplifier',
                'slug'        => 'extron-pa122-power-amplifier',
                'brand'       => 'Extron',
                'description' => 'Stereo 120W power amplifier with volume control, signal sensing auto-on, and rack-mount ears for AV integration installations.',
                'price'       => 3200.00,
                'stock'       => 28,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Balanced XLR in, 4–16Ω out, RS-232',
                    'compatibility' => 'Extron control, third-party AV control',
                    'power'         => '2× 120W into 8Ω',
                    'features'      => 'Signal sensing auto-on, front volume knob',
                ],
                'images'      => [$img('Extron+PA122'), $img('PA122+Rack')],
                'category'    => $catAudio,
                'service'     => 3,
            ],
        ];

        // ── Service 4: IT Infrastructure & Server Rooms ───────────────────────
        $itProducts = [
            [
                'sku'         => 'CRST-DM-NVX-360',
                'title'       => 'Crestron DM NVX 360 AV-over-IP Encoder/Decoder',
                'slug'        => 'crestron-dm-nvx-360-avoip',
                'brand'       => 'Crestron',
                'description' => '4K60 4:4:4 AV-over-IP encoder/decoder with Dante audio, USB, and RS-232 for scalable AV distribution over standard Gigabit networks.',
                'price'       => 8500.00,
                'stock'       => 22,
                'tech_specs'  => [
                    'resolution'    => '4K/60 (4:4:4)',
                    'connectivity'  => 'HDMI, USB, Dante/AES67, SFP, RJ45 ×2, RS-232',
                    'compatibility' => 'Crestron DM NVX ecosystem, AES67',
                    'network'       => '1GbE, IGMP multicast',
                    'latency'       => '<100ms glass-to-glass',
                ],
                'images'      => [$img('Crestron+NVX360'), $img('NVX360+Rack')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'EXTRN-XTP-CRSST',
                'title'       => 'Extron XTP CrossPoint 1600 Matrix Switcher',
                'slug'        => 'extron-xtp-crosspoint-1600',
                'brand'       => 'Extron',
                'description' => 'Modular 4K AV matrix switcher with XTP signal extension over Cat6A for large-scale AV distribution across campus and enterprise.',
                'price'       => 48000.00,
                'stock'       => 4,
                'tech_specs'  => [
                    'resolution'    => '4K/60 (4:4:4) HDCP 2.2',
                    'connectivity'  => 'Up to 160×160 XTP, HDMI, DTP, HDBaseT',
                    'compatibility' => 'Extron control systems, third-party control',
                    'extension'     => 'Up to 100m Cat6A / 150m fiber per port',
                    'cards'         => 'Modular I/O card architecture',
                ],
                'images'      => [$img('Extron+CrossPoint+1600'), $img('XTP+Matrix')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'LOGI-SWCH-SG550',
                'title'       => 'Cisco SG550X-48P 48-Port PoE+ Stackable Managed Switch',
                'slug'        => 'cisco-sg550x-48p-poe-switch',
                'brand'       => 'Logitech',
                'description' => '48-port PoE+ managed switch with 10GbE uplinks, 740W PoE budget — ideal for AV-over-IP, IP cameras, and VoIP deployments.',
                'price'       => 12800.00,
                'stock'       => 15,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => '48× GbE PoE+, 4× 10GbE SFP+, stacking',
                    'compatibility' => 'Cisco IOS, IGMP v3, PTP/IEEE 1588',
                    'poe_budget'    => '740W total PoE budget',
                    'management'    => 'Web GUI, CLI, SNMP, RSPAN',
                ],
                'images'      => [$img('Cisco+SG550X'), $img('SG550+Rack')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'CRST-CP4-ENS',
                'title'       => 'Crestron CP4-N Control Processor with Ethernet',
                'slug'        => 'crestron-cp4n-control-processor',
                'brand'       => 'Crestron',
                'description' => '4-series control processor for enterprise AV room automation, supporting Crestron Home/Fusion integration with 4-core processing.',
                'price'       => 6800.00,
                'stock'       => 18,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Ethernet ×2, RS-232 ×4, IR ×8, relay ×8, USB ×2',
                    'compatibility' => 'Crestron Studio, SIMPL Windows, XiO Cloud',
                    'processor'     => '4-core ARM Cortex-A9, 1GB RAM',
                    'io'            => '4× RS-232, 8× IR, 8× relay, I/O ports',
                ],
                'images'      => [$img('Crestron+CP4N'), $img('CP4N+Rack')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'EXTRN-IPCP-PRO',
                'title'       => 'Extron IPCP Pro 350 Control Processor',
                'slug'        => 'extron-ipcp-pro-350-control',
                'brand'       => 'Extron',
                'description' => 'High-performance AV control processor with dual-core CPU, 512MB RAM, and extensive I/O for large-scale enterprise AV automation.',
                'price'       => 9200.00,
                'stock'       => 10,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Ethernet ×2, RS-232 ×6, USB ×4, IR, relay, digital I/O',
                    'compatibility' => 'Extron Global Scripter, third-party API',
                    'processor'     => 'Dual-core ARM, 512MB RAM, 4GB storage',
                    'security'      => 'TLS, HTTPS, 802.1X, Active Directory',
                ],
                'images'      => [$img('Extron+IPCP+Pro'), $img('IPCP+Rear')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'HIK-SVR-7608NXI',
                'title'       => 'Hikvision DS-9616NI-M8 16-Bay NAS/NVR Server',
                'slug'        => 'hikvision-ds9616ni-nas-nvr',
                'brand'       => 'Hikvision',
                'description' => 'Enterprise-grade 16-bay NVR/NAS for large surveillance deployments, supporting up to 256 IP cameras and RAID 0/1/5/6/10.',
                'price'       => 18000.00,
                'stock'       => 6,
                'tech_specs'  => [
                    'resolution'    => 'Up to 32MP decoding, H.265+',
                    'connectivity'  => 'RJ45 ×4 (2× 10GbE, 2× GbE), HDMI ×2, VGA',
                    'compatibility' => 'Hikvision IP cameras, ONVIF',
                    'storage'       => '16× SATA HDD bays, RAID 0/1/5/6/10',
                    'cameras'       => 'Up to 256 IP cameras',
                ],
                'images'      => [$img('Hikvision+NAS+NVR'), $img('DS9616+Bays')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'LOGI-COLLAB-HUB',
                'title'       => 'Logitech Sync Device Management Hub',
                'slug'        => 'logitech-sync-device-hub',
                'brand'       => 'Logitech',
                'description' => 'Cloud-based device management solution for all Logitech room systems — monitors status, pushes updates, and generates usage analytics.',
                'price'       => 1200.00,
                'stock'       => 50,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Cloud (SaaS), USB bridge device',
                    'compatibility' => 'All Logitech VC products, Microsoft Teams, Zoom',
                    'deployment'    => 'Cloud managed, up to 10000 devices',
                    'features'      => 'Remote diagnostics, firmware updates, analytics',
                ],
                'images'      => [$img('Logitech+Sync'), $img('Sync+Dashboard')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'CRST-XIO-CLOUD',
                'title'       => 'Crestron XiO Cloud AV Fleet Management (1-Year)',
                'slug'        => 'crestron-xio-cloud-management',
                'brand'       => 'Crestron',
                'description' => '1-year XiO Cloud subscription for remote monitoring, configuration, and diagnostics of all Crestron AV devices across your GCC estate.',
                'price'       => 2800.00,
                'stock'       => 100,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Cloud SaaS via HTTPS',
                    'compatibility' => 'All Crestron DM NVX, control processors, touch panels',
                    'deployment'    => 'Multi-site, up to unlimited devices',
                    'features'      => 'Remote config, diagnostics, alerts, audit logs',
                ],
                'images'      => [$img('Crestron+XiO+Cloud'), $img('XiO+Dashboard')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'EXTRN-FOXBOX-TX',
                'title'       => 'Extron FoxBox 4K HDMI Fiber Transmitter',
                'slug'        => 'extron-foxbox-4k-fiber-tx',
                'brand'       => 'Extron',
                'description' => '4K HDMI over single-mode fiber transmitter for long-haul AV signal distribution up to 10km in large campus AV-over-fiber installations.',
                'price'       => 3800.00,
                'stock'       => 20,
                'tech_specs'  => [
                    'resolution'    => '4K/60 (4:2:0), 1080p/60 (4:4:4)',
                    'connectivity'  => 'HDMI in, LC SFP fiber out, USB, RS-232',
                    'compatibility' => 'Extron FoxBox RX receiver required',
                    'range'         => 'Up to 10km single-mode fiber',
                    'latency'       => '<1ms glass-to-glass',
                ],
                'images'      => [$img('Extron+FoxBox+TX'), $img('FoxBox+Fiber')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'AXIS-D3110',
                'title'       => 'Axis D3110 Connectivity Hub for Edge Compute',
                'slug'        => 'axis-d3110-connectivity-hub',
                'brand'       => 'Axis',
                'description' => 'Edge compute connectivity hub for AXIS ACAP applications, aggregating camera streams for AI analytics at the edge — no cloud required.',
                'price'       => 4200.00,
                'stock'       => 14,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'RJ45 ×8 (PoE), SFP, USB, RS-232',
                    'compatibility' => 'Axis cameras, AXIS ACAP applications',
                    'compute'       => 'Edge AI inference, ACAP v4 compatible',
                    'storage'       => 'SD card + NAS recording',
                ],
                'images'      => [$img('Axis+D3110'), $img('D3110+Edge')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'CRST-AMP-1250',
                'title'       => 'Crestron AMPI-6X50 6-Channel 50W Per-Channel Amplifier',
                'slug'        => 'crestron-ampi6x50-amplifier',
                'brand'       => 'Crestron',
                'description' => '6-channel integrated power amplifier for distributed audio in rack systems — Crestron control-ready with auto-sensing power management.',
                'price'       => 7200.00,
                'stock'       => 12,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Balanced XLR in ×6, 4–16Ω speaker out, Cresnet, Ethernet',
                    'compatibility' => 'Crestron control systems (native)',
                    'power'         => '6× 50W into 8Ω',
                    'features'      => 'Auto-on via signal sensing, rack 1.5U',
                ],
                'images'      => [$img('Crestron+AMPI6X50'), $img('AMPI+Rack')],
                'category'    => $catIT,
                'service'     => 4,
            ],
            [
                'sku'         => 'EXTRN-CBL-CAT6A',
                'title'       => 'Extron EHD EasyLock Cat6A UTP Cable (305m)',
                'slug'        => 'extron-easylock-cat6a-cable-305m',
                'brand'       => 'Extron',
                'description' => '305-meter spool of Extron EasyLock Cat6A UTP bulk cable rated for AV-over-IP, HDBaseT, and VoIP — TIA-568.2-D compliant.',
                'price'       => 850.00,
                'stock'       => 80,
                'tech_specs'  => [
                    'resolution'    => 'N/A',
                    'connectivity'  => 'Cat6A UTP, RJ45 crimp or keystone',
                    'compatibility' => 'HDBaseT, AVoIP, PoE++, 10GBASE-T',
                    'length'        => '305m (1000ft) spool',
                    'standard'      => 'TIA-568.2-D Cat6A compliant',
                ],
                'images'      => [$img('Extron+Cat6A+Spool'), $img('Cat6A+Cable')],
                'category'    => $catIT,
                'service'     => 4,
            ],
        ];

        // ─── Combine all product sets ──────────────────────────────────────────
        $allProductSets = [
            0 => $conferenceProducts,
            1 => $signageProducts,
            2 => $cctvProducts,
            3 => $audioProducts,
            4 => $itProducts,
        ];

        $productIdsByService = [];
        foreach ($allProductSets as $serviceIndex => $productSet) {
            foreach ($productSet as $productData) {
                $category = $productData['category'];
                $serviceIdx = $productData['service'];
                unset($productData['category'], $productData['service']);

                $product = Product::create($productData);
                $product->services()->attach($services[$serviceIdx]->id);
                // Also assign category
                $product->update(['category_id' => $category->id]);

                $productIdsByService[$serviceIdx][] = $product->id;
            }
        }

        // ─── Fill the {{PRODUCT_CAROUSEL}} slot in each service's content ────────
        // The slot marks where the "How We Work" plan wants the carousel; the snippet
        // itself is what actually renders it — see Service::extractProductIds().
        foreach ($services as $index => $service) {
            $featuredIds = array_slice($productIdsByService[$index] ?? [], 0, 3);
            $snippet = $featuredIds ? '[[products:' . implode(',', $featuredIds) . ']]' : '';

            $newContent = str_contains($service->content, '{{PRODUCT_CAROUSEL}}')
                ? str_replace('{{PRODUCT_CAROUSEL}}', $snippet, $service->content)
                : trim($service->content . "\n\n" . $snippet . "\n\n");

            $service->update(['content' => $newContent]);
        }
    }
}
