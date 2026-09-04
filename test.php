<?php
use Illuminate\Support\Facades\Http;
$res = Http::get('https://klikqris.com/api/snap/check-transaction?signature=SANDBOX_SIG_Dd3lKcQsXp16uXCVJpi31788452044');
echo $res->body();
