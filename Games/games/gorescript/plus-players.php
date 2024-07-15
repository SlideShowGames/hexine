<?PHP
error_reporting(E_ALL);
ini_set("display_errors", "On");

$url = 'http://getentangled.appspot.com/'.str_replace(".php","",basename($_SERVER['REQUEST_URI']));
$method = $_SERVER['REQUEST_METHOD'];

$session = curl_init($url);

curl_setopt($session, CURLOPT_HEADER,         false);
curl_setopt($session, CURLOPT_FOLLOWLOCATION, true); 
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

if ($method == "POST")
{
    curl_setopt($session, CURLOPT_POST, 1);
    curl_setopt($session, CURLOPT_POSTFIELDS, $_POST);
}

$response = curl_exec($session);

print $response;

curl_close($session);
?>