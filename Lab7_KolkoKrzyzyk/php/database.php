<?php

if (!session_id()) {
    session_start();
}
$g_SessionSID = session_id();

$myMysqli = new \mysqli('localhost', 'root', '', 'kolkoikrzyzyk', 3306);
if ($myMysqli->connect_errno) {
    echo 'Failed to connect to MySQL: (' . $myMysqli->connect_errno . ') ' . $myMysqli->connect_error;
    exit;
}

function sendQuery()
{
    global $myMysqli, $astrQuery;
    $aResult = $myMysqli->query($astrQuery);
    if (!$aResult) {
        echo 'Query failed: (' . $myMysqli->errno . ') ' . $myMysqli->error;
        exit;
    }
    return $aResult;
}