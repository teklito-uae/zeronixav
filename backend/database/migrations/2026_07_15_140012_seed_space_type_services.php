<?php
use App\Models\Service;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Seeds the four "space type" services powering the homepage room-type grid.
     * Runs on every deploy via `php artisan migrate --force`, unlike DemoSeeder
     * (which only seeds once, guarded by product count) — so this uses
     * updateOrCreate to stay safe to re-run.
     */
    public function up(): void
    {
        $productId = fn (string $slug) => DB::table('products')->where('slug', $slug)->value('id');

        $spaceTypes = [
            [
                'title'   => 'Conference Rooms',
                'slug'    => 'conference-room-av-solutions-dubai',
                'summary' => 'Ensure everyone can be seen and heard clearly with solutions for traditional conference rooms — a front-of-room camera, touch controller, and add-ons to extend meeting capture deeper in the room.',
                'products' => array_filter([
                    $productId('yealink-mvc940-teams-large-room'),
                    $productId('crestron-tsw770-room-scheduling-panel'),
                    $productId('shure-mxa910-ceiling-array'),
                ]),
                'content' => <<<'MD'
### The Challenge

Traditional Dubai boardrooms often force remote participants to strain at a single wide-angle camera while a lone table microphone catches only half the room.

### The ZeroNix Solution

We standardize every conference room on a front-of-room PTZ camera, a dedicated touch controller, and ceiling or table microphone arrays sized to the room — so remote and in-room participants are captured with equal clarity, from a 10-seat room to a 30-seat boardroom.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — On-site acoustic and sightline survey of your Dubai boardroom.
2. **Design** — Camera and microphone placement sized to room geometry.
3. **Install** — Certified engineers commission the room in days, not weeks.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
MD,
                'seo_title'       => 'Conference Room AV Solutions in Dubai | ZeroNix AV',
                'seo_description' => 'Boardroom AV integration in Dubai — PTZ cameras, ceiling microphone arrays, and one-touch join for Microsoft Teams Rooms and Zoom Rooms.',
                'keywords'        => ['conference room AV Dubai', 'boardroom camera and microphone UAE', 'Teams Rooms conference room Dubai', 'ceiling microphone array Dubai'],
                'faqs' => [
                    ['question' => 'What size conference rooms do you design for in Dubai?', 'answer' => 'We standardize conference room AV from 8-seat rooms up to 30-seat executive boardrooms, all on the same certified Yealink, Crestron, and Shure hardware stack so your IT team supports one system, not many.'],
                    ['question' => 'Can remote participants see everyone in the room clearly?', 'answer' => 'Yes — our front-of-room PTZ cameras and ceiling microphone arrays are placed to capture every seat, so remote attendees see and hear the whole room, not just whoever is closest to the table mic.'],
                ],
            ],
            [
                'title'   => 'Huddle Space',
                'slug'    => 'huddle-space-av-solutions-dubai',
                'summary' => 'Easily deploy video meetings in smaller spaces for quick collaboration and ad-hoc meetings with solutions that are simple to set up and deploy at scale.',
                'products' => array_filter([
                    $productId('yealink-mvc400-teams-room'),
                    $productId('logitech-tap-ip-room-controller'),
                    $productId('logitech-rally-plus-conference-camera'),
                ]),
                'content' => <<<'MD'
### The Challenge

Small 2-6 person spaces across Dubai offices are usually left without dedicated AV, so quick ad-hoc calls end up crowded around a single laptop camera.

### The ZeroNix Solution

We deploy compact all-in-one video bars and single-cable tap controllers built for one-touch join — fast to install across dozens of small rooms and simple enough that no training is required.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — Quick site walk to size each huddle room.
2. **Design** — A single standardized huddle-room kit for the whole floor.
3. **Install** — Same-day install per room, minimal disruption.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
MD,
                'seo_title'       => 'Huddle Space AV Solutions in Dubai | ZeroNix AV',
                'seo_description' => 'Fast-to-deploy huddle room video conferencing in Dubai — compact all-in-one video bars and one-touch join for small meeting spaces.',
                'keywords'        => ['huddle room AV Dubai', 'small meeting room video conferencing UAE', 'video bar installation Dubai', 'one touch join huddle space'],
                'faqs' => [
                    ['question' => 'How fast can you deploy AV across many small huddle rooms?', 'answer' => 'Because every huddle space runs the same standardized video bar and controller kit, we typically commission each room in under a day, letting us roll out across an entire floor or building within a week.'],
                    ['question' => 'Do huddle rooms need the same setup as a full boardroom?', 'answer' => 'No — huddle spaces use compact all-in-one video bars instead of separate cameras, microphones, and processors, keeping cost and installation time down while still delivering one-touch Teams or Zoom join.'],
                ],
            ],
            [
                'title'   => 'Ideation Space',
                'slug'    => 'ideation-space-av-solutions-dubai',
                'summary' => 'Facilitate brainstorming and creative ideation across distributed teams with intuitive and interactive solutions built for open and dynamic spaces.',
                'products' => array_filter([
                    $productId('lg-86-createboard-interactive'),
                    $productId('lg-55-onequick-flex-display'),
                    $productId('extron-sw4-hd-hdmi-switcher'),
                ]),
                'content' => <<<'MD'
### The Challenge

Open collaboration areas in Dubai offices are usually fitted with a plain display, which does little to support real-time sketching or shared brainstorming with remote teams.

### The ZeroNix Solution

We fit ideation spaces with interactive touch displays and wireless presentation switching, so distributed teams can sketch, annotate, and share content together in real time — no dedicated laptop or cabling required.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — Understand how your team actually works in the space.
2. **Design** — Interactive display and wireless-share layout for open areas.
3. **Install** — Wall or mobile-cart mounting with clean cable management.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
MD,
                'seo_title'       => 'Ideation Space AV Solutions in Dubai | ZeroNix AV',
                'seo_description' => 'Interactive displays and wireless presentation for brainstorming and ideation spaces in Dubai offices. ZeroNix AV Solutions.',
                'keywords'        => ['interactive display Dubai office', 'ideation space AV UAE', 'wireless presentation collaboration Dubai', 'brainstorming room display'],
                'faqs' => [
                    ['question' => 'Can remote team members contribute to a brainstorm in real time?', 'answer' => 'Yes — the interactive touch displays we install support real-time annotation shared with remote participants over Teams or Zoom, so distributed teams can sketch and edit together, not just watch.'],
                    ['question' => 'Do ideation spaces need permanent wall mounting?', 'answer' => 'Not necessarily — we offer both wall-mounted and mobile-cart configurations, so the same interactive display can move between open collaboration areas as your Dubai office layout changes.'],
                ],
            ],
            [
                'title'   => 'Immersive Video Rooms',
                'slug'    => 'immersive-video-rooms-av-solutions-dubai',
                'summary' => 'In rooms designed for video conferencing, furniture design and camera placement allow in-room participants to be better seen and captured.',
                'products' => array_filter([
                    $productId('samsung-wall-if025r-led-module'),
                    $productId('crestron-uc-b140-zoom-room'),
                    $productId('extron-dmp128-matrix-processor'),
                ]),
                'content' => <<<'MD'
### The Challenge

Flagship video-conferencing rooms in Dubai often bolt AV onto existing furniture, leaving awkward sightlines that undercut an otherwise large investment in displays and cameras.

### The ZeroNix Solution

We co-design furniture layout, seating, and display placement with the camera system from the start — so every in-room participant is framed correctly and the large-format display reads clearly on both ends of the call.

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — Room geometry, furniture, and lighting review on-site.
2. **Design** — Furniture and camera placement engineered together, not separately.
3. **Install** — Structural mounting, calibration, and AV-over-IP routing.
4. **Support** — 24/7 remote monitoring with a 2-hour on-site SLA across the UAE.
MD,
                'seo_title'       => 'Immersive Video Conferencing Rooms in Dubai | ZeroNix AV',
                'seo_description' => 'Purpose-built immersive video conferencing rooms in Dubai — furniture, display, and camera placement engineered together. ZeroNix AV Solutions.',
                'keywords'        => ['immersive video room Dubai', 'flagship video conferencing room UAE', 'video wall meeting room Dubai', 'executive video room design'],
                'faqs' => [
                    ['question' => 'Why does furniture placement matter for a video conferencing room?', 'answer' => 'Camera framing depends on where people sit — if furniture is placed without the camera system in mind, participants end up off-center or partially out of frame. We design both together so every seat reads correctly on camera.'],
                    ['question' => 'What size displays do you use for immersive video rooms in Dubai?', 'answer' => 'We typically deploy large-format LED walls or 85-inch-plus commercial displays for flagship immersive rooms, sized to the room depth so remote participants appear life-size rather than shrunk into a small panel.'],
                ],
            ],
        ];

        foreach ($spaceTypes as $order => $data) {
            $productIds = $data['products'];
            $snippet = $productIds ? '[[products:' . implode(',', $productIds) . ']]' : '';
            $content = str_replace('{{PRODUCT_CAROUSEL}}', $snippet, $data['content']);

            $service = Service::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title'           => $data['title'],
                    'type'            => 'space_type',
                    'summary'         => $data['summary'],
                    'content'         => $content,
                    'seo_title'       => $data['seo_title'],
                    'seo_description' => $data['seo_description'],
                    'keywords'        => $data['keywords'],
                ]
            );

            foreach ($data['faqs'] as $faqOrder => $faq) {
                $service->faqs()->updateOrCreate(
                    ['question' => $faq['question']],
                    ['answer' => $faq['answer'], 'sort_order' => $faqOrder]
                );
            }
        }
    }

    public function down(): void
    {
        Service::where('type', 'space_type')->get()->each(function (Service $service) {
            $service->faqs()->delete();
            $service->delete();
        });
    }
};
