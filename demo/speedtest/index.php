<?php
date_default_timezone_set('Asia/Shanghai');
//ini_set('date.timezone','Asia/Shanghai');

$seconds_to_cache = 3600;
$ts = date("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
header("Expires: $ts"); header("Pragma: cache");
header("Cache-Control: max-age=$seconds_to_cache");
echo $ts;