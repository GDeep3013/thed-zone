<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="shopify-api-key" content="{{$apiKey}}" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
	<title>Custom Return</title>
    <script>
        var Config = {
            shop: "{{$shop}}",
            apiKey: "{{$apiKey}}",
            host: new URLSearchParams(location.search).get("host"),
            forceRedirect: true,
            shopOrigin:`https://{{$shop}}`,
            appUrl:"{{$appUrl}}",
            csrf_token: '<?php echo csrf_token(); ?>'
        };
    </script>
        @viteReactRefresh
        @vite('resources/js/app.jsx')
</head>
<body>
	<div id="root"></div>
</body>
</html>