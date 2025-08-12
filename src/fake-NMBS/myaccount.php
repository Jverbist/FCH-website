<?php
session_start();
mysqli_report(MYSQLI_REPORT_OFF);

$firstName = '';
$lastName = '';

$host = 'mysql';
$dbUser = 'admin';
$dbPass = 'admin';
$dbName = 'mydb';
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) { /* don't exit; let the page render */
    $sqlError = "Connection failed: " . $conn->connect_error;
}

$payload = $_SESSION['userName'] ?? '';
$sql = "SELECT * FROM users WHERE email = '$payload' -- '";

$rows = [];
if (isset($conn) && $result = $conn->query($sql)) {
    if ($result->num_rows) {
        // use first row to show avatar/name if you want
        $firstRow = $result->fetch_assoc();
        $firstName = $firstRow['first_name'] ?? $firstName;
        $lastName = $firstRow['last_name'] ?? $lastName;

        // keep the first row and the rest for the table
        $rows[] = $firstRow;
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
} else {
    if (isset($conn)) {
        $sqlError = $conn->error;
    }
}
if (isset($conn)) {
    $conn->close();
}
?>
<?php
session_start();
mysqli_report(MYSQLI_REPORT_OFF);

$firstName = '';
$lastName = '';

$host = 'mysql';
$dbUser = 'admin';
$dbPass = 'admin';
$dbName = 'mydb';
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) { /* don't exit; let the page render */
    $sqlError = "Connection failed: " . $conn->connect_error;
}

$payload = $_SESSION['userName'] ?? '';
$sql = "SELECT * FROM users WHERE email = '$payload' -- '";

