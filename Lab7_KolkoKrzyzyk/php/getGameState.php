<?php

include_once(__DIR__ . '/database.php');


$anInactiveUserDuration = 5;

// Remove users inactive longer than defined time
$anInactiveUserTime = time() - $anInactiveUserDuration;
$astrQuery = 'UPDATE Game SET UserA=NULL WHERE UserA IS NOT NULL AND LastActiveA<' . $anInactiveUserTime;
sendQuery();

$astrQuery = 'UPDATE Game SET UserB=NULL WHERE UserB IS NOT NULL AND LastActiveB<' . $anInactiveUserTime;
sendQuery();

// Exists UserA?
$astrQuery = 'SELECT COUNT(*) AS IsUser FROM Game WHERE UserA IS NOT NULL LIMIT 1';
$aResult = sendQuery();

$abIsUserA = FALSE;
$aRow = $aResult->fetch_assoc();
if (is_array($aRow)) {
    $anCountUsers = $aRow['IsUser'];
    if (0 < $anCountUsers) {
        $abIsUserA = TRUE;
    }
}

// Exists UserB?
$astrQuery = 'SELECT COUNT(*) AS IsUser FROM Game WHERE UserB IS NOT NULL LIMIT 1';
$aResult = sendQuery();

$abIsUserB = FALSE;
$aRow = $aResult->fetch_assoc();
if (is_array($aRow)) {
    $anCountUsers = $aRow['IsUser'];
    if (0 < $anCountUsers) {
        $abIsUserB = TRUE;
    }
}

$abWeAreUserA = FALSE;
if ($abIsUserA) {
    // If we are UserA
    $astrQuery = 'SELECT COUNT(*) AS CountUsers FROM Game WHERE UserA="' . $g_SessionSID . '" LIMIT 1';
    $aResult = sendQuery();

    $aRow = $aResult->fetch_assoc();
    if (is_array($aRow)) {
        $anCountUsers = $aRow['CountUsers'];
        if (0 < $anCountUsers) {
            $abWeAreUserA = TRUE;

            // Update our last connection time
            $astrQuery = 'UPDATE Game SET LastActiveA="' . time() . '"';
            sendQuery();  
        }
    }
}

$abWeAreUserB = FALSE;
if ((!$abWeAreUserA) && ($abIsUserB)) {
    // We are not UserA
    // If we are UserB
    $astrQuery = 'SELECT COUNT(*) AS CountUsers FROM Game WHERE UserB="' . $g_SessionSID . '" LIMIT 1';
    $aResult = sendQuery();

    $aRow = $aResult->fetch_assoc();
    if (is_array($aRow)) {
        $anCountUsers = $aRow['CountUsers'];
        if (0 < $anCountUsers) {
            $abWeAreUserB = TRUE;

            // Update our last connection time
            $astrQuery = 'UPDATE Game SET LastActiveB="' . time() . '"';
            sendQuery();   
        }  
    }
}

$abResetBoard = FALSE;

if ((!$abWeAreUserA) && (!$abWeAreUserB)) {
    // We are not UserA and UserB
    if (!$abIsUserA) { // UserA is NULL, we become UserA
        $astrQuery = 'UPDATE Game SET UserA="' . $g_SessionSID . '", LastActiveA="' . time() . '"';
        sendQuery();
        $abIsUserA = TRUE;
        $abWeAreUserA = TRUE;
        $abResetBoard = TRUE;
    } else if (!$abIsUserB) { // UserB is NULL, we become UserB
        $astrQuery = 'UPDATE Game SET UserB="' . $g_SessionSID . '", LastActiveB="' . time() . '"';
        sendQuery();
        $abIsUserB = TRUE;
        $abWeAreUserB = TRUE;
        $abResetBoard = TRUE;
    } else {
        // No place to join
    }
}

if ($abResetBoard) {
    // To obtain a random integer R in the range i <= R < j, use the expression FLOOR(i + RAND() * (j - i))
    $astrQuery = 'UPDATE Game SET Board="0,0,0,0,0,0,0,0,0", RoundUser=FLOOR(0 + RAND()*2 )';
    sendQuery();
}

$astrBoard = '';
$anRoundUser = FALSE;
$abWinnerUserA = FALSE;
$abWinnerUserB = FALSE;

if ($abIsUserA && $abIsUserB && ($abWeAreUserA || $abWeAreUserB)) {
    
    $astrQuery = 'SELECT * FROM Game LIMIT 1';
    $aResult = sendQuery();
    $aRow = $aResult->fetch_assoc();
    if (is_array($aRow)) {
        $astrBoard = $aRow['Board'];
        $anRoundUser = $aRow['RoundUser'];

        $avBoard = explode(",", $astrBoard);
        if (9 == count($avBoard)) {

            // Is it our turn and a user selected a cell?
            if (isset($_REQUEST['CellIndex_Click'])) {
                $anCellIndex_Click = (int) $_REQUEST['CellIndex_Click'];
                if ((0 > $anCellIndex_Click) || (8 < $anCellIndex_Click)) {
                    echo 'Invalid $anCellIndex_Click=' . $anCellIndex_Click;
                    exit;
                }

                $abChangeTurn = FALSE;

                if ((0 == $anRoundUser) && ($abWeAreUserA)) {
                    if ('0' == $avBoard[$anCellIndex_Click]) { // Is free?
                        $avBoard[$anCellIndex_Click] = '1';
                        $abChangeTurn = TRUE;
                    }
                } else if ((1 == $anRoundUser) && ($abWeAreUserB)) {
                    if ('0' == $avBoard[$anCellIndex_Click]) { // Is free?
                        $avBoard[$anCellIndex_Click] = '2';
                        $abChangeTurn = TRUE;
                    }
                }

                if ($abChangeTurn) {
                    $astrBoard = implode(",", $avBoard);
                    $anRoundUser = (0 == $anRoundUser) ? 1 : 0;
                    $astrQuery = 'UPDATE Game SET Board="' . $astrBoard . '", RoundUser=' . $anRoundUser;
                    sendQuery();
                }
            }

            // Check if anyone won
            $avvCheck = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [6, 4, 2]
            ];
            foreach ($avvCheck as $avCheck) {
                if (('1' == $avBoard[$avCheck[0]]) && ('1' == $avBoard[$avCheck[1]]) && ('1' == $avBoard[$avCheck[2]])) {
                    $abWinnerUserA = TRUE;
                } else if (('2' == $avBoard[$avCheck[0]]) && ('2' == $avBoard[$avCheck[1]]) && ('2' == $avBoard[$avCheck[2]])) {
                    $abWinnerUserB = TRUE;
                }
            }
        }
    }
}

include_once(__DIR__ . '/database_close.php');

$anNumUsers = ($abIsUserA ? 1 : 0) + ($abIsUserB ? 1 : 0);

$aResponse = [];
$aResponse["NumUsers"] = $anNumUsers;
$aResponse["User"] = ($abWeAreUserA ? 'UserA' : ($abWeAreUserB ? 'UserB' : 'Full'));
$aResponse["Board"] = $astrBoard;
$aResponse["RoundUser"] = $anRoundUser;
$aResponse["Winner"] = ($abWinnerUserA ? 'UserA' : ($abWinnerUserB ? 'UserB' : ''));

echo json_encode($aResponse);
