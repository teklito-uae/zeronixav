<?php

/*
|--------------------------------------------------------------------------
| GCC Country / Currency Registry
|--------------------------------------------------------------------------
|
| Fixed shortlist matching ZeroNix AV's actual GCC market. GCC currencies
| are USD-pegged, so a static rate-to-AED is accurate without a live FX
| service. This is the source of truth for validating a banner's
| country_code server-side; the frontend mirrors it in src/lib/countries.ts.
|
*/

return [
    'default' => 'ae',

    'list' => [
        'ae' => ['name' => 'United Arab Emirates', 'flag' => '🇦🇪', 'currency_code' => 'AED', 'currency_symbol' => 'AED', 'rate_to_aed' => 1.0],
        'sa' => ['name' => 'Saudi Arabia',          'flag' => '🇸🇦', 'currency_code' => 'SAR', 'currency_symbol' => 'SAR', 'rate_to_aed' => 1.02],
        'qa' => ['name' => 'Qatar',                 'flag' => '🇶🇦', 'currency_code' => 'QAR', 'currency_symbol' => 'QAR', 'rate_to_aed' => 0.99],
        'bh' => ['name' => 'Bahrain',                'flag' => '🇧🇭', 'currency_code' => 'BHD', 'currency_symbol' => 'BHD', 'rate_to_aed' => 0.102],
        'kw' => ['name' => 'Kuwait',                 'flag' => '🇰🇼', 'currency_code' => 'KWD', 'currency_symbol' => 'KWD', 'rate_to_aed' => 0.083],
        'om' => ['name' => 'Oman',                   'flag' => '🇴🇲', 'currency_code' => 'OMR', 'currency_symbol' => 'OMR', 'rate_to_aed' => 0.105],
    ],
];