$rows = [];
if (isset($conn) && $result = $conn->query($sql)) {
    if ($result->num_rows) {
        // use first row to show avatar/name if you want
        $firstRow = $result->fetch_assoc();
        $firstName = $firstRow['first_name'] ?? $firstName;
        $lastName = $firstRow['last_name'] ?? $lastName;

        // keep the first row and the rest for the table
        $rows[] = $firstRow;
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
} else {
    if (isset($conn)) {
        $sqlError = $conn->error;
    }
}
if (isset($conn)) {
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="utf-8" />
    <title>My NMBS: Je klantenprofiel | NMBS</title>

    <!-- NMBS stylesheet (keep using yours if you already include it) -->
    <link rel="stylesheet" href="https://www.belgiantrain.be/content/public/css/main.css" />

    <style>
        .sqli-m {
            max-width: 1100px;
            margin: 24px auto
        }

        @media (min-width:992px) {
            .sqli-m {
                margin-left: 320px;
                margin-right: 32px;
            }
        }

        /* clear purple sidebar */
        .sqli-tablewrap {
            overflow: auto;
            max-height: 60vh
        }

        .sqli-table {
            width: 100%;
            border-collapse: collapse
        }

        .sqli-table th,
        .sqli-table td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
            vertical-align: top
        }

        .sqli-table th {
            background: #fafafa
        }

        .sqlerr {
            background: #fff7f7;
            border: 1px solid #ffd6d6;
            padding: 8px;
            color: #a00
        }
    </style>
</head>

<body>

    <body class="">
        <input id="facebookShareUrl" name="FacebookShareUrl" type="hidden"
            value="https://www.facebook.com/dialog/share" />
        <input id="facebookShareAppId" name="FacebookShareAppId" type="hidden" value="3526921284007626" />
        <input id="twitterShareUrl" name="TwitterShareUrl" type="hidden" value="https://twitter.com/intent/tweet" />
        <header id="top-navigation-bar" class="navigation-bar" style="">
            <div class="navigation-bar__sidebar bg-purple">
                <a href="https://www.nmbs.exn.be/NMBS/www.belgiantrain.be/nl.html" class="navigation-bar__logo">
                    <svg class="icon" data-id="{E42B7874-C7FD-48A9-85B5-301F11A48923}" focusable="false" role="img">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-nmbs-logo" />
                    </svg>
                    <span class="sr-only">Home NMBS</span>
                </a>
            <div class="navigation-bar__main">
                <div class="navigation-bar__left">

                    <ul class="navigation-bar__items">
                        <li class="navigation-bar__item ">
                            <a class="navigation-bar__item-link " href="/nl/search">ticket kopen</a>
                        </li>
                        <li class="navigation-bar__item ">
                            <a class="navigation-bar__item-link " href="/nl/support/customer-service">klantendienst</a>
                        </li>
                        <li class="navigation-bar__item ">
                            <a class="navigation-bar__item-link "
                                href="/nl/mobility-for-business/for-employers">business</a>
                        </li>
                        <li class="navigation-bar__item ">
                            <a href="https://jobs.belgiantrain.be/?locale=nl_NL" rel="noopener noreferrer"
                                class="navigation-bar__item-link " target="_blank">jobs</a>
                        </li>
                    </ul>
                </div>
                <div class="navigation-bar__right">
                    <ul class="navigation-bar__items">
                        <li class="navigation-bar__item LoginStatus">
                            <a class="button navigation-bar__btn account account--loggedin" title="My&#32;NMBS"
                                href="../fake-NMBS/myaccount.php">
                                <div class="account__name theme-purple">
                                    <?php echo strtoupper($firstName[0]); ?>
                                </div>
                                <div class="account__label">
                                    My NMBS
                                </div>
                            </a>
                        </li>
                        <li class="navigation-bar__item InbentaSearchNavigationButton">
                            <div class="navigation-bar__btn navigation-bar__search">
                                <a href="/nl/support/search-website" title="Zoek op de website"
                                    class="color-shade-dark">
                                    <svg class="icon" data-id="{7638E5EA-45EF-422B-ABDB-89D5119A191B}" focusable="false"
                                        role="img">
                                        <title>Zoek op de website</title>
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-search" />
                                    </svg>
                                    <span class="sr-only">Zoek op de website</span>
                                </a>
                            </div>
                        </li>
                        <li class="navigation-bar__item BasketButton">
                            <a class="navigation-bar__btn basket-btn" href="/nl/search" title="Winkelmandje">
                                <svg class="icon" data-id="{E0EDF48D-D199-478A-8F3D-2B57DE5B4BA1}" focusable="false"
                                    role="img">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-basket" />
                                </svg>
                                <span class="sr-only">Winkelmandje</span>
                                <div class="basket-status">
                                </div>
                            </a>
                        </li>
                        <li class="navigation-bar__item LanguageSwitchDropDown">
                            <div class="navigation-bar__item-langswitch">
                                <div class="js-dropdown dropdown dropdown--outline" data-autoclose="true">
                                    <a href="#" class="link link--iconright dropdown__trigger" aria-expanded="false">
                                        <svg class="icon icon--12 icon--dropdown"
                                            data-id="{2C0D660B-B0ED-405A-A664-82F692588137}" focusable="false"
                                            role="img">
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                xlink:href="#icon-arrow-down" />
                                        </svg>
                                        nl </a>
                                    <ul class="dropdown__list">
                                        <li class="dropdown__item">
                                            <a href="/fr/my-account">fr</a>
                                        </li>
                                        <li class="dropdown__item">
                                            <a href="/en/my-account">en</a>
                                        </li>
                                        <li class="dropdown__item">
                                            <a href="/de/my-account">de</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li class="navigation-bar__item MainMenuButton">
                            <button class="navigation-bar__btn menu js-open-navigation" title="Open het menu">
                                <div class="menu__label">Menu</div>
                                <svg class="icon menu__icon" data-id="{71012470-03F3-4B9E-9618-BFB1E91C4175}"
                                    focusable="false" role="img">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-menu" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <header class="navigation-bar">
            <div class="navigation-bar__main">
                <ul class="navigation-bar__items">
                    <li class="navigation-bar__item">
                        <a class="button navigation-bar__btn account account--loggedin" href="myaccount.php">
                            <div class="account__name theme-purple">
                                <?php $initial = $firstName !== '' ? strtoupper(substr($firstName, 0, 1)) : '?';
                                echo $initial; ?>
                            </div>
                            <div class="account__label">My NMBS</div>
                        </a>
                    </li>
                </ul>
            </div>
        </header>

        <!-- Welcome banner -->
        <div class="container" style="margin-top:16px">
            <h1>Welkom <?php echo htmlspecialchars(trim("$firstName $lastName")); ?>!</h1>
        </div>

        </div>
        <div class="nav-sidebar__container nav-sidebar--navigation " style="">
            <div class="nav-sidebar__header">
                <div class="nav-sidebar__logo nav-sidebar--show-close">
                    <a href="https://www.nmbs.exn.be/NMBS/www.belgiantrain.be/nl.html" class="navigation-bar__logo">
                        <svg class="icon" data-id="{E42B7874-C7FD-48A9-85B5-301F11A48923}" focusable="false" role="img">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-nmbs-logo" />
                        </svg>
                        <span class="sr-only">Home NMBS</span>
                    </a>
                    <a href="#" class="nav-sidebar__btn-close link link--iconright">
                        <svg class="icon  icon--12" data-id="{5FD39E00-7D22-44B2-8210-5CFDACCFA9E9}" focusable="false"
                            role="img">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close" />
                        </svg>
                        Sluiten
                    </a>
                    <a href="#" class="nav-sidebar__btn-back link">
                        <svg class="icon  icon--12" data-id="{52732675-6DB6-43F4-9B1D-7076D1FB19D2}" focusable="false"
                            role="img">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-left" />
                        </svg>
                        Terug
                    </a>
                </div>
                <div class="nav-sidebar__cta only--small theme-blue">
                    <div class="inbenta-nmbs">
                        <!-- PE html -->
                        <!-- Element where the SDK and KM will be displayed -->
                        <div id="inbenta">
                            <div id="search-boxsh"></div>
                            <div id="autocompletersh"></div>
                            <div id="resultssh"></div>
                        </div>
                        <input type="hidden" class="hdn_inbenta_css_popular" />
                    </div>


                    <a class="link  " href="/nl/search"><svg class="icon icon--12"
                            data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false" role="img">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right" />
                        </svg> <span>koop ticket</span>
                    </a><a class="link  " href="https://m.me/NMBS"><svg class="icon icon--12"
                            data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false" role="img">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right" />
                        </svg> <span>hulp nodig?</span>
                    </a>
                </div>
            </div>
            <aside class="nav-sidebar">
                <div class="nav-sidebar__block">
                    <div class="nav-sidebar__content">
                        <ul class="navigation__list">
                            <li class="active">
                                <a href="#" data-id="Reisinfo">Reisinfo</a>
                            </li>
                            <li>
                                <a href="#" data-id="Tickets &amp; abonnementen">Tickets &amp; abonnementen</a>
                            </li>
                            <li>
                                <a href="#" data-id="Stationsinformatie">Stationsinformatie</a>
                            </li>
                            <li>
                                <a href="#" data-id="Reisideeën">Reisideeën</a>
                            </li>
                            <li>
                                <a href="#" data-id="Voor werkgevers en werknemers">Voor werkgevers en werknemers</a>
                            </li>
                            <li>
                                <a href="#" data-id="Internationale reizen">Internationale reizen</a>
                            </li>
                            <li>
                                <a href="#" data-id="Klantendienst">Klantendienst</a>
                            </li>
                            <li>
                                <a href="#" data-id="Diensten voor derden en RRS">Diensten voor derden en RRS</a>
                            </li>
                            <li>
                                <a href="#" data-id="Jobs">Jobs</a>
                            </li>
                            <li>
                                <a href="#" data-id="Over NMBS">Over NMBS</a>
                            </li>
                        </ul>
                    </div>

                    <div class="nav-sidebar__footer">
                        <div class="nav-sidebar__baseline nav-sidebar__baseline--white"></div>
                    </div>
                </div>
            </aside>

            <section
                class="nav-sidebar-panel  nav-sidebar-panel--navigation  js-panel  nav-sidebar-panel--large  nav-sidebar-panel--fixed-open ">
                <a href="javascript:void(0);"
                    class="link  link--iconright  nav-sidebar-panel__close  sidebar__btn-close">
                    <svg class="icon icon--12" data-id="{5FD39E00-7D22-44B2-8210-5CFDACCFA9E9}" focusable="false"
                        role="img">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close" />
                    </svg>
                    Sluiten
                </a>
                <div class="nav-sidebar-panel__content js-panel-content">
                    <div class="inbenta-nmbs">

                        <!-- PE html -->
                        <!-- Element where the SDK and KM will be displayed -->
                        <div id="inbenta">
                            <div id="search-boxsh"></div>
                            <div id="autocompletersh"></div>
                            <div id="resultssh"></div>

                        </div>
                        <input type="hidden" class="hdn_inbenta_css_popular" />
                    </div>
                    <div class="navigation__panel-item active" data-id="Reisinfo" style=opacity:1>
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Reisinfo </h4>
                            </div>
                        </div>
                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Actueel</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/current/ongoing-disturbances-and-works"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>storingen en werken</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/current/current-departure-times" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>realtime dienstregeling</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="https://www.belgiantrain.be/nl/support/customer-service/delay-certificate"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{9AD7865D-2AAF-48BC-92CF-F5C2F69DADC9}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-external" />
                                                </svg>vertragingsattest</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Diensten in de trein</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/bike-ticket" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>met de fiets op de trein</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/services-in-the-train/first-or-second-class"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>reizen in 1e of 2e klas</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/services-in-the-train/luggage-and-pets"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>reizen met bagage en huisdieren</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Je reis voorbereiden</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/prepare-for-your-journey/assistance-reduced-mobility"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>reizigers met beperkte mobiliteit</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/prepare-for-your-journey/leaflets"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>brochures dienstregeling en netkaart</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/train-offer/welcome-in-belgium-train"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>hoe door België reizen met de trein</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/airports" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>reizen naar de luchthaven</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/nmbs-stations/payment-methods"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>betaalmogelijkheden</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/prepare-for-your-journey/use-the-sncb-app"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>ontdek de NMBS-app</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Multimodaliteit</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/from-and-to-the-station/connections-with-tram-bus-subway"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>trein + bus/tram/metro</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/train-and-other-transport/train-bike"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>trein + fiets</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/train-and-other-transport/train-car"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>trein + auto</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/train-offer/s-train" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>S-trein : in en rond de stad</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation__panel-item " data-id="Tickets &amp; abonnementen">
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Tickets &amp; abonnementen </h4>
                            </div>
                        </div>
                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/search" class="link"><svg class="icon icon--12"
                                                    data-id="{930BC4B7-9624-49A6-BB8B-80939E12C7CE}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-standard" />
                                                </svg>koop je ticket</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/book-your-abonnement-online"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{65BD7BF9-43C7-46FF-B8A4-7BE4ED362D6B}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-abo-traject" />
                                                </svg>koop een nieuw abonnement</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/renew-my-abonnement" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{9845AA3A-40ED-4B6D-B2FB-5DBF922164B1}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-abo-citywide" />
                                                </svg>verleng je huidige abonnement</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Tickets &amp; abonnementen</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/overview-products/young-child"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>kinderen (-12 jaar) en jongeren (-26 jaar)</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/overview-products/adult-senior"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>volwassenen (26+) en senioren (65+)</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/abonnement" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>treinabonnementen en combi-abo's</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/groups" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>groepsreizen</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/overview-discount" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>individuele voordelen</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Supplementen</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/class-upgrade" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>klasverhoging</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/bike-ticket" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>fiets supplement</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/pet-ticket" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>huisdier supplement</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Voordeeltickets voor uitstapjes</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/leisure/discovery-ticket" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Discovery Ticket</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/leisure/music-events" class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Bravo! Ticket, festival- en concerttickets </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Luchthavens</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/airports/brussels-airport"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{060E2D0A-9075-4C10-BBF5-0CEDCE76B99C}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-airport" />
                                                </svg>Brussels Airport</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/airports/charleroi-airport"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{060E2D0A-9075-4C10-BBF5-0CEDCE76B99C}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-airport" />
                                                </svg>Charleroi Airport</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Reizen buiten België</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/tickets-and-railcards/overview-products/outside-belgium"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>grensbestemmingen</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL?utm_campaign=helloeurope&amp;utm_medium=referral-internal&amp;utm_source=belgiantrain.be&amp;utm_content=menulink_nl_outside-belgium"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{9AD7865D-2AAF-48BC-92CF-F5C2F69DADC9}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-external" />
                                                </svg>binnen Europa</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Parking</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/b-parking"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>auto</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/b-parking-bike"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>fiets</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation__panel-item " data-id="Stationsinformatie">
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Stationsinformatie </h4>
                            </div>
                        </div>
                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>NMBS-stations</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information" class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>zoek een station</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Parkeren aan het station</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/b-parking"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>autoparkings</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/b-parking-bike"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>fietsparkings</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Diensten in het station</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-info/prepare-for-your-journey/assistance-reduced-mobility"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>assistentie aanvragen voor reizigers met beperkte mobiliteit</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/nmbs-stations/how-do-ticket-vending-machines-work"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>hoe werkt de automaat in het station</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/nmbs-stations/luggage-storage"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>bagagekluizen</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/nmbs-stations/free-wifi" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>wifi in het station</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/rent-a-bike-at-the-station"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>huur een fiets aan het station</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/car-or-bike-at-station/rent-a-car-at-the-station"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>huur een auto aan het station</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Regels en veiligheid</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/station-information/nmbs-stations/station-regulations"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>stationsreglement</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/about-sncb/en-route-vers-mieux/security/security-in-society"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{FAF7212D-3C77-4717-AEBD-67B4D93909F5}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-phone" />
                                                </svg>0800/30 230 - veiligheid in het station en op de trein</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation__panel-item " data-id="Reisideeën">
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Reisideeën </h4>
                            </div>
                        </div>

                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/search" class="link"><svg class="icon icon--12"
                                                    data-id="{930BC4B7-9624-49A6-BB8B-80939E12C7CE}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-standard" />
                                                </svg>koop je ticket</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>(Her)ontdek België</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-ideas/inspiration/discover-belgium" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>de leukste activiteiten van het moment</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-ideas/inspiration/nmbs-sncb-blog" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>NMBS-blog: de beste reisideeën</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Uitstapjes</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/leisure/discovery-ticket" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{6C0B88D3-273A-4989-84FE-846C7F93A067}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-b-day-sensation" />
                                                </svg>dierenparken, pretparken en musea</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/leisure/music-events" class="link"><svg class="icon icon--12"
                                                    data-id="{02DD7FBB-2BFA-4693-99E3-68B91214C6B8}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-music" />
                                                </svg>festivals en concerten </a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/leisure/b-excursions/more/happy-trip" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{50E8C930-F9D0-457C-B1B5-BB2DF3C50C7D}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-home-ticket" />
                                                </svg>hotels</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/travel-ideas/inspiration/discover-belgium/walks"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>wandelingen</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Nieuwsbrief</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/support/customer-service/newsletter" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>schrijf je in voor de nieuwsbrief</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation__panel-item " data-id="Voor werkgevers en werknemers">
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Voor werkgevers en werknemers </h4>
                            </div>
                        </div>
                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="https://www.belgianrail.be/nl/b2b/Public/Login"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{9AD7865D-2AAF-48BC-92CF-F5C2F69DADC9}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-external" />
                                                </svg>aanmelden bij NMBS Business Portal</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/mobility-for-business" class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>ons aanbod voor woon-werkverkeer</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Voor werknemers</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/mobility-for-business/for-employees" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>alle info voor werknemers</a>
                                        </li>
                                    </ul>
                                </div>


                            </div>

                            <div class="col col-md-12 col-lg-6">



                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Voor werkgevers</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/mobility-for-business/for-employers" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>alle oplossingen voor werkgevers</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL/Zakenreizen?utm_campaign=helloeurope&amp;utm_medium=referral-internal&amp;utm_source=belgiantrain.be&amp;utm_content=menulink_nl_business"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>internationale zakenreizen per trein (Thalys, Eurostar, TGV, ICE
                                                enz.)</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Contact voor bedrijven</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/mobility-for-business/b2b-webform" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>vul het contactformulier in</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="tel:025282528" class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>bel het Business Center (maandag-donderdag: 9-17u, vrijdag:
                                                9-16u)</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation__panel-item " data-id="Internationale reizen">
                        <div class="nav-sidebar-panel__header">
                            <div class="nav-sidebar-panel__header-title row">
                                <h4 class="h1">Internationale reizen </h4>
                            </div>
                        </div>
                        <div class="row gutter-lg-40">
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL?utm_source=belgiantrain.be&amp;utm_medium=referral-internal&amp;utm_content=menulink_nl&amp;utm_campaign=helloeurope"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{9AD7865D-2AAF-48BC-92CF-F5C2F69DADC9}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-external" />
                                                </svg>reserveer je tickets bij NMBS Internationaal</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL/Zakenreizen?utm_medium=referral-internal&amp;utm_source=belgiantrain.be&amp;utm_content=menulink_nl_business&amp;utm_campaign=helloeurope"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{9AD7865D-2AAF-48BC-92CF-F5C2F69DADC9}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-external" />
                                                </svg>business partners: reserveer je tickets</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Reizen over de grens</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/aachen" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Aken</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/maastricht"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Maastricht</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/roosendaal"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Roosendaal</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/lille" class="link"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Rijsel</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/maubeuge-aulnoye-aymeries"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Maubeuge / Aulnoye-Aymeries</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="/nl/international/just-outside-belgium/luxembourg"
                                                class="link"><svg class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Luxemburg</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col col-md-12 col-lg-6">
                                <div class="navigation__item " data-tag-list="Main Menu Links Group">
                                    <h5 class="navigation__item-title navigation__item-title--disabled">
                                        <p>Je favoriete bestemmingen in Europa</p>
                                    </h5>
                                    <ul class="navigation__links">
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL/Bestemmingen/Parijs?utm_source=belgiantrain.be&amp;utm_medium=referral-internal&amp;utm_content=menulinkParis_nl&amp;utm_campaign=helloeurope"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        xlink:href="#icon-arrow-right" />
                                                </svg>Parijs</a>
                                        </li>
                                        <li class="navigation__links-item ">
                                            <a href="https://www.b-europe.com/NL/Bestemmingen/Londen?utm_source=belgiantrain.be&amp;utm_medium=referral-internal&amp;utm_content=menulinkLonden_nl&amp;utm_campaign=helloeurope"
                                                rel="noopener noreferrer" class="link" target="_blank"><svg
                                                    class="icon icon--12"
                                                    data-id="{80C55728-AA43-4FE6-B2D8-451B4EAF188A}" focusable="false"
                                                    role="img">
                                                    <use xmlns:xlink="http://w
